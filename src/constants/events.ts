import { ChainId, Token } from '@venomswap/sdk'
import getPairTokensWithDefaults from '../utils/getPairTokensWithDefaults'

export interface EventInfo {
  event: string
  address: string
  tokens: [Token, Token]
  active: boolean
  pools: EventPoolInfo[]
}

export interface EventPoolInfo {
  pid: number
  option: string
}

export const EVENTS_INFO: {
  [chainId in ChainId]?: EventInfo[]
} = {
  [ChainId.BSC_MAINNET]: [],
  [ChainId.BSC_TESTNET]: [
    {
      event: '5th September: Liverpool vs Chelsea',
      address: '0x0',
      tokens: getPairTokensWithDefaults(ChainId.BSC_TESTNET, 'WBNB/DUEL'),
      active: true,
      pools: [
        { pid: 0, option: 'Liverpool Win' },
        { pid: 1, option: 'Chelsea Win' },
        { pid: 2, option: 'Draw' }
      ]
    }
  ]
}
