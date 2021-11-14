import { CallState } from '../state/multicall/hooks'

export default function validLotteryInfo(
  startTime: CallState,
  endTime: CallState,
  softCap: CallState,
  ticketSupply: CallState,
  ticketPrice: CallState,
  currentSupply: CallState,
  userTickets: CallState
): boolean {
  if (
    startTime &&
    !startTime.error &&
    !startTime.loading &&
    startTime?.result?.[0] !== undefined &&
    endTime &&
    !endTime.error &&
    !endTime.loading &&
    endTime?.result?.[0] !== undefined &&
    softCap &&
    !softCap.error &&
    !softCap.loading &&
    softCap?.result?.[0] !== undefined &&
    ticketSupply &&
    !ticketSupply.error &&
    !ticketSupply.loading &&
    ticketSupply?.result?.[0] !== undefined &&
    ticketPrice &&
    !ticketPrice.error &&
    !ticketPrice.loading &&
    ticketPrice?.result?.[0] !== undefined &&
    currentSupply &&
    !currentSupply.error &&
    !currentSupply.loading &&
    currentSupply?.result?.[0] !== undefined &&
    userTickets &&
    !userTickets.error &&
    !userTickets.loading &&
    userTickets?.result?.[0] !== undefined
  ) {
    return true
  }

  return false
}
