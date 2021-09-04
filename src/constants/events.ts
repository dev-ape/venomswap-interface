import { ChainId, Token } from '@venomswap/sdk'
import getPairTokensWithDefaults from '../utils/getPairTokensWithDefaults'

export interface ConfigEventInfo {
  title: string
  desc: string
  address: string
  tokens: [Token, Token]
  active: boolean
  startBlock: number
  endBlock: number
  pools: ConfigEventPoolInfo[]
}

export interface ConfigEventPoolInfo {
  pid: number
  title: string
  img1: string
  img2: string
}

export const EVENTS_INFO: {
  [chainId in ChainId]?: ConfigEventInfo[]
} = {
  [ChainId.BSC_MAINNET]: [
    {
      title: 'BTC Price Guess OLD',
      desc: 'WITHDRAW FROM THIS POOL, and deposit to the new POOL',
      address: '0xaF7BF584be79d5335ac1c2404215B3F809684bA2',
      tokens: getPairTokensWithDefaults(ChainId.BSC_MAINNET, 'WBNB/DUEL'),
      active: true,
      startBlock: 10630150,
      endBlock: 10630150,
      pools: [
        { pid: 0, title: 'BTC HIGHER', img1: '/images/events/btc.png', img2: '/images/events/duel_dark.png' },
        { pid: 1, title: 'BTC LOWER', img1: '/images/events/btc.png', img2: '/images/events/duel_dark.png' }
      ]
    },
    {
      title: 'BTC Price Guess NEW',
      desc:
        'You win if you correctly guess the price of BTC. Will it be higher or lower then $52,400 USD at 11 September 23:59 UTC?',
      address: '0xC231470e926678CfE8539acdd8b748082A2e4476',
      tokens: getPairTokensWithDefaults(ChainId.BSC_MAINNET, 'WBNB/DUEL'),
      active: true,
      startBlock: 10658800,
      endBlock: 10836621,
      pools: [
        { pid: 0, title: 'BTC HIGHER', img1: '/images/events/btc.png', img2: '/images/events/duel_dark.png' },
        { pid: 1, title: 'BTC LOWER', img1: '/images/events/btc.png', img2: '/images/events/duel_dark.png' }
      ]
    }
  ],
  [ChainId.BSC_TESTNET]: []
}
