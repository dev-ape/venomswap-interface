import React, { useState } from 'react'
import Column, { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { TYPE } from 'theme'
import CurrencyLogo from 'components/CurrencyLogo'
import { useActiveWeb3React } from 'hooks'
import useConfigEvents from 'hooks/useEventsConfig'
import { useBlockNumber } from 'state/application/hooks'
import { useEventInfo } from 'state/event/hooks'
import { useTokenBalance } from 'state/wallet/hooks'
import StakingComponent from 'components/farm/Stake'
import UnstakingComponent from 'components/farm/Unstake'
import ExitComponent from 'components/farm/Exit'
import EventPoolDoubleLogo from 'components/farm/EventPoolDoubleLogo'

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
const EventTitleWrapper = styled.div<{ active?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 8px;
  border-left: 2px solid ${({ active }) => (active ? `#fff` : 'transparent')};
  color: ${({ theme, active }) => (active ? theme.text1 : theme.text3)};
  cursor: pointer;
`

const EventTitle = styled.div<{ active?: boolean }>``

const EventStatusUpcoming = styled.div`
  font-size: 10px;
  font-weight: 500;
  padding: 2px 6px;
  background-color: #4d4a2b;
  color: #ffcc16;
  border-radius: 4px;
`
const EventStatusCurrent = styled.div`
  font-size: 10px;
  font-weight: 500;
  padding: 2px 6px;
  background-color: #135626;
  color: #09d00b;
  border-radius: 4px;
`
const EventStatusFinished = styled.div`
  font-size: 10px;
  font-weight: 500;
  padding: 2px 6px;
  background-color: #4a2934;
  color: #f53f3f;
  border-radius: 4px;
`

const PoolsContainer = styled(Column)`
  width: 100%;
  gap: 24px;
`

const PoolTitle = styled.div`
  width: 100%;
  font-size: 24px;
  font-weight: 700;
`

const PoolDesc = styled.div`
  width: 100%;
  font-size: 16px;
  line-height: 20px;
  font-weight: 500;
`

const PoolRowsContainer = styled.div`
  display: grid;
  grid-template-columns: 40% repeat(4, auto);
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
  font-size: 14px;
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
const DepositDisabled = styled.div`
  width: 100%;
  align-items: center;
  display: flex;
  text-align: center;
  font-size: 20px;
  padding: 6px 20px;
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

  const eventInfo = useEventInfo(events[activeEvent].address)

  const lastBlockNumber = useBlockNumber()

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
            <EventTitleWrapper
              key={event.address}
              active={activeEvent === index}
              onClick={() => handleEventClick(index)}
            >
              <EventTitle>{event.title}</EventTitle>
              {lastBlockNumber && lastBlockNumber < event.startBlock && (
                <EventStatusUpcoming>Upcoming</EventStatusUpcoming>
              )}
              {lastBlockNumber && lastBlockNumber >= event.startBlock && lastBlockNumber <= event.endBlock && (
                <EventStatusCurrent>Current</EventStatusCurrent>
              )}
              {lastBlockNumber && lastBlockNumber > event.endBlock && (
                <EventStatusFinished>Finished</EventStatusFinished>
              )}
            </EventTitleWrapper>
          )
        })}
      </EventsContainer>
      <PoolsContainer>
        <PoolTitle>{events[activeEvent].title}</PoolTitle>
        <PoolDesc>{events[activeEvent].desc}</PoolDesc>
        <PoolRowsContainer>
          <PoolHeaderItem>Pool</PoolHeaderItem>
          <PoolHeaderItem>TVL</PoolHeaderItem>
          <PoolHeaderItem>Rewards</PoolHeaderItem>
          <PoolHeaderItem>Earned</PoolHeaderItem>
          <PoolHeaderItemLast>APR</PoolHeaderItemLast>
        </PoolRowsContainer>
        {eventInfo.map(event => {
          return (
            <PoolWrapper key={event.pid}>
              <PoolRowsContainer onClick={() => handlePoolClick(event.pid)}>
                <PoolColumn>
                  <PoolNameContainer>
                    <EventPoolDoubleLogo
                      eventImg={events[activeEvent].pools[event.pid].img}
                      eventCurrency={event.tokens[1]}
                    />
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
                  <PoolRewardsText>DUEL/B</PoolRewardsText>
                </PoolColumnWrap>

                <PoolColumnWrap>
                  <PoolRewardsAmount>{event.earnedAmount.toSignificant(4, { groupSeparator: ',' })}</PoolRewardsAmount>
                  <PoolRewardsText>DUEL</PoolRewardsText>
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
                  {event.canDeposit && (
                    <StakingComponent
                      address={events[activeEvent].address}
                      eventInfo={event}
                      userLiquidityUnstaked={userLiquidityUnstaked}
                    />
                  )}
                  {!event.canDeposit && !event.canExit && (
                    <DepositDisabled>
                      Deposit deadline time has passed. Please wait until the end of the event.
                    </DepositDisabled>
                  )}
                  {event.canExit && <ExitComponent address={events[activeEvent].address} eventInfo={event} />}
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
