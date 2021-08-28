import React, { useCallback, useState } from 'react'
import Column, { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { TYPE } from 'theme'
import { ChainId } from '@venomswap/sdk'
import getPairTokensWithDefaults from 'utils/getPairTokensWithDefaults'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import CurrencyLogo from 'components/CurrencyLogo'
import { RowBetween } from 'components/Row'
import { ButtonConfirmed } from 'components/Button'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
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
  user-select: none;
  background-color: ${({ theme }) => theme.bg3};
  border: none;
  color: ${({ theme }) => theme.text1};
  cursor: pointer;
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
const CustomButton = styled(ButtonConfirmed)`
  height: 40px;
  border-radius: 8px;
  width: 100%;
  margin-right: 0;
`

const CustomButtonRed = styled(CustomButton)`
  background-color: ${({ theme }) => theme.red3};
  &:hover {
    background-color: ${({ theme }) => theme.red2};
  }
`
const CustomRowBetween = styled(RowBetween)`
  gap: 20px;
`

interface PoolInfo {
  pid: number
  name: string
  pair: string
  tvl: string
  rewards: string
  apr: string
}
export default function Farm() {
  //const theme = useTheme()
  const pair = getPairTokensWithDefaults(ChainId.BSC_TESTNET, 'WBNB/DUEL')
  const [activeTab, setActiveTab] = useState(0)
  const [typedValue, setTypedValue] = useState('')
  const [visibleForms, setVisibleForms] = useState<{ [key: number]: boolean }>({})

  const events = [
    {
      id: 0,
      name: 'Premier League',
      desc:
        'Which team will win the FA Cup? Make your choice, join the duel by staking your farms, get higher APR when you win.'
    },
    {
      id: 1,
      name: 'Rolex Belgian Grand Prix',
      desc: 'Who wins the race? Make your choice, join the duel by staking your farms, get higher APR when you win.'
    },
    {
      id: 2,
      name: 'Assets Prediction',
      desc:
        'Which will increase in percentage by 16th August? Make your choice, join the duel by staking your farms, get higher APR when you win.'
    },
    {
      id: 3,
      name: 'Election',
      desc:
        'Which one wins the election? Make your choice, join the duel by staking your farms, get higher APR when you win.'
    },
    {
      id: 4,
      name: 'User Experience',
      desc:
        'A company cannot decide on the structure of the application it will develop. You can help them by choosing the feature you like more. Which one do you prefer? Make your choice, join the duel by staking your farms, get higher APR when you win.'
    }
  ]

  const pools: { [event: number]: PoolInfo[] } = {
    0: [
      { pid: 0, name: 'Arsenal', pair: 'DUEL/BNB LP', tvl: '$101,916', rewards: '8.753', apr: '25.55%' },
      { pid: 1, name: 'Liverpool', pair: 'DUEL/BNB LP', tvl: '$101,916', rewards: '8.753', apr: '25.55%' }
    ],
    1: [
      { pid: 0, name: 'Hamilton', pair: 'DUEL/BNB LP', tvl: '$101,916', rewards: '8.753', apr: '25.55%' },
      { pid: 1, name: 'Verstappen', pair: 'DUEL/BNB LP', tvl: '$101,916', rewards: '8.753', apr: '25.55%' },
      { pid: 2, name: 'Lecler', pair: 'DUEL/BNB LP', tvl: '$101,916', rewards: '8.753', apr: '25.55%' }
    ],
    2: [
      { pid: 0, name: 'BTC', pair: 'DUEL/BNB LP', tvl: '$101,916', rewards: '8.753', apr: '25.55%' },
      { pid: 1, name: 'ETH', pair: 'DUEL/BNB LP', tvl: '$101,916', rewards: '8.753', apr: '25.55%' },
      { pid: 2, name: 'BNB', pair: 'DUEL/BNB LP', tvl: '$101,916', rewards: '8.753', apr: '25.55%' }
    ],
    3: [
      { pid: 0, name: 'Donald Trump', pair: 'DUEL/BNB LP', tvl: '$101,916', rewards: '8.753', apr: '25.55%' },
      { pid: 1, name: 'Joe Biden', pair: 'DUEL/BNB LP', tvl: '$101,916', rewards: '8.753', apr: '25.55%' }
    ],
    4: [
      {
        pid: 0,
        name: 'Augmented Reality',
        pair: 'DUEL/BNB LP',
        tvl: '$101,916',
        rewards: '8.753',
        apr: '25.55%'
      },
      { pid: 1, name: 'Virtual Reality', pair: 'DUEL/BNB LP', tvl: '$101,916', rewards: '8.753', apr: '25.55%' }
    ]
  }

  //const dummyPair = getPairInstance(new TokenAmount(pair[0], '0'), new TokenAmount(pair[1], '0'))

  const handleEventClick = (eventId: number): void => {
    setActiveTab(eventId)
  }

  const handlePoolClick = (pid: number): void => {
    console.log(pid)
    setVisibleForms(prev => ({
      ...prev,
      [pid]: !prev[pid]
    }))
  }

  const onUserInput = useCallback((typedValue: string) => {
    //setSignatureData(null)
    setTypedValue(typedValue)
  }, [])

  const onStake = () => {
    console.log('stake')
  }
  const handleMax = () => {
    console.log('max')
  }
  return (
    <PageWrapper gap="lg" justify="center">
      <EventsContainer>
        {events.map(event => {
          return (
            <EventItem key={event.id} active={activeTab === event.id} onClick={() => handleEventClick(event.id)}>
              {event.name}
            </EventItem>
          )
        })}
      </EventsContainer>
      <PoolsContainer>
        <PoolDesc>{events[activeTab].desc}</PoolDesc>
        <PoolRowsContainer>
          <PoolHeaderItem>Pool</PoolHeaderItem>
          <PoolHeaderItem>TVL</PoolHeaderItem>
          <PoolHeaderItem>Rewards</PoolHeaderItem>
          <PoolHeaderItemLast>APR</PoolHeaderItemLast>
        </PoolRowsContainer>
        {pools[activeTab].map(pool => {
          return (
            <PoolWrapper key={pool.pid} onClick={() => handlePoolClick(pool.pid)}>
              <PoolRowsContainer>
                <PoolColumn>
                  <PoolNameContainer>
                    <DoubleCurrencyLogo currency0={pair[0]} currency1={pair[1]} size={48} margin />
                    <PoolNameWrapper>
                      <PoolName>{pool.name}</PoolName>
                      <PoolPair>{pool.pair}</PoolPair>
                    </PoolNameWrapper>
                  </PoolNameContainer>
                </PoolColumn>
                <PoolColumn>{pool.tvl}</PoolColumn>
                <PoolColumnWrap>
                  <CurrencyLogo currency={pair[1]} />
                  <PoolRewardsAmount>{pool.rewards}</PoolRewardsAmount>
                  <PoolRewardsText>DUEL/DAY</PoolRewardsText>
                </PoolColumnWrap>
                <PoolColumnLast>{pool.apr}</PoolColumnLast>
              </PoolRowsContainer>
              <StakeUnstakeContainer show={visibleForms[pool.pid]}>
                <Divider />
                <CustomRowBetween>
                  <CurrencyInputPanel
                    value={typedValue}
                    onUserInput={onUserInput}
                    onMax={handleMax}
                    showMaxButton={true}
                    hideBalance={true}
                    currency={pair[1]}
                    label={''}
                    disableCurrencySelect={true}
                    id="stake-liquidity-token"
                  />
                  <CurrencyInputPanel
                    value={typedValue}
                    onUserInput={onUserInput}
                    onMax={handleMax}
                    showMaxButton={true}
                    hideBalance={true}
                    currency={pair[1]}
                    label={''}
                    disableCurrencySelect={true}
                    id="unstake-liquidity-token"
                  />
                </CustomRowBetween>
                <CustomRowBetween>
                  <CustomButton mr="0.5rem" onClick={onStake} confirmed={false} disabled={false}>
                    Stake
                  </CustomButton>
                  <CustomButtonRed mr="0.5rem" onClick={onStake} confirmed={false} disabled={false}>
                    Unstake
                  </CustomButtonRed>
                </CustomRowBetween>
              </StakeUnstakeContainer>
            </PoolWrapper>
          )
        })}
      </PoolsContainer>
    </PageWrapper>
  )
}
