import { ReceiverTransportParamsRtp } from "./ReceiverTransportParamsRtp";
import { ReceiverTransportParamsDash } from "./ReceiverTransportParamsDash";
import { ReceiverTransportParamsWebsocket } from "./ReceiverTransportParamsWebsocket";
import { ReceiverTransportParamsMqtt } from "./ReceiverTransportParamsMqtt";
/**
 * Transport-specific parameters. If this parameter is included in a client request it must include the same number of array elements (or 'legs') as specified in the constraints. If no changes are required to a specific leg it must be included as an empty object ({}).
 */
export type ReceiverTransportParams = Array<ReceiverTransportParamsRtp> | Array<ReceiverTransportParamsDash> | Array<ReceiverTransportParamsWebsocket> | Array<ReceiverTransportParamsMqtt>;