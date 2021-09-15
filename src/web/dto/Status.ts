import { Hash } from '../../model/Block';
import { PeerNode, StatusRes } from '../Node';

type StatusResDTO = {
  block_hash: Hash;
  block_number: number;
  peers_known: PeerNodeDTO[];
};

type PeerNodeDTO = {
  ip: string;
  port: number;
  is_boosttrap: boolean;
  is_active: boolean;
};

export const statusResMap = (statusRes: StatusRes): StatusResDTO => {
  return {
    block_hash: statusRes.blockHash,
    block_number: statusRes.blockNumber,
    peers_known: statusRes.peersKnown.map(peerKnownMap),
  };
};

const peerKnownMap = (peersKnown: PeerNode): PeerNodeDTO => {
  return {
    ip: peersKnown.ip,
    port: peersKnown.port,
    is_boosttrap: peersKnown.isBootstrap,
    is_active: peersKnown.isActive,
  };
};
