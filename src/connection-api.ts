import { Body, Controller, Get, Patch, Post, Response } from "@alterior/web-server";
import { RegistryService } from "@astronautlabs/is04";
import { ConstraintsSchema, ReceiverResponseSchema, ReceiverStageSchema, SenderResponseSchema, SenderStageSchema } from "./schema";

@Controller()
export class ConnectionApi {
    constructor(
        private registry : RegistryService
    ) {
    }

    @Get('/x-nmos/connection/:v') base() { return ['bulk/', 'single/']; }
    @Get('/x-nmos/connection/:v/bulk') bulk() { return [ 'senders/', 'receivers/' ]; }
    @Get('/x-nmos/connection/:v/bulk/senders') bulkSenders() { return Response.methodNotAllowed('OPTIONS, POST'); }
    @Get('/x-nmos/connection/:v/bulk/receivers') bulkReceivers() { return Response.methodNotAllowed('OPTIONS, POST'); }
    @Get('/x-nmos/connection/:v/single') single() { return [ 'senders/', 'receivers/' ]; }
    @Get('/x-nmos/connection/:v/single/senders') singleSenders() { return this.registry.senders.map(x => x.id); }
    @Get('/x-nmos/connection/:v/single/receivers') singleReceivers() { return this.registry.receivers.map(x => x.id); }

    @Post('/x-nmos/connection/:v/bulk/senders') updateBulkSenders() {
        // TODO
    }

    @Post('/x-nmos/connection/:v/bulk/receivers') updateBulkReceivers() {
        // TODO
    }

    
    @Get('/x-nmos/connection/:v/single/senders/:id') getSender(id : string) {
        return ['constraints/', 'staged/', 'active/', 'transportfile/', 'transporttype/'];
    }
    
    @Get('/x-nmos/connection/:v/single/senders/:id/constraints') 
    async getSenderConstraints(id : string): Promise<ConstraintsSchema> { 
        return null; // TODO 
    }

    @Get('/x-nmos/connection/:v/single/senders/:id/staged') 
    async getSenderStaged(id : string): Promise<SenderStageSchema> { 
        return null; // TODO
    }

    @Patch('/x-nmos/connection/:v/single/senders/:id/staged') 
    async patchSenderStaged(id : string, @Body() body : Partial<SenderStageSchema>): Promise<SenderStageSchema> { 
        return null; // TODO
    }

    @Get('/x-nmos/connection/:v/single/senders/:id/active') 
    async getSenderActive(id : string): Promise<SenderResponseSchema> { 
        return null; // TODO
    }

    @Get('/x-nmos/connection/:v/single/senders/:id/transportfile') 
    async getSenderTransportFile(id : string) { 
        return 'TODO'; 
    }

    @Get('/x-nmos/connection/:v/single/senders/:id/transporttype') 
    async getSenderTransportType(id : string): Promise<string> { 
        return 'urn:x-nmos:transport:mqtt'; // TODO
    }

    @Get('/x-nmos/connection/:v/single/receivers/:id') 
    async getReceiver(id : string) { 
        return ['constraints/', 'staged/', 'active/', 'transporttype/'];
    }

    @Get('/x-nmos/connection/:v/single/receivers/:id/constraints') 
    async getReceiverConstraints(id : string): Promise<ConstraintsSchema> { 
        return null; // TODO
    }

    @Get('/x-nmos/connection/:v/single/receivers/:id/staged') 
    async getReceiverStaged(id : string): Promise<ReceiverStageSchema> { 
        return null; // TODO 
    }

    @Patch('/x-nmos/connection/:v/single/receivers/:id/staged') 
    async patchReceiverStaged(id : string, @Body() body : Partial<ReceiverStageSchema>): Promise<ReceiverStageSchema> { 
        return null; // TODO 
    }

    @Get('/x-nmos/connection/:v/single/receivers/:id/active') 
    async getReceiverActive(id : string): Promise<ReceiverResponseSchema> { 
        return null; // TODO
    }

    @Get('/x-nmos/connection/:v/single/receivers/:id/transporttype') 
    async getReceiverTransportType(id : string): Promise<string> { 
        return ''; // TODO
    }
}