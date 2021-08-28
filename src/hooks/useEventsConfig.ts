import { useMemo } from 'react'
import { ChainId, Pair } from '@venomswap/sdk'
import { EVENTS_INFO, ConfigEventInfo } from '../constants/events'

export default function useConfigEvents(
  chainId: ChainId | undefined,
  active: boolean | undefined = undefined,
  address: string | undefined = undefined,
  pairToFilterBy?: Pair | null
): ConfigEventInfo[] {
  return useMemo(() => {
    let events = chainId
      ? EVENTS_INFO[chainId]?.filter(info =>
          pairToFilterBy === undefined
            ? true
            : pairToFilterBy === null
            ? false
            : pairToFilterBy.involvesToken(info.tokens[0]) && pairToFilterBy.involvesToken(info.tokens[1])
        ) ?? []
      : []

    if (active !== undefined) {
      events = events?.filter(info => info.active === active) ?? []
    }

    if (address !== undefined) {
      events = events?.filter(info => info.address === address) ?? []
    }

    return events
  }, [chainId, active, address, pairToFilterBy])
}
