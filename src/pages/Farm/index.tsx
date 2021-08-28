import React, { useState } from 'react'
import Column, { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { TYPE } from 'theme'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import CurrencyLogo from 'components/CurrencyLogo'
import { useActiveWeb3React } from 'hooks'
import useConfigEvents from 'hooks/useEventsConfig'
import { useEventInfo } from 'state/event/hooks'
import StakingComponent from 'components/farm/Stake'
import { useTokenBalance } from 'state/wallet/hooks'
import UnstakingComponent from 'components/farm/Unstake'
//import { getPairInstance } from 'utils'
//import useTheme from 'hooks/useTheme'
//import { TYPE } from '../../theme'
//import { ButtonPrimary } from '../../components/Button'
//import PoolCard from '../../components/earn/PoolCard'
//import { CustomButtonWhite } from '../../components/Button'
//import AwaitingRewards from '../../components/earn/AwaitingRewards'
//import { RowBetween } from '../../components/Row'
// import { CardSection, ExtraDataCard } from '../../components/farm/styled'
//import { Countdown } from './Countdown'
//import Loader from '../../components/Loader'
//import { useActiveWeb3React } from '../../hooks'
//import useGovernanceToken from '../../hooks/useGovernanceToken'
//import { OutlineCard } from '../../components/Card'
//import CombinedTVL from '../../components/CombinedTVL'

const PageWrapper = styled(AutoColumn)`
  max-width: 920px;
  width: 100%;
  grid-template-columns: 200px 720px;
  grid-column-gap: 24px;
`

const EventsContainer = styled(Column)`
  width: 100%;
  gap: 24px;
`
const EventItem = styled.div<{ active?: boolean }>`
  padding-left: 8px;
  border-left: 2px solid ${({ active }) => (active ? `#fff` : 'transparent')};
  color: ${({ theme, active }) => (active ? theme.text1 : theme.text3)};
  cursor: pointer;
`

const PoolsContainer = styled(Column)`
  width: 100%;
  gap: 24px;
`

const PoolDesc = styled.div`
  width: 100%;
  padding: 20px;
  background-color: ${({ theme }) => theme.bg1};
  box-shadow: 0 4px 15px ${({ theme }) => theme.advancedBG};
  border-radius: 16px;
`

const PoolRowsContainer = styled.div`
  display: grid;
  grid-template-columns: 40% repeat(3, auto);
  row-gap: 20px;
  cursor: pointer;
  user-select: none;
`

const PoolHeaderItem = styled(TYPE.boldSubHeader)`
  padding: 0 1rem;
  color: ${({ theme }) => theme.text3};
`
const PoolHeaderItemLast = styled(TYPE.boldSubHeader)`
  padding: 0 1rem;
  color: ${({ theme }) => theme.text3};
  justify-self: flex-end;
`

const PoolNameContainer = styled.div`
  display: flex;
`
const PoolNameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  justify-content: center;
  align-items: flex-start;
`
const PoolWrapper = styled.div`
  width: 100%;
  padding: 20px 0;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.bg3};
  border: none;
  color: ${({ theme }) => theme.text1};
  font-size: 16px;
  font-weight: 500;
  box-shadow: 0 4px 15px ${({ theme }) => theme.advancedBG};
`
const PoolName = styled.div``
const PoolPair = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text3};
`

const PoolColumn = styled.div`
  padding: 0 1rem;
  align-self: center;
  justify-self: flex-start;
`
const PoolColumnLast = styled.div`
  padding: 0 1rem;
  align-self: center;
  justify-self: flex-end;
`

const PoolColumnWrap = styled.div`
  padding: 0 1rem;
  display: flex;
  align-items: center;
  gap: 6px;
`

const PoolRewardsAmount = styled.div``
const PoolRewardsText = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text3};
`

const StakeUnstakeContainer = styled.div<{ show?: boolean }>`
  padding: 0 1rem;
  display: ${({ show }) => (show ? 'flex' : 'none')};
  flex-direction: column;
  gap: 16px;
`
const Divider = styled.hr`
  margin: 20px 0 4px 0;
  border: 4px solid ${({ theme }) => theme.bg4};
  border-radius: 4px;
`
// const CustomButton = styled(ButtonConfirmed)`
//   height: 40px;
//   border-radius: 8px;
//   width: 100%;
//   margin-right: 0;
// `

// const CustomButtonRed = styled(CustomButton)`
//   background-color: ${({ theme }) => theme.red3};
//   &:hover {
//     background-color: ${({ theme }) => theme.red2};
//   }
//   &:focus {
//     background-color: ${({ theme }) => theme.red2};
//   }
// `
const StakeUnstakeWrapper = styled.div`
  display: flex;
  gap: 20px;
`
// const InputWrapper = styled.div`
//   width: 100%;
//   display: flex;
//   flex-direction: column;
//   gap: 20px;
// `

// interface PoolInfo {
//   pid: number
//   name: string
//   pair: string
//   tvl: string
//   rewards: string
//   apr: string
// }
export default function Farm() {
  //const theme = useTheme()
  const { account, chainId } = useActiveWeb3React()
  const [activeEvent, setActiveEvent] = useState(0)
  const [visibleForms, setVisibleForms] = useState<{ [key: number]: boolean }>({})

  const events = useConfigEvents(chainId)

  // const events = [
  //   {
  //     id: 0,
  //     name: 'Premier League',
  //     desc:
  //       'Which team will win the FA Cup? Make your choice, join the duel by staking your farms, get higher APR when you win.'
  //   },
  //   {
  //     id: 1,
  //     name: 'Rolex Belgian Grand Prix',
  //     desc: 'Who wins the race? Make your choice, join the duel by staking your farms, get higher APR when you win.'
  //   },
  //   {
  //     id: 2,
  //     name: 'Assets Prediction',
  //     desc:
  //       'Which will increase in percentage by 16th August? Make your choice, join the duel by staking your farms, get higher APR when you win.'
  //   },
  //   {
  //     id: 3,
  //     name: 'Election',
  //     desc:
  //       'Which one wins the election? Make your choice, join the duel by staking your farms, get higher APR when you win.'
  //   },
  //   {
  //     id: 4,
  //     name: 'User Experience',
  //     desc:
  //       'A company cannot decide on the structure of the application it will develop. You can help them by choosing the feature you like more. Which one do you prefer? Make your choice, join the duel by staking your farms, get higher APR when you win.'
  //   }
  // ]

  // const pools: { [event: number]: PoolInfo[] } = {
  //   0: [
  //     { pid: 0, name: 'Arsenal', pair: 'DUEL/BNB LP', tvl: '$101,916', rewards: '8.753', apr: '25.55%' },
  //     { pid: 1, name: 'Liverpool', pair: 'DUEL/BNB LP', tvl: '$101,916', rewards: '8.753', apr: '25.55%' }
  //   ],
  //   1: [
  //     { pid: 0, name: 'Hamilton', pair: 'DUEL/BNB LP', tvl: '$101,916', rewards: '8.753', apr: '25.55%' },
  //     { pid: 1, name: 'Verstappen', pair: 'DUEL/BNB LP', tvl: '$101,916', rewards: '8.753', apr: '25.55%' },
  //     { pid: 2, name: 'Lecler', pair: 'DUEL/BNB LP', tvl: '$101,916', rewards: '8.753', apr: '25.55%' }
  //   ],
  //   2: [
  //     { pid: 0, name: 'BTC', pair: 'DUEL/BNB LP', tvl: '$101,916', rewards: '8.753', apr: '25.55%' },
  //     { pid: 1, name: 'ETH', pair: 'DUEL/BNB LP', tvl: '$101,916', rewards: '8.753', apr: '25.55%' },
  //     { pid: 2, name: 'BNB', pair: 'DUEL/BNB LP', tvl: '$101,916', rewards: '8.753', apr: '25.55%' }
  //   ],
  //   3: [
  //     { pid: 0, name: 'Donald Trump', pair: 'DUEL/BNB LP', tvl: '$101,916', rewards: '8.753', apr: '25.55%' },
  //     { pid: 1, name: 'Joe Biden', pair: 'DUEL/BNB LP', tvl: '$101,916', rewards: '8.753', apr: '25.55%' }
  //   ],
  //   4: [
  //     {
  //       pid: 0,
  //       name: 'Augmented Reality',
  //       pair: 'DUEL/BNB LP',
  //       tvl: '$101,916',
  //       rewards: '8.753',
  //       apr: '25.55%'
  //     },
  //     { pid: 1, name: 'Virtual Reality', pair: 'DUEL/BNB LP', tvl: '$101,916', rewards: '8.753', apr: '25.55%' }
  //   ]
  // }

  const eventInfo = useEventInfo(events[activeEvent].address)

  console.log(eventInfo)
  const userLiquidityUnstaked = useTokenBalance(account ?? undefined, eventInfo[0] && eventInfo[0].stakedAmount?.token)

  const handleEventClick = (idx: number): void => {
    setActiveEvent(idx)
  }

  const handlePoolClick = (pid: number): void => {
    setVisibleForms(prev => ({
      ...prev,
      [pid]: !prev[pid]
    }))
  }

  return (
    <PageWrapper gap="lg" justify="center">
      <EventsContainer>
        {events.map((event, index) => {
          return (
            <EventItem key={event.address} active={activeEvent === index} onClick={() => handleEventClick(index)}>
              {event.title}
            </EventItem>
          )
        })}
      </EventsContainer>
      <PoolsContainer>
        <PoolDesc>{events[activeEvent].desc}</PoolDesc>
        <PoolRowsContainer>
          <PoolHeaderItem>Pool</PoolHeaderItem>
          <PoolHeaderItem>TVL</PoolHeaderItem>
          <PoolHeaderItem>Rewards</PoolHeaderItem>
          <PoolHeaderItemLast>APR</PoolHeaderItemLast>
        </PoolRowsContainer>
        {eventInfo.map(event => {
          return (
            <PoolWrapper key={event.pid}>
              <PoolRowsContainer onClick={() => handlePoolClick(event.pid)}>
                <PoolColumn>
                  <PoolNameContainer>
                    <DoubleCurrencyLogo currency0={event.tokens[0]} currency1={event.tokens[1]} size={48} margin />
                    <PoolNameWrapper>
                      <PoolName>{event.poolTitle}</PoolName>
                      <PoolPair>
                        {event.tokens[0].symbol} - {event.tokens[1].symbol} LP
                      </PoolPair>
                    </PoolNameWrapper>
                  </PoolNameContainer>
                </PoolColumn>
                <PoolColumn>
                  TBD
                  {/* {event.valueOfTotalStakedAmountInUsd
                    ? `$${event.valueOfTotalStakedAmountInUsd.toFixed(0, { groupSeparator: ',' })}`
                    : '-'} */}
                </PoolColumn>
                <PoolColumnWrap>
                  <CurrencyLogo currency={event.tokens[1]} />
                  <PoolRewardsAmount>
                    {event.poolRewardsPerBlock.toSignificant(4, { groupSeparator: ',' })}
                  </PoolRewardsAmount>
                  <PoolRewardsText>DUEL/BLOCK</PoolRewardsText>
                </PoolColumnWrap>
                <PoolColumnLast>
                  TBD
                  {/* {event.apr && event.apr.greaterThan('0')
                    ? `${event.apr.multiply('100').toSignificant(4, { groupSeparator: ',' })}%`
                    : 'TBD'} */}
                </PoolColumnLast>
              </PoolRowsContainer>
              <StakeUnstakeContainer show={visibleForms[event.pid]}>
                <Divider />
                <StakeUnstakeWrapper>
                  <StakingComponent
                    address={events[activeEvent].address}
                    eventInfo={event}
                    userLiquidityUnstaked={userLiquidityUnstaked}
                  />
                  <UnstakingComponent address={events[activeEvent].address} eventInfo={event} />
                </StakeUnstakeWrapper>
              </StakeUnstakeContainer>
            </PoolWrapper>
          )
        })}
      </PoolsContainer>
    </PageWrapper>
  )
}
