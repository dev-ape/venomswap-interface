import { Blockchain } from '@venomswap/sdk'
import useBlockchain from './useBlockchain'

export default function usePlatformName(): string {
  const blockchain = useBlockchain()
  switch (blockchain) {
    case Blockchain.BINANCE_SMART_CHAIN:
      return 'Hepa Finance'
    case Blockchain.HARMONY:
      return 'Hepa Finance'
    case Blockchain.ETHEREUM:
      return 'Hepa Finance'
    default:
      return 'Hepa Finance'
  }
}
