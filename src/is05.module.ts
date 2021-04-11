import { IS04Module } from "@astronautlabs/is04";
import { Module } from "@alterior/di";
import { ConnectionService } from "./connection.service";

@Module({
    imports: [
        IS04Module
    ],
    providers: [
        ConnectionService
    ]
})
export class IS05Module {
}