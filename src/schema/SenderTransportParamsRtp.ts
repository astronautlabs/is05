
/**
 * Describes RTP Sender transport parameters. The constraints in this schema are minimum constraints, but may be further constrained at the constraints endpoint. As a minimum all senders must support `source_ip`, `destination_ip`, `source_port`, `rtp_enabled` and `destination_port`. Senders supporting FEC and/or RTCP must support parameters prefixed with `fec` and `rtcp` respectively.
 */
export type SenderTransportParamsRtp = {
    
    /**
     * IP address from which RTP packets will be sent (IP address of interface bound to this output). The sender should provide an enum in the constraints endpoint, which should contain the available interface addresses. If the parameter is set to auto the sender should establish for itself which interface it should use, based on routing rules or its own internal configuration.
     */
    source_ip? : string,
    
    /**
     * IP address to which RTP packets will be sent. If auto is set the sender should select a multicast address to send to itself. For example it may implement MADCAP (RFC 2730), ZMAAP, or be allocated address by some other system responsible for co-ordination multicast address use.
     */
    destination_ip? : string,
    
    /**
     * source port for RTP packets (auto = 5004 by default)
     */
    source_port? : number | string,
    
    /**
     * destination port for RTP packets (auto = 5004 by default)
     */
    destination_port? : number | string,
    
    /**
     * FEC on/off
     */
    fec_enabled? : boolean,
    
    /**
     * May be used if NAT is being used at the destination (auto = destination_ip by default)
     */
    fec_destination_ip? : string,
    
    /**
     * forward error correction mode to apply
     */
    fec_type? : string,
    
    /**
     * forward error correction mode to apply
     */
    fec_mode? : string,
    
    /**
     * width of block over which FEC is calculated in packets
     */
    fec_block_width? : number,
    
    /**
     * height of block over which FEC is calculated in packets
     */
    fec_block_height? : number,
    
    /**
     * destination port for RTP Column FEC packets (auto = RTP destination_port + 2 by default)
     */
    fec1D_destination_port? : number | string,
    
    /**
     * destination port for RTP Row FEC packets (auto = RTP destination_port + 4 by default)
     */
    fec2D_destination_port? : number | string,
    
    /**
     * source port for RTP FEC packets (auto = RTP source_port + 2 by default)
     */
    fec1D_source_port? : number | string,
    
    /**
     * source port for RTP FEC packets (auto = RTP source_port + 4 by default)
     */
    fec2D_source_port? : number | string,
    
    /**
     * rtcp on/off
     */
    rtcp_enabled? : boolean,
    
    /**
     * IP address to which RTCP packets will be sent (auto = same as RTP destination_ip by default)
     */
    rtcp_destination_ip? : string,
    
    /**
     * destination port for RTCP packets (auto = RTP destination_port + 1 by default)
     */
    rtcp_destination_port? : number | string,
    
    /**
     * source port for RTCP packets (auto = RTP source_port + 1 by default)
     */
    rtcp_source_port? : number | string,
    
    /**
     * RTP transmission active/inactive
     */
    rtp_enabled? : boolean
};