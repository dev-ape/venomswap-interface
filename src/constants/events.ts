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
  [ChainId.BSC_MAINNET]: [],
  [ChainId.BSC_TESTNET]: [
    {
      title: 'BTC Price Guess',
      desc:
        'You win if you correctly guess the price of BTC. Will it be higher or lower then $45,000 USD at 7 September 23:59 UTC?',
      address: '0x47741D4ece40bE7f5714853Cd69724f920e43458',
      tokens: getPairTokensWithDefaults(ChainId.BSC_TESTNET, 'WBNB/DUEL'),
      active: true,
      startBlock: 11992648,
      endBlock: 11993848,
      pools: [
        { pid: 0, title: 'BTC HIGHER', img1: '/images/events/btc.png', img2: '/images/events/duel_dark.png' },
        { pid: 1, title: 'BTC LOWER', img1: '/images/events/btc.png', img2: '/images/events/duel_dark.png' }
      ]
    },    
    {
      title: 'BTC Price Guess',
      desc:
        'You win if you correctly guess the price of BTC. Will it be higher or lower then $45,000 USD at 7 September 23:59 UTC?',
      address: '0xA6b9050a28e7Cb349EEA3AA907e2D7B01fbEFFdA',
      tokens: getPairTokensWithDefaults(ChainId.BSC_TESTNET, 'WBNB/DUEL'),
      active: true,
      startBlock: 11986650,
      endBlock: 11987850,
      pools: [
        { pid: 0, title: 'BTC HIGHER', img1: '/images/events/btc.png', img2: '/images/events/duel_dark.png' },
        { pid: 1, title: 'BTC LOWER', img1: '/images/events/btc.png', img2: '/images/events/duel_dark.png' }
      ]
    },
    {
      title: 'BTC Price Guess',
      desc:
        'You win if you correctly guess the price of BTC. Will it be higher or lower then $45,000 USD at 7 September 23:59 UTC?',
      address: '0xE62D415D125c0b2F416130E234ed1Ce815F82d08',
      tokens: getPairTokensWithDefaults(ChainId.BSC_TESTNET, 'WBNB/DUEL'),
      active: true,
      startBlock: 11986250,
      endBlock: 11986650,
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
