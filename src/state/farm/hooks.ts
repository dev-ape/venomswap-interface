import { CurrencyAmount, JSBI, Token, TokenAmount, Fraction } from '@venomswap/sdk'
import { useMemo } from 'react'
import { useActiveWeb3React } from '../../hooks'
import { useSingleCallResult } from '../multicall/hooks'
import { tryParseAmount } from '../swap/hooks'
import { useStakeContract } from '../../hooks/useContract'
import useTokensWithWethPrices from '../../hooks/useTokensWithWETHPrices'
import getBlocksPerYear from '../../utils/getBlocksPerYear'
import determineBaseToken from '../../utils/determineBaseToken'
import useConfigStaking from 'hooks/useStakingConfig'
import validStakeInfo from 'utils/validStakeInfo'
import { useBlockNumber } from 'state/application/hooks'

export interface StakeInfo {
  // the pool id (pid) of the pool
  pid: number
  // the tokens involved in this pair
  tokens: [Token, Token]
  // baseToken used for TVL & APR calculations
  baseToken: Token | undefined
  // the allocation point for the given pool
  allocPoint: JSBI
  // start block for all the rewards pools
  startBlock: number
  // end block for all the rewards pools
  endBlock: number
  // base rewards per block
  baseRewardsPerBlock: TokenAmount
  // pool specific rewards per block
  poolRewardsPerBlock: TokenAmount
  // blocks generated per year
  blocksPerYear: JSBI
  // pool share vs all pools
  poolShare: Fraction
  // the amount of currently total staked tokens in the pool
  totalStakedAmount: TokenAmount
  // the amount of token currently staked, or undefined if no account
  stakedAmount: TokenAmount
  // the ratio of the user's share of the pool
  stakedRatio: Fraction
  // the amount of reward token earned by the active account, or undefined if no account
  earnedAmount: TokenAmount
  // value of total staked amount, measured in weth
  valueOfTotalStakedAmountInWeth: TokenAmount | Fraction | undefined
  // value of total staked amount, measured in a USD stable coin (busd, usdt, usdc or a mix thereof)
  valueOfTotalStakedAmountInUsd: Fraction | undefined
  // pool APR
  apr: Fraction | undefined
  // if pool is active
  active: boolean
  // if can deposit
  canDeposit: boolean
}

export function useStakeInfo(address: string | undefined): StakeInfo | undefined {
  const { chainId, account } = useActiveWeb3React()

  const stakeContract = useStakeContract(address)
  const stakingConfig = useConfigStaking(chainId)

  const pid = 0

  const tokensWithPrices = useTokensWithWethPrices()

  const weth = tokensWithPrices?.WETH?.token
  //const wethBusdPrice = useBUSDPrice(weth)
  const govToken = tokensWithPrices?.govToken?.token
  const govTokenWETHPrice = tokensWithPrices?.govToken?.price

  const blocksPerYear = getBlocksPerYear(chainId)

  const pidAccountMapping = useMemo(() => (account ? [pid, account] : [undefined, undefined]), [pid, account])

  const poolInfo = useSingleCallResult(stakeContract, 'poolInfo', [pid])

  const userInfo = useSingleCallResult(stakeContract, 'userInfo', pidAccountMapping)

  const pendingReward = useSingleCallResult(stakeContract, 'getPendingRewards', pidAccountMapping)

  const startBlock = useSingleCallResult(stakeContract, 'startBlock')
  const endBlock = useSingleCallResult(stakeContract, 'endBlock')
  const lastBlockNumber = useBlockNumber()
  const baseRewards = useSingleCallResult(stakeContract, 'tokenPerBlock')

  return useMemo(() => {
    if (!chainId || !weth || !govToken || !stakingConfig) return undefined

    const tokens = stakingConfig.tokens

    // amount uint256, rewardDebt uint256, rewardDebtAtBlock uint256, lastWithdrawBlock uint256, firstDepositBlock uint256, blockdelta uint256, lastDepositBlock uint256
    const baseRewardsPerBlock = baseRewards
    const specificPoolRewardsPerBlock = baseRewards

    if (
      validStakeInfo(
        tokens,
        poolInfo,
        pendingReward,
        userInfo,
        baseRewardsPerBlock,
        specificPoolRewardsPerBlock,
        startBlock,
        endBlock
      )
    ) {
      const baseBlockRewards = new TokenAmount(govToken, JSBI.BigInt(baseRewardsPerBlock?.result?.[0] ?? 0))

      const poolBlockRewards = specificPoolRewardsPerBlock?.result?.[0]
        ? new TokenAmount(govToken, JSBI.BigInt(specificPoolRewardsPerBlock?.result?.[0] ?? 0))
        : baseBlockRewards

      const poolShare = new Fraction(poolBlockRewards.raw, baseBlockRewards.raw)

      const calculatedTotalPendingRewards = JSBI.BigInt(pendingReward?.result?.[0] ?? 0)

      const stakedAmount = new TokenAmount(tokens[0], JSBI.BigInt(userInfo?.result?.amount ?? 0))
      const totalStakedAmount = new TokenAmount(tokens[0], JSBI.BigInt(poolInfo?.result?.supply ?? 0))
      const stakedRatio = new Fraction(stakedAmount.raw, totalStakedAmount.raw)

      const totalPendingRewardAmount = new TokenAmount(govToken, calculatedTotalPendingRewards)
      const startsAtBlock = startBlock.result?.[0] ?? 0
      const endsAtBlock = endBlock.result?.[0] ?? 0
      const canDeposit = lastBlockNumber ? lastBlockNumber < endsAtBlock : false

      // poolInfo: lpToken address, allocPoint uint256, lastRewardBlock uint256, accGovTokenPerShare uint256
      const poolInfoResult = poolInfo.result
      const allocPoint = JSBI.BigInt(poolInfoResult && poolInfoResult[1])
      const active = poolInfoResult && JSBI.GT(JSBI.BigInt(allocPoint), 0) ? true : false

      const baseToken = determineBaseToken(tokensWithPrices, tokens)
      const totalStakedAmountWETH = undefined
      const totalStakedAmountBUSD = undefined
      const apr = undefined

      //   const totalStakedAmountWETH = calculateWethAdjustedTotalStakedAmount(
      //     chainId,
      //     baseToken,
      //     tokensWithPrices,
      //     tokens,
      //     totalLpTokenSupply,
      //     totalStakedAmount,
      //     lpTokenReserve?.result
      //   )

      //   const totalStakedAmountBUSD =
      //     wethBusdPrice && totalStakedAmountWETH && totalStakedAmountWETH.multiply(wethBusdPrice?.raw)

      //   const apr = totalStakedAmountWETH
      //     ? calculateApr(govTokenWETHPrice, baseBlockRewards, blocksPerYear, poolShare, totalStakedAmountWETH)
      //     : undefined

      const stakingInfo = {
        pid: pid,
        tokens: tokens,
        baseToken: baseToken,
        allocPoint: allocPoint,

        startBlock: startsAtBlock,
        endBlock: endsAtBlock,
        baseRewardsPerBlock: baseBlockRewards,
        poolRewardsPerBlock: poolBlockRewards,
        blocksPerYear: blocksPerYear,
        poolShare: poolShare,
        totalStakedAmount: totalStakedAmount,
        stakedAmount: stakedAmount,
        stakedRatio: stakedRatio,
        earnedAmount: totalPendingRewardAmount,
        valueOfTotalStakedAmountInWeth: totalStakedAmountWETH,
        valueOfTotalStakedAmountInUsd: totalStakedAmountBUSD,
        apr: apr,
        active: active,
        canDeposit: canDeposit
      }

      return stakingInfo
    }
    return undefined
  }, [
    chainId,
    stakingConfig,
    tokensWithPrices,
    weth,
    govToken,
    govTokenWETHPrice,
    pid,
    poolInfo,
    userInfo,
    pendingReward,
    blocksPerYear,
    startBlock,
    endBlock
  ])
}

// based on typed value
export function useDerivedStakeInfo(
  typedValue: string,
  stakingToken: Token,
  unstakedAmount: TokenAmount | undefined
): {
  parsedAmount?: CurrencyAmount
  error?: string
} {
  const { account } = useActiveWeb3React()

  const parsedInput: CurrencyAmount | undefined = tryParseAmount(typedValue, stakingToken)

  const parsedAmount =
    parsedInput && unstakedAmount && JSBI.lessThanOrEqual(parsedInput.raw, unstakedAmount.raw) ? parsedInput : undefined

  let error: string | undefined
  if (!account) {
    error = 'Connect Wallet'
  }
  if (!parsedAmount) {
    error = error ?? 'Enter an amount'
  }

  return {
    parsedAmount,
    error
  }
}

// based on typed value
export function useDerivedUnstakeInfo(
  typedValue: string,
  stakingAmount: TokenAmount | undefined
): {
  parsedAmount?: CurrencyAmount
  error?: string
} {
  const { account } = useActiveWeb3React()

  const parsedInput: CurrencyAmount | undefined = stakingAmount
    ? tryParseAmount(typedValue, stakingAmount.token)
    : undefined

  const parsedAmount =
    parsedInput && stakingAmount && JSBI.lessThanOrEqual(parsedInput.raw, stakingAmount.raw) ? parsedInput : undefined

  let error: string | undefined
  if (!account) {
    error = 'Connect Wallet'
  }
  if (!parsedAmount) {
    error = error ?? 'Enter an amount'
  }

  return {
    parsedAmount,
    error
  }
}
