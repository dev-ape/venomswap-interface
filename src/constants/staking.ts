import { ChainId, Token } from '@venomswap/sdk'
import getPairTokensWithDefaults from '../utils/getPairTokensWithDefaults'

export interface StakingRewardsInfo {
  pid: number
  tokens: [Token, Token]
  active: boolean
}

export const STAKING_REWARDS_INFO: {
  [chainId in ChainId]?: StakingRewardsInfo[]
} = {
  [ChainId.BSC_MAINNET]: [
    {
      pid: 0,
      tokens: getPairTokensWithDefaults(ChainId.BSC_MAINNET, 'WBNB/HEPA'),
      active: false
    },
    {
      pid: 1,
      tokens: getPairTokensWithDefaults(ChainId.BSC_MAINNET, 'HEPA/TAPE'),
      active: false
    },
    {
      pid: 2,
      tokens: getPairTokensWithDefaults(ChainId.BSC_MAINNET, 'HEPA/BANANA'),
      active: false
    }
  ],
  [ChainId.BSC_TESTNET]: [
    {
      pid: 0,
      tokens: getPairTokensWithDefaults(ChainId.BSC_TESTNET, 'WBNB/HEPA'),
      active: true
    }
  ]
}
