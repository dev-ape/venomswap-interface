import { CurrencyAmount, JSBI, Token, TokenAmount, Fraction } from '@venomswap/sdk'
import { useMemo } from 'react'
import { useActiveWeb3React } from '../../hooks'
import { useSingleCallResult, useSingleContractMultipleData } from '../multicall/hooks'
import { tryParseAmount } from '../swap/hooks'
import { useEventContract } from '../../hooks/useContract'
import { useMultipleContractSingleData } from '../multicall/hooks'
import { abi as IUniswapV2PairABI } from '@venomswap/core/build/IUniswapV2Pair.json'
import { Interface } from '@ethersproject/abi'
import useTokensWithWethPrices from '../../hooks/useTokensWithWETHPrices'
import useBUSDPrice from '../../hooks/useBUSDPrice'
import getBlocksPerYear from '../../utils/getBlocksPerYear'
import calculateWethAdjustedTotalStakedAmount from '../../utils/calculateWethAdjustedTotalStakedAmount'
import calculateApr from '../../utils/calculateApr'
import determineBaseToken from '../../utils/determineBaseToken'
import { getPairInstance } from '../../utils'
import useEventPools from 'hooks/useEventPools'
import validEventInfo from 'utils/validEventInfo'
import useEventsConfig from 'hooks/useEventsConfig'
import useEventPoolTitles from 'hooks/useEventPoolTitles'
import { useBlockNumber } from 'state/application/hooks'

const PAIR_INTERFACE = new Interface(IUniswapV2PairABI)

export interface EventInfo {
  // the pool id (pid) of the pool
  pid: number
  // the pool title
  poolTitle: string
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
  // deposit end block for all the rewards pools
  depositEndBlock: number
  // base rewards per block
  baseRewardsPerBlock: TokenAmount
  // pool specific rewards per block
  poolRewardsPerBlock: TokenAmount
  // blocks generated per year
  blocksPerYear: JSBI
  // pool share vs all pools
  poolShare: Fraction
  // the total supply of lp tokens in existence
  totalLpTokenSupply: TokenAmount
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
  // if can exit
  canExit: boolean
  // if claimed
  isClaimed: boolean
  // if event cancelled
  isCancelled: boolean
  // if lost pool
  isLost: boolean
}

enum EventStatus {
  Active,
  Win,
  Draw,
  Cancel
}

export function useEventInfo(address: string): EventInfo[] {
  const { chainId, account } = useActiveWeb3React()

  const eventContract = useEventContract(address)

  const events = useEventsConfig(chainId, undefined, address)

  const pids = useEventPools(chainId, address)
  const poolTitles = useEventPoolTitles(chainId, address)

  const tokensWithPrices = useTokensWithWethPrices()

  const weth = tokensWithPrices?.WETH?.token
  const wethBusdPrice = useBUSDPrice(weth)
  const govToken = tokensWithPrices?.govToken?.token
  const govTokenWETHPrice = tokensWithPrices?.govToken?.price

  const blocksPerYear = getBlocksPerYear(chainId)

  const pidAccountMapping = useMemo(() => pids.map(pid => (account ? [pid, account] : [undefined, undefined])), [
    pids,
    account
  ])

  const pendingRewards = useSingleContractMultipleData(eventContract, 'pendingRewards', pidAccountMapping)
  const userInfos = useSingleContractMultipleData(eventContract, 'userInfo', pidAccountMapping)

  const poolInfos = useSingleContractMultipleData(
    eventContract,
    'poolInfo',
    pids.map(pids => [pids])
  )

  const lpTokenAddresses = useMemo(() => {
    return poolInfos.reduce<string[]>((memo, poolInfo) => {
      if (poolInfo && !poolInfo.loading && poolInfo.result) {
        const [lpToken] = poolInfo.result
        memo.push(lpToken)
      }
      return memo
    }, [])
  }, [poolInfos])

  const lpTokenSupplies = useMemo(() => {
    return poolInfos.reduce<string[]>((memo, poolInfo) => {
      if (poolInfo && !poolInfo.loading && poolInfo.result) {
        const [supply] = poolInfo.result
        memo.push(supply)
      }
      return memo
    }, [])
  }, [poolInfos])

  const lpTokenTotalSupplies = useMultipleContractSingleData(lpTokenAddresses, PAIR_INTERFACE, 'totalSupply')
  const lpTokenReserves = useMultipleContractSingleData(lpTokenAddresses, PAIR_INTERFACE, 'getReserves')

  const startBlock = useSingleCallResult(eventContract, 'startBlock')
  const endBlock = useSingleCallResult(eventContract, 'endBlock')
  const depositEndBlock = useSingleCallResult(eventContract, 'depositEndBlock')
  const eventResult = useSingleCallResult(eventContract, 'eventResult')

  const lastBlockNumber = useBlockNumber()

  const baseRewards = useSingleCallResult(eventContract, 'getBaseRewardPerBlock')
  const poolRewards = useSingleContractMultipleData(
    eventContract,
    'getPoolRewardPerBlock',
    pids.map(pids => [pids])
  )

  return useMemo(() => {
    if (!chainId || !weth || !govToken) return []

    return pids.reduce<EventInfo[]>((memo, pid, index) => {
      const tokens = events[0].tokens
      const poolInfo = poolInfos[index]

      // amount uint256, rewardDebt uint256, rewardDebtAtBlock uint256, lastWithdrawBlock uint256, firstDepositBlock uint256, blockdelta uint256, lastDepositBlock uint256
      const userInfo = userInfos[index]
      const pendingReward = pendingRewards[index]
      const lpTokenTotalSupply = lpTokenTotalSupplies[index]
      const lpTokenReserve = lpTokenReserves[index]
      const lpTokenBalance = lpTokenSupplies[index]
      const poolTitle = poolTitles[index]

      const baseRewardsPerBlock = baseRewards
      const specificPoolRewardsPerBlock = poolRewards[index]

      if (
        validEventInfo(
          tokens,
          poolInfo,
          pendingReward,
          userInfo,
          baseRewardsPerBlock,
          specificPoolRewardsPerBlock,
          lpTokenTotalSupply,
          lpTokenReserve,
          startBlock,
          endBlock,
          depositEndBlock
        )
      ) {
        const baseBlockRewards = new TokenAmount(govToken, JSBI.BigInt(baseRewardsPerBlock?.result?.[0] ?? 0))

        const poolBlockRewards = specificPoolRewardsPerBlock?.result?.[0]
          ? new TokenAmount(govToken, JSBI.BigInt(specificPoolRewardsPerBlock?.result?.[0] ?? 0))
          : baseBlockRewards

        const poolShare = new Fraction(poolBlockRewards.raw, baseBlockRewards.raw)

        const calculatedTotalPendingRewards = JSBI.BigInt(pendingReward?.result?.[0] ?? 0)

        const dummyPair = getPairInstance(new TokenAmount(tokens[0], '0'), new TokenAmount(tokens[1], '0'))
        const stakedAmount = new TokenAmount(dummyPair.liquidityToken, JSBI.BigInt(userInfo?.result?.[0] ?? 0))
        const totalStakedAmount = new TokenAmount(dummyPair.liquidityToken, JSBI.BigInt(lpTokenBalance ?? 0))
        const stakedRatio = new Fraction(stakedAmount.raw, totalStakedAmount.raw)

        const totalLpTokenSupply = new TokenAmount(
          dummyPair.liquidityToken,
          JSBI.BigInt(lpTokenTotalSupply.result?.[0] ?? 0)
        )
        const totalPendingRewardAmount = new TokenAmount(govToken, calculatedTotalPendingRewards)
        const startsAtBlock = startBlock.result?.[0] ?? 0
        const endsAtBlock = endBlock.result?.[0] ?? 0
        const depositEndsAtBlock = depositEndBlock.result?.[0] ?? 0
        const canDeposit = lastBlockNumber ? lastBlockNumber < depositEndsAtBlock : false
        const canExit =
          eventResult.result?.status == EventStatus.Draw ||
          eventResult.result?.status == EventStatus.Cancel ||
          (eventResult.result?.status == EventStatus.Win && eventResult.result?.winnerPid == pid)

        const isClaimed = userInfo?.result?.claimed
        const isCancelled = eventResult.result?.status == EventStatus.Cancel
        const isLost = eventResult.result?.status == EventStatus.Win && eventResult.result?.winnerPid != pid

        //console.log('userInfo', userInfo)
        // console.log('last', lastBlockNumber)
        // console.log('ends', endsAtBlock.toNumber())

        // poolInfo: lpToken address, allocPoint uint256, lastRewardBlock uint256, accGovTokenPerShare uint256
        const poolInfoResult = poolInfo.result
        const allocPoint = JSBI.BigInt(poolInfoResult && poolInfoResult[1])
        const active = poolInfoResult && JSBI.GT(JSBI.BigInt(allocPoint), 0) ? true : false

        const baseToken = determineBaseToken(tokensWithPrices, tokens)

        const totalStakedAmountWETH = calculateWethAdjustedTotalStakedAmount(
          chainId,
          baseToken,
          tokensWithPrices,
          tokens,
          totalLpTokenSupply,
          totalStakedAmount,
          lpTokenReserve?.result
        )

        const totalStakedAmountBUSD =
          wethBusdPrice && totalStakedAmountWETH && totalStakedAmountWETH.multiply(wethBusdPrice?.raw)

        const apr = totalStakedAmountWETH
          ? calculateApr(govTokenWETHPrice, baseBlockRewards, blocksPerYear, poolShare, totalStakedAmountWETH)
          : undefined

        const stakingInfo = {
          pid: pid,
          poolTitle,
          allocPoint: allocPoint,
          tokens: tokens,
          baseToken: baseToken,
          startBlock: startsAtBlock,
          endBlock: endsAtBlock,
          depositEndBlock: depositEndsAtBlock,
          baseRewardsPerBlock: baseBlockRewards,
          poolRewardsPerBlock: poolBlockRewards,
          blocksPerYear: blocksPerYear,
          poolShare: poolShare,
          totalLpTokenSupply: totalLpTokenSupply,
          totalStakedAmount: totalStakedAmount,
          stakedAmount: stakedAmount,
          stakedRatio: stakedRatio,
          earnedAmount: totalPendingRewardAmount,
          valueOfTotalStakedAmountInWeth: totalStakedAmountWETH,
          valueOfTotalStakedAmountInUsd: totalStakedAmountBUSD,
          apr: apr,
          active: active,
          canDeposit: canDeposit,
          canExit: canExit,
          isClaimed: isClaimed,
          isCancelled: isCancelled,
          isLost: isLost
        }

        memo.push(stakingInfo)
      }
      return memo
    }, [])
  }, [
    chainId,
    events,
    tokensWithPrices,
    weth,
    govToken,
    govTokenWETHPrice,
    pids,
    poolInfos,
    userInfos,
    pendingRewards,
    lpTokenTotalSupplies,
    lpTokenReserves,
    lpTokenSupplies,
    blocksPerYear,
    startBlock,
    endBlock,
    depositEndBlock,
    eventResult
  ])
}

// based on typed value
export function useDerivedStakeInfo(
  typedValue: string,
  stakingToken: Token,
  userLiquidityUnstaked: TokenAmount | undefined
): {
  parsedAmount?: CurrencyAmount
  error?: string
} {
  const { account } = useActiveWeb3React()

  const parsedInput: CurrencyAmount | undefined = tryParseAmount(typedValue, stakingToken)

  const parsedAmount =
    parsedInput && userLiquidityUnstaked && JSBI.lessThanOrEqual(parsedInput.raw, userLiquidityUnstaked.raw)
      ? parsedInput
      : undefined

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
