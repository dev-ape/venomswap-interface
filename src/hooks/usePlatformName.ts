import { Blockchain } from '@venomswap/sdk'
import useBlockchain from './useBlockchain'

export default function usePlatformName(): string {
  const blockchain = useBlockchain()
  switch (blockchain) {
    case Blockchain.BINANCE_SMART_CHAIN:
      return 'Duel Network'
    case Blockchain.HARMONY:
      return 'Duel Network'
    case Blockchain.ETHEREUM:
      return 'Duel Network'
    default:
      return 'Duel Network'
  }
}
