import { Token } from '@venomswap/sdk'
import { CallState } from '../state/multicall/hooks'

export default function validStakeInfo(
  tokens: [Token, Token],
  poolInfo: CallState,
  pendingReward: CallState,
  userInfo: CallState,
  baseRewardsPerBlock: CallState,
  specificPoolRewardsPerBlock: CallState,
  startBlock: CallState,
  endBlock: CallState
): boolean {
  if (
    tokens &&
    poolInfo &&
    !poolInfo.error &&
    !poolInfo.loading &&
    poolInfo?.result?.[0] !== undefined &&
    pendingReward &&
    !pendingReward.error &&
    !pendingReward.loading &&
    pendingReward?.result?.[0] !== undefined &&
    userInfo &&
    !userInfo.error &&
    !userInfo.loading &&
    userInfo?.result?.[0] !== undefined &&
    baseRewardsPerBlock &&
    !baseRewardsPerBlock.error &&
    !baseRewardsPerBlock.loading &&
    baseRewardsPerBlock?.result?.[0] !== undefined &&
    specificPoolRewardsPerBlock &&
    !specificPoolRewardsPerBlock.error &&
    !specificPoolRewardsPerBlock.loading &&
    specificPoolRewardsPerBlock?.result?.[0] !== undefined &&
    startBlock &&
    !startBlock.error &&
    !startBlock.loading &&
    startBlock?.result?.[0] !== undefined &&
    endBlock &&
    !endBlock.error &&
    !endBlock.loading &&
    endBlock?.result?.[0] !== undefined
  ) {
    return true
  }

  return false
}
