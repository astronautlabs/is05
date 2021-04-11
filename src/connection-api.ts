import { Body, Controller, Get, Patch, Post, Response, WebEvent } from "@alterior/web-server";
import { HttpError } from "@alterior/common";
import { Receiver, RegistryService, Sender } from "@astronautlabs/is04";
import { ConnectionService, IncorrectResourceTypeError, NotFoundError } from "./connection.service";
import { BulkReceiverPostSchema, BulkResponseSchema, BulkSenderPostSchema, ConstraintsSchema, Error, ReceiverResponseSchema, ReceiverStageSchema, SenderResponseSchema, SenderStageSchema } from "./schema";

@Controller()
export class ConnectionApi {
    constructor(
        private registry : RegistryService,
        private connectionService : ConnectionService
    ) {
    }

    @Get('/x-nmos/connection/:v') base() { return ['bulk/', 'single/']; }
    @Get('/x-nmos/connection/:v/bulk') bulk() { return [ 'senders/', 'receivers/' ]; }
    @Get('/x-nmos/connection/:v/bulk/senders') bulkSenders() { return Response.methodNotAllowed('OPTIONS, POST'); }
    @Get('/x-nmos/connection/:v/bulk/receivers') bulkReceivers() { return Response.methodNotAllowed('OPTIONS, POST'); }
    @Get('/x-nmos/connection/:v/single') single() { return [ 'senders/', 'receivers/' ]; }
    @Get('/x-nmos/connection/:v/single/senders') singleSenders() { return this.registry.senders.map(x => x.id); }
    @Get('/x-nmos/connection/:v/single/receivers') singleReceivers() { return this.registry.receivers.map(x => x.id); }

    @Post('/x-nmos/connection/:v/bulk/senders') 
    async updateBulkSenders(@Body() body : BulkSenderPostSchema): Promise<BulkResponseSchema> {
        let results : BulkResponseSchema = [];
        
        for (let obj of body) {
            try {
                let state = this.getSenderState(obj.id);
                this.connectionService.stageSenderState(obj.id, obj.params);
                results.push({ id: obj.id, code: 200 });
            } catch (e) {
                if (e instanceof HttpError) {
                    results.push(Object.assign(e.body, { id: obj.id }));
                } else {
                    results.push({
                        id: obj.id,
                        code: 500,
                        debug: `${e}`,
                        error: e.message
                    });
                }
            }
        }

        return results;
    }

    @Post('/x-nmos/connection/:v/bulk/receivers') 
    async updateBulkReceivers(@Body() body : BulkReceiverPostSchema): Promise<BulkResponseSchema> {
        let results : BulkResponseSchema = [];
        
        for (let obj of body) {
            try {
                let state = this.getReceiverState(obj.id);
                this.connectionService.stageSenderState(obj.id, obj.params);
                results.push({ id: obj.id, code: 200 });
            } catch (e) {
                if (e instanceof HttpError) {
                    results.push(Object.assign(e.body, { id: obj.id }));
                } else {
                    results.push({
                        id: obj.id,
                        code: 500,
                        debug: `${e}`,
                        error: e.message
                    });
                }
            }
        }

        return results;
    }

    
    @Get('/x-nmos/connection/:v/single/senders/:id') getSender(id : string) {
        return ['constraints/', 'staged/', 'active/', 'transportfile/', 'transporttype/'];
    }
    
    private getSenderState(id : string) {
        try {
            return this.connectionService.getSenderState(id);
        } catch (e) {
            if (e instanceof NotFoundError || e instanceof IncorrectResourceTypeError) {
                throw new HttpError(404, <Error>{
                    code: 404,
                    debug: 'not-found',
                    error: e.message
                })
            }

            throw e;
        }
    }

    private getReceiverState(id : string) {
        try {
            return this.connectionService.getReceiverState(id);
        } catch (e) {
            if (e instanceof NotFoundError || e instanceof IncorrectResourceTypeError) {
                throw new HttpError(404, <Error>{
                    code: 404,
                    debug: 'not-found',
                    error: e.message
                })
            }

            throw e;
        }
    }

    @Get('/x-nmos/connection/:v/single/senders/:id/constraints') 
    async getSenderConstraints(id : string): Promise<ConstraintsSchema> { 
        return this.getSenderState(id).constraints;
    }

    @Get('/x-nmos/connection/:v/single/senders/:id/staged') 
    async getSenderStaged(id : string): Promise<SenderStageSchema> { 
        return this.getSenderState(id).staged;
    }

    @Patch('/x-nmos/connection/:v/single/senders/:id/staged') 
    async patchSenderStaged(id : string, @Body() body : Partial<SenderStageSchema>): Promise<SenderStageSchema> { 
        let state = this.getSenderState(id);
        this.connectionService.stageSenderState(id, body);
        return state.staged;
    }

    @Get('/x-nmos/connection/:v/single/senders/:id/active') 
    async getSenderActive(id : string): Promise<SenderResponseSchema> { 
        return this.getSenderState(id).active;
    }

    @Get('/x-nmos/connection/:v/single/senders/:id/transportfile') 
    async getSenderTransportFile(id : string) { 
        let sender = this.getSenderState(id);
        let resource = <Sender>this.registry.getResourceById(id);

        if (sender.transportFile) {
            WebEvent.response
                .contentType(sender.transportFile.contentType)
                .send(sender.transportFile.content);
        } else if (resource.manifest_href) {
            WebEvent.response
                .redirect(307, resource.manifest_href);
        } else {
            console.error(`Error: Transport file requested for sender '${id} but no transport file is attached to it'`);
            throw new HttpError(500, <Error>{
                code: 500,
                debug: 'transport-file-not-specified',
                error: 'The transport file for this sender was not specified'
            });
        }
    }

    @Get('/x-nmos/connection/:v/single/senders/:id/transporttype') 
    async getSenderTransportType(id : string): Promise<string> { 
        let sender = <Sender>this.registry.getResourceById(id);
        return sender.transport;
    }

    @Get('/x-nmos/connection/:v/single/receivers/:id') 
    async getReceiver(id : string) { 
        return ['constraints/', 'staged/', 'active/', 'transporttype/'];
    }

    @Get('/x-nmos/connection/:v/single/receivers/:id/constraints') 
    async getReceiverConstraints(id : string): Promise<ConstraintsSchema> { 
        return this.getReceiverState(id).constraints;
    }

    @Get('/x-nmos/connection/:v/single/receivers/:id/staged') 
    async getReceiverStaged(id : string): Promise<ReceiverStageSchema> { 
        return this.getReceiverState(id).staged;
    }

    @Patch('/x-nmos/connection/:v/single/receivers/:id/staged') 
    async patchReceiverStaged(id : string, @Body() body : Partial<ReceiverStageSchema>): Promise<ReceiverStageSchema> { 
        let state = this.getReceiverState(id);
        this.connectionService.stageReceiverState(id, body);
        return state.staged;
    }

    @Get('/x-nmos/connection/:v/single/receivers/:id/active') 
    async getReceiverActive(id : string): Promise<ReceiverResponseSchema> { 
        return this.getReceiverState(id).active;
    }

    @Get('/x-nmos/connection/:v/single/receivers/:id/transporttype') 
    async getReceiverTransportType(id : string): Promise<string> { 
        let resource = <Receiver>this.registry.getResourceById(id);
        return resource.transport;
    }
}