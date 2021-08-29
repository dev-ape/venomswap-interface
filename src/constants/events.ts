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
  img: string
}

export const EVENTS_INFO: {
  [chainId in ChainId]?: ConfigEventInfo[]
} = {
  [ChainId.BSC_MAINNET]: [],
  [ChainId.BSC_TESTNET]: [
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
        { pid: 0, title: 'Arsenal', img: '/images/events/arsenal.png' },
        { pid: 1, title: 'Liverpool', img: '/images/events/liverpool.png' }
      ]
    }
  ]
}
