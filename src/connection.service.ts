import { Injectable } from '@alterior/di';
import { Receiver, RegistryService, Sender } from '@astronautlabs/is04';
import { ActivationSchema, ConstraintSchema, ReceiverResponseSchema, ReceiverStageSchema, SenderResponseSchema, SenderStageSchema } from './schema';
import { Subject, Observable } from 'rxjs';
import { TaiTimestamp } from '@1500cloud/taitimestamp';
import * as tai from '@1500cloud/taitimestamp';
import { filter } from 'rxjs/operators';
import { taiTimeoutToUTC, taiTimestampToJsTime } from './utils';

export class NotFoundError extends Error {}
export class IncorrectResourceTypeError extends Error {}
export class PendingActivationError extends Error {};

export interface PendingActivation {
    pendingSince : TaiTimestamp;
    activation : ActivationSchema;
    cancel();
}

export interface StagedState {
    activation? : ActivationSchema;
    master_enable? : boolean;
}

export interface ActiveState {
    activation : ActivationSchema;
    master_enable : boolean;
}

export interface ResourceState {
    id : string;
    type : string;
    constraints : ConstraintSchema[];
    staged : StagedState;
    active : ActiveState;
    pendingActivation? : PendingActivation;

    /**
     * Specify a function that will be triggered when the staged settings should be 
     * applied to the underlying resource. If `scheduleActivation` is specified, this 
     * method is not used.
     */
    activate? : () => void;

    /**
     * Specify a function that will be used to schedule a staged activation for
     * this resource. The implementation should consult the `staged.activation`
     * object to determine what the activation schedule is.
     * 
     * This allows you to convey scheduled activations to a native implementation 
     * to increase accuracy. If this is not specified, the library will implement the 
     * various kinds of scheduled activation itself, calling the `activate()` function
     * to perform the actual application of the staged settings.
     * 
     * If this method is specified, then activate() is never called by the library, nor 
     * are scheduleActivation() implementations necessarily expected to call it. 
     * Implementations MUST however call the completed() callback so that the library 
     * can update the state object to reflect that activation has occurred.
     */
    scheduleActivation? : (completed : () => void) => PendingActivation;
}

export interface TransportFile {
    contentType : string;
    content : Buffer;
}
export interface SenderState extends ResourceState {
    type : 'sender';
    active : SenderResponseSchema;
    staged : SenderStageSchema;
    transportFile: TransportFile;
}

export interface ReceiverState extends ResourceState {
    type : 'receiver';
    active : ReceiverResponseSchema;
    staged : SenderStageSchema;
}

@Injectable()
export class ConnectionService {
    constructor(
        private registry : RegistryService
    ) {
    }

    private states = new Map<string, ResourceState>();

    private _onActivateState = new Subject<ResourceState>();

    get onActivateState(): Observable<ResourceState> {
        return this._onActivateState;
    }

    /**
     * Acquire an observable that emits at the moment that an activation is 
     * happening against the specific resource identified by the given ID.
     * 
     * Use this to implement the actual execution of an activation: ie to 
     * reconfigure a ST2110 sender etc. 
     * 
     * @param id 
     * @returns 
     */
    onActivateStateForResource(id : string): Observable<ResourceState> {
        return this.onActivateState.pipe(filter(r => r.id === id));
    }

    private async activate(state : ResourceState) {
        if (state.activate)
            state.activate();
        await this.markActivated(state);
    }

    private async markActivated(state : ResourceState) {
        state.pendingActivation = null;
        Object.assign(state.active, state.staged);
        this._onActivateState.next(state);

        let resource = this.registry.getResourceById(state.id);
        if (state.type === 'sender') {
            let senderResource = resource as Sender;
            let senderState = state as SenderState;
            
            senderResource.subscription = {
                active: state.active.master_enable,
                receiver_id: senderState.active.receiver_id
            };

            await this.registry.updateResource(senderResource);
        } else if (state.type === 'receiver') {
            let receiverResource = resource as Receiver;
            let receiverState = state as ReceiverState;

            receiverResource.subscription = {
                active: state.active.master_enable,
                sender_id: receiverState.active.sender_id
            }

            await this.registry.updateResource(receiverResource);
        }

    }

    /**
     * Stage a set of state parameters onto the resource identified by the given ID.
     * If `staged` includes an `activation` object, an activation will also be scheduled.
     * If an activation is already pending for the given object, an error will be thrown.
     * 
     * @param id ID of the resource to stage changes to
     * @param staged The state to stage
     */
    stageState<T extends Partial<StagedState>>(id : string, staged : T) {
        let state = this.getState(id);

        if (!state)
            throw new NotFoundError(`Cannot find state for resource with ID ${id}, is it registered?`);

        if (state.pendingActivation)
            throw new PendingActivationError(`Cannot stage new state: an activation is currently pending`);

        Object.assign(state.staged, staged);

        // If an activation has been set, go ahead and schedule that for the future

        if (staged.activation) {

            if (state.scheduleActivation) {
                // The resource is configured to use it's own implementation for handling scheduled
                // activation
                state.pendingActivation = state.scheduleActivation(async () => await this.markActivated(state));
            } else {
                if (staged.activation.mode === 'activate_immediate') {
                    this.activate(state);
                } else if (staged.activation.mode === 'activate_scheduled_relative') {
                    let interval = tai.taiTimestampFromMediaTimestamp(staged.activation.requested_time);
                    let seconds = taiTimeoutToUTC(interval);
                    let timeout = setTimeout(() => this.activate(state), seconds);
                    state.pendingActivation = {
                        activation: staged.activation,
                        pendingSince: tai.now(),
                        cancel: () => clearTimeout(timeout)
                    };
                } else if (staged.activation.mode === 'activate_scheduled_absolute') {
                    let timestamp = tai.taiTimestampFromMediaTimestamp(staged.activation.requested_time);
                    let utcTime = taiTimestampToJsTime(timestamp);
                    let interval = utcTime - Date.now();
                    let timeout = setTimeout(() => this.activate(state), interval);
                    state.pendingActivation = {
                        activation: staged.activation,
                        pendingSince: tai.now(),
                        cancel: () => clearTimeout(timeout)
                    };
                }
            }
        }
    }

    stageSenderState(id : string, state : Partial<SenderStageSchema>) {
        this.getSenderState(id); // called for validation / exceptions
        this.stageState(id, state);
    }

    stageReceiverState(id : string, state : Partial<ReceiverStageSchema>) {
        this.getReceiverState(id); // called for validation / exceptions
        this.stageState(id, state);
    }

    getSenderState(id : string): SenderState {
        let state = this.getState(id);
        if (state.type !== 'sender')
            throw new IncorrectResourceTypeError(`Resource ${id} is of type ${state.type} not sender`);
        return <SenderState>state;
    }

    getReceiverState(id : string): ReceiverState {
        let state = this.getState(id);
        if (state.type !== 'receiver')
            throw new IncorrectResourceTypeError(`Resource ${id} is of type ${state.type} not receiver`);
        return <ReceiverState>state;
    }

    getState(id : string): ResourceState {
        if (this.states.has(id))
            return this.states.get(id);

        let sender = this.registry.senders.find(x => x.id === id);
        let type = this.registry.getTypeOfResourceById(id);
        let obj = this.registry.getResourceById(id);

        if (!obj)
            throw new NotFoundError(`No such registered resource with ID ${id}, did you add it to the RegistryService?`);

        let state : ResourceState;

        if (type === 'sender') {
            state = <SenderState>{
                id,
                type: 'sender',
                active: {},
                constraints: {},
                staged: {}
            };
        } else if (type === 'receiver') {
            state = <ReceiverState>{
                id,
                type: 'receiver',
                active: {},
                constraints: {},
                staged: {}
            };
        } else {
            throw new IncorrectResourceTypeError(`Cannot getState() for resource of type ${type}`);
        }

        this.states.set(id, state);
        return state;
    }
}