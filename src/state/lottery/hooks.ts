import { Fraction, JSBI, TokenAmount } from '@venomswap/sdk'
import { useMemo } from 'react'
import { useActiveWeb3React } from '../../hooks'
import { useSingleCallResult, useMultipleContractSingleData } from '../multicall/hooks'
import { useLotteryFactoryContract } from '../../hooks/useContract'
import useTokensWithWethPrices from '../../hooks/useTokensWithWETHPrices'
import { Interface } from '@ethersproject/abi'
import DUEL_LOTTERY_ABI from '../../constants/abis/DuelLottery.json'
import useCurrentBlockTimestamp from 'hooks/useCurrentBlockTimestamp'
import validLotteryInfo from 'utils/validLotteryInfo'
import { ethers } from 'ethers'

export interface LotteryInfo {
  id: number
  address: string

  startTime: JSBI
  endTime: JSBI
  softCap: TokenAmount

  ticketSupply: JSBI
  currentSupply: JSBI
  ticketPrice: TokenAmount | undefined

  userTicketCount: JSBI
  winner: string
  winAmount: Fraction

  canBuy: boolean
}

const LOTTERY_INTERFACE = new Interface(DUEL_LOTTERY_ABI)

export function useLotteryInfo(): LotteryInfo[] {
  const { chainId, account } = useActiveWeb3React()

  const factoryContract = useLotteryFactoryContract()

  const lotteries = useSingleCallResult(factoryContract, 'getLotteries')

  const addresses: string[] = lotteries?.result?.[0]

  const startTimes = useMultipleContractSingleData(addresses, LOTTERY_INTERFACE, 'startTime')
  const endTimes = useMultipleContractSingleData(addresses, LOTTERY_INTERFACE, 'endTime')
  const softCaps = useMultipleContractSingleData(addresses, LOTTERY_INTERFACE, 'softCap')

  const ticketSupplies = useMultipleContractSingleData(addresses, LOTTERY_INTERFACE, 'ticketSupply')
  const ticketPrices = useMultipleContractSingleData(addresses, LOTTERY_INTERFACE, 'ticketPrice')
  const currentSupplies = useMultipleContractSingleData(addresses, LOTTERY_INTERFACE, 'currentSupply')

  const userTickets = useMultipleContractSingleData(addresses, LOTTERY_INTERFACE, 'userTickets', [account ?? undefined])

  const winners = useMultipleContractSingleData(addresses, LOTTERY_INTERFACE, 'winner')
  const winAmounts = useMultipleContractSingleData(addresses, LOTTERY_INTERFACE, 'winAmount')

  const blockTimestamp = useCurrentBlockTimestamp()

  const tokensWithPrices = useTokensWithWethPrices()
  const govToken = tokensWithPrices?.govToken?.token

  return useMemo(() => {
    if (!chainId || !factoryContract || !addresses) return []

    return addresses.reduce<LotteryInfo[]>((memo, address, index) => {
      const startTimeCall = startTimes[index]
      const endTimeCall = endTimes[index]
      const softCapCall = softCaps[index]
      const ticketSupplyCall = ticketSupplies[index]

      const ticketPriceCall = ticketPrices[index]
      const currentSupplyCall = currentSupplies[index]
      const userTicketCountCall = userTickets[index]
      const currentBlockTime = JSBI.BigInt(blockTimestamp?.toNumber() ?? 0)

      const winnerCall = winners[index]
      const winAmountCall = winAmounts[index]

      if (
        validLotteryInfo(
          startTimeCall,
          endTimeCall,
          softCapCall,
          ticketSupplyCall,
          ticketPriceCall,
          currentSupplyCall,
          userTicketCountCall
        )
      ) {
        const startTime = JSBI.BigInt(startTimeCall.result?.[0]) ?? 0
        const endTime = JSBI.BigInt(endTimeCall.result?.[0]) ?? 0

        const softCap = new TokenAmount(govToken, JSBI.BigInt(softCapCall?.result?.[0] ?? 0))
        const ticketSupply = JSBI.BigInt(ticketSupplyCall.result?.[0]) ?? 0
        const ticketPrice = new TokenAmount(govToken, JSBI.BigInt(ticketPriceCall?.result?.[0] ?? 0))
        const currentSupply = JSBI.BigInt(currentSupplyCall.result?.[0]) ?? 0
        const userTicketCount = JSBI.BigInt(userTicketCountCall.result?.[0]) ?? 0

        const winner = winnerCall.result?.[0] ?? ethers.constants.AddressZero

        const winAmount = new Fraction(JSBI.BigInt(winAmountCall.result?.[0]) ?? 0, JSBI.BigInt(1))

        const canBuy = JSBI.greaterThanOrEqual(currentBlockTime, startTime) && JSBI.lessThan(currentBlockTime, endTime)

        const lotteryInfo = {
          id: index,
          address,
          startTime,
          endTime,
          softCap,
          ticketSupply,
          ticketPrice,
          currentSupply,
          userTicketCount,
          winner,
          winAmount,
          canBuy
        }

        memo.push(lotteryInfo)
      }
      return memo
    }, [])
  }, [
    chainId,
    factoryContract,
    addresses,
    govToken,
    startTimes,
    endTimes,
    softCaps,
    ticketSupplies,
    ticketPrices,
    currentSupplies,
    userTickets,
    blockTimestamp
  ])
}

// based on typed value
export function useDerivedBuyInfo(
  typedValue: string,
  price: TokenAmount | undefined,
  balance: TokenAmount | undefined
): {
  parsedAmount: JSBI | undefined
  tokenAmount: TokenAmount | undefined
  error?: string
} {
  const { account } = useActiveWeb3React()

  const parsedInput = JSBI.BigInt(typedValue)
  const tokenAmount = JSBI.multiply(parsedInput, price?.raw ?? JSBI.BigInt(0))

  const parsedAmount =
    parsedInput &&
    JSBI.GT(parsedInput, JSBI.BigInt(0)) &&
    tokenAmount &&
    balance &&
    JSBI.lessThanOrEqual(tokenAmount, balance.raw)
      ? parsedInput
      : undefined

  let error: string | undefined
  if (!account) {
    error = 'Connect Wallet'
  }

  if (balance && JSBI.GT(tokenAmount, balance.raw)) {
    error = error ?? 'Not enough balance'
  }

  if (!parsedAmount) {
    error = error ?? 'Enter an amount'
  }

  return {
    parsedAmount,
    tokenAmount: price ? new TokenAmount(price?.token, tokenAmount ?? JSBI.BigInt(0)) : undefined,
    error
  }
}
