import { SenderTransportParamsRtp } from "./SenderTransportParamsRtp";
import { SenderTransportParamsDash } from "./SenderTransportParamsDash";
import { SenderTransportParamsWebsocket } from "./SenderTransportParamsWebsocket";
import { SenderTransportParamsMqtt } from "./SenderTransportParamsMqtt";
/**
 * Transport-specific parameters. If this parameter is included in a client request it must include the same number of array elements (or 'legs') as specified in the constraints. If no changes are required to a specific leg it must be included as an empty object ({}).
 */
export type SenderTransportParams = Array<SenderTransportParamsRtp> | Array<SenderTransportParamsDash> | Array<SenderTransportParamsWebsocket> | Array<SenderTransportParamsMqtt>;