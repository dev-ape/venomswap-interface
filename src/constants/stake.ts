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
    address: '0x917bA6835537EF1faf7c5B586063A6b4BBE0E652',
    tokens: getPairTokensWithDefaults(ChainId.BSC_TESTNET, 'DUEL/DUEL')
  }
}
