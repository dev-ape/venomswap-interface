import { useMemo } from 'react'
import { ChainId } from '@venomswap/sdk'
import { EVENTS_INFO } from '../constants/events'

export default function useEventPools(chainId: ChainId | undefined, address: string): number[] {
  return useMemo(() => {
    const events = chainId ? EVENTS_INFO[chainId] : []

    const event = events?.filter(info => info.address === address)[0]

    return event ? event.pools.map(({ pid }) => pid) : []
  }, [chainId, address])
}
