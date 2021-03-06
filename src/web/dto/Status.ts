import { Hash } from '../../model/Block';
import { PeerNode } from '../Node';
import { StatusRes } from '../routes';


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

export const mapStatusResToDTO = ({blockHash, blockNumber, peersKnown}: StatusRes): StatusResDTO => ({
  block_hash: blockHash,
  block_number: blockNumber,
  peers_known: Object.keys(peersKnown).map(key => mapPeerKnownToDTO(peersKnown[key])),
});

export const mapDTOToStatusRes = ({block_hash, block_number, peers_known}: StatusResDTO): StatusRes => ({
  blockHash: block_hash,
  blockNumber: block_number,
  peersKnown: peers_known.reduce((acc, peer: PeerNodeDTO) => {
    const peerNode: PeerNode = mapDTOToPeerKnown(peer)
    return {
      ...acc,
      [peerNode.getTCPAddress()]: peerNode
    }
  }, {}),
});


const mapPeerKnownToDTO = (peersKnown: PeerNode): PeerNodeDTO => ({
  ip: peersKnown.ip,
  port: peersKnown.port,
  is_boosttrap: peersKnown.isBootstrap,
  is_active: peersKnown.isActive,
});

const mapDTOToPeerKnown = ({ip, port, is_boosttrap, is_active}: PeerNodeDTO): PeerNode => 
  new PeerNode(ip, port, is_boosttrap, is_active);
