import { ChainId, Token } from '@venomswap/sdk'
import getPairTokensWithDefaults from '../utils/getPairTokensWithDefaults'

export interface ConfigEventInfo {
  title: string
  desc: string
  address: string
  tokens: [Token, Token]
  active: boolean
  pools: ConfigEventPoolInfo[]
}

export interface ConfigEventPoolInfo {
  pid: number
  title: string
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
      address: '0xfa75D93384b38E48b30CcFf03cc65ED46ce1c0A2',
      tokens: getPairTokensWithDefaults(ChainId.BSC_TESTNET, 'WBNB/DUEL'),
      active: true,
      pools: [
        { pid: 0, title: 'Arsenal' },
        { pid: 1, title: 'Liverpool' }
      ]
    }
  ]
}
