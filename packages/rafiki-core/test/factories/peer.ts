import { Factory } from 'rosie'
import { Peer } from '../../src/services/peers'
import { PeerInfoFactory } from './peerInfo'
import { IlpFulfillFactory } from './ilpPacket'
import { serializeIlpFulfill } from 'ilp-packet'

const fulfill = serializeIlpFulfill(IlpFulfillFactory.build())
export const PeerFactory = Factory.define<Peer>('Peer').attrs({
  ...PeerInfoFactory.build(),
  send: () => Promise.resolve(fulfill)
})
