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
      title: 'BTC Price Guess',
      desc:
        'You win if you correctly guess the price of BTC. Will it be higher or lower then $45,000 USD at 7 September 23:59 UTC?',
      address: '0x12B75625618B6e7c473a1284B3209ec0b66A9f45',
      tokens: getPairTokensWithDefaults(ChainId.BSC_MAINNET, 'WBNB/DUEL'),
      active: true,
      startBlock: 10595531,
      endBlock: 10596731,
      pools: [
        { pid: 0, title: 'BTC HIGHER', img1: '/images/events/btc.png', img2: '/images/events/duel_dark.png' },
        { pid: 1, title: 'BTC LOWER', img1: '/images/events/btc.png', img2: '/images/events/duel_dark.png' }
      ]
    }
  ],
  [ChainId.BSC_TESTNET]: [
    {
      title: 'BTC Price Guess',
      desc:
        'You win if you correctly guess the price of BTC. Will it be higher or lower then $45,000 USD at 7 September 23:59 UTC?',
      address: '0x35f7424f5ddb53DAF0242D990314e1C6A83c8B4B',
      tokens: getPairTokensWithDefaults(ChainId.BSC_TESTNET, 'WBNB/DUEL'),
      active: true,
      startBlock: 12018633,
      endBlock: 12019033,
      pools: [
        { pid: 0, title: 'BTC HIGHER', img1: '/images/events/btc.png', img2: '/images/events/duel_dark.png' },
        { pid: 1, title: 'BTC LOWER', img1: '/images/events/btc.png', img2: '/images/events/duel_dark.png' }
      ]
    },
    {
      title: 'Premier League',
      desc:
        'Which team will win the FA Cup? Make your choice, join the duel by staking your lps to the corresponding pool, get higher APR when you win.',
      address: '0xC7Ca29d9ae3ddeD2eceCee12F17CCD144c84ef63',
      tokens: getPairTokensWithDefaults(ChainId.BSC_TESTNET, 'WBNB/DUEL'),
      active: true,
      startBlock: 11864859,
      endBlock: 11926059,
      pools: [
        { pid: 0, title: 'Arsenal', img1: '/images/events/arsenal.png', img2: '/images/events/duel_dark.png' },
        { pid: 1, title: 'Liverpool', img1: '/images/events/liverpool.png', img2: '/images/events/duel_dark.png' }
      ]
    }
  ]
}
