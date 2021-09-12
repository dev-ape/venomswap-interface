import { ChainId, Token } from '@venomswap/sdk'
import getPairTokensWithDefaults from '../utils/getPairTokensWithDefaults'

export interface StakeInfo {
  address: string
  tokens: [Token, Token]
}

export const STAKE_INFO: {
  [chainId in ChainId]?: StakeInfo | undefined
} = {
  [ChainId.BSC_MAINNET]: undefined,
  [ChainId.BSC_TESTNET]: {
    address: '0xF682aD1CAc9De901c7f3dB1580Cb4620Fa1A8718',
    tokens: getPairTokensWithDefaults(ChainId.BSC_TESTNET, 'DUEL/DUEL')
  }
}
