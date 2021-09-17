import { useMemo } from 'react'
import { ChainId } from '@venomswap/sdk'
import { StakeInfo, STAKE_INFO } from 'constants/stake'

export default function useConfigStaking(chainId: ChainId | undefined): StakeInfo | undefined {
  return useMemo(() => {
    return chainId ? STAKE_INFO[chainId] : undefined
  }, [chainId])
}
