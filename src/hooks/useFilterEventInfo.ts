import { useMemo } from 'react'
import { EventInfo } from '../state/event/hooks'

export default function useFilterEventInfo(
  eventInfos: EventInfo[],
  isActive: boolean | undefined = undefined,
  onlyStaked: boolean | undefined = undefined
): EventInfo[] {
  return useMemo(() => {
    if (isActive !== undefined) {
      eventInfos = eventInfos.filter(s => s.active === isActive)
    }

    if (onlyStaked !== undefined) {
      return eventInfos
        .filter(s => s.earnedAmount.greaterThan('0'))
        .sort((a, b) => {
          if (a.earnedAmount === undefined || b.earnedAmount === undefined) {
            return 0
          }
          return b.earnedAmount.greaterThan(a.earnedAmount) ? 1 : -1
        })
    }

    return eventInfos.sort((a, b) => {
      if (a.apr === undefined || b.apr === undefined) {
        return 0
      }
      return b.apr.greaterThan(a.apr) ? 1 : -1
    })
  }, [eventInfos, isActive, onlyStaked])
}
