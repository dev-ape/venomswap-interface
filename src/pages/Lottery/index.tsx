import React, { useState } from 'react'
import Column, { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { DateTime } from 'luxon'
import { JSBI } from '@venomswap/sdk'

import { ExternalLink, HideSmall, TYPE } from 'theme'
import { useActiveWeb3React } from 'hooks'

import { useTokenBalance } from 'state/wallet/hooks'
import { useLotteryInfo } from 'state/lottery/hooks'
import useGovernanceToken from 'hooks/useGovernanceToken'
import BuyTicketComponent from 'components/lottery/BuyTicket'

import { ReactComponent as QuestionIcon } from '../../assets/images/question.svg'
import { getEtherscanLink, shortenAddress } from 'utils'
import { ethers } from 'ethers'
import useCurrentBlockTimestamp from 'hooks/useCurrentBlockTimestamp'

const StyledQuestionIcon = styled(QuestionIcon)`
  path {
    stroke: ${({ theme }) => theme.text1};
  }
`

const PageWrapper = styled(AutoColumn)`
  max-width: 920px;
  width: 100%;
`

const LotteryTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  cursor: pointer;
`
const LotteryTitle = styled.div`
  font-size: 24px;
  font-weight: 700;
`
const LotteryDesc = styled.div<{ show?: boolean }>`
  display: ${({ show }) => (show ? 'flex' : 'none')};
  width: 100%;
  font-size: 14px;
  line-height: 20px;
  margin: 0 0 20px 0;
  color: ${({ theme }) => theme.text2};
`

const LotteriesContainer = styled(Column)`
  width: 100%;
  gap: 24px;
`

const LotteryRowsContainer = styled.div`
  display: grid;
  grid-template-columns: 40% repeat(4, auto);
  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-template-columns: repeat(4, auto);
  `};
  row-gap: 20px;
  cursor: pointer;
  user-select: none;
`

const LotteryWinnersContainer = styled.div`
  display: grid;
  grid-template-columns: 40% repeat(2, auto);
  row-gap: 20px;
`

const LotteryHeaderTitle = styled(TYPE.boldSubHeader)`
  padding: 0 1rem;
  color: ${({ theme }) => theme.text3};
`
const LotteryHeaderLast = styled(TYPE.boldSubHeader)`
  padding: 0 1rem;
  color: ${({ theme }) => theme.text3};
  justify-self: flex-end;
`

const LotteryWrapper = styled.div`
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
// const PoolName = styled.div``
// const PoolPair = styled.div`
//   font-size: 14px;
//   color: ${({ theme }) => theme.text3};
// `

const LotteryColumn = styled.div`
  display: flex;
  gap: 5px;
  padding: 0 1rem;
  align-self: center;
  justify-self: flex-start;
`
const LotteryColumnLast = styled.div`
  padding: 0 1rem;
  align-self: center;
  justify-self: flex-end;
`

const LotteryColumnWrap = styled.div`
  padding: 0 1rem;
  display: flex;
  align-items: center;
  gap: 6px;
`

const LotteryAmount = styled.div``
const LotteryToken = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text3};
`

const BuyTicketContainer = styled.div<{ show?: boolean }>`
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
const BuyTicketWrapper = styled.div`
  display: flex;
  gap: 20px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
  `};
`
const TextWrapper = styled.div`
  width: 100%;
  align-items: center;
  display: flex;
  text-align: center;
  font-size: 20px;
  padding: 6px 20px;
`

const HideSmallFlex = styled(HideSmall)`
  display: flex;
`

const AddressLink = styled(ExternalLink)`
  font-size: 0.825rem;
  color: ${({ theme }) => theme.text3};
  margin-left: 1rem;
  font-size: 0.825rem;
  display: flex;
  :hover {
    color: ${({ theme }) => theme.text2};
  }
`

export default function Lottery() {
  //const theme = useTheme()
  const { account, chainId } = useActiveWeb3React()
  const [visibleForms, setVisibleForms] = useState<{ [key: number]: boolean }>({})
  const [collapsed, setCollapsed] = useState(true)

  const blockTimestamp = useCurrentBlockTimestamp()
  const currentBlockTime = JSBI.BigInt(blockTimestamp?.toNumber() ?? 0)

  const lotteryInfo = useLotteryInfo()

  const activeLotteryInfo = lotteryInfo
    .sort((a, b) => JSBI.toNumber(a.startTime) - JSBI.toNumber(b.startTime))
    .filter(info => JSBI.lessThan(currentBlockTime, info.endTime))

  const winnerLotteryInfo = lotteryInfo
    .sort((a, b) => JSBI.toNumber(a.startTime) - JSBI.toNumber(b.startTime))
    .filter(info => info.winner != ethers.constants.AddressZero)

  const govToken = useGovernanceToken()

  const userBalace = useTokenBalance(account ?? undefined, govToken)

  const handleLotteryClick = (id: number): void => {
    setVisibleForms(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  return (
    <PageWrapper gap="lg" justify="center">
      <LotteryTitleWrapper onClick={() => setCollapsed(!collapsed)}>
        <LotteryTitle>Active Lotteries</LotteryTitle>
        <StyledQuestionIcon />
      </LotteryTitleWrapper>

      <LotteryDesc show={!collapsed}>
        Write down the number of participation rights you want to receive. When you write and confirm the number of
        participation rights you want to receive, your Duel account will be automatically deducted for $25.
        <br />
        The right to participate per person is unlimited.
        <br />
        - $2,500 BUSD when $10,000 worth of Duel accumulates in the pool
        <br />
        - $5,000 BUSD when $20,000 worth of Duel accumulates in the pool
        <br />
        - $10,000 BUSD when $40,000 worth of Duel accumulates in the pool
        <br />
        - When $50,000 worth of Duel accumulates in the pool, $12,500 in BUSD will be distributed as a reward.
        <br />
        All Duels accumulated in the pool will be burned at the end of the lottery.
        <br />
        SoftCap: Minimum Duel amount to start the Lottery
        <br />
        Tickets: The maximum number of buyable tickets
        <br />
        Ticket Price: $25 Duels
        <br />
        Owned: The number of tickets you have
      </LotteryDesc>
      {activeLotteryInfo.length > 0 && (
        <LotteriesContainer>
          <LotteryRowsContainer>
            <LotteryHeaderTitle>Lottery</LotteryHeaderTitle>
            <HideSmallFlex>
              <LotteryHeaderTitle>Soft Cap</LotteryHeaderTitle>
            </HideSmallFlex>
            <LotteryHeaderTitle>Tickets</LotteryHeaderTitle>
            <LotteryHeaderTitle>Ticket price</LotteryHeaderTitle>
            <LotteryHeaderLast>Owned</LotteryHeaderLast>
          </LotteryRowsContainer>
          {activeLotteryInfo.map((info, index) => {
            return (
              <LotteryWrapper key={index}>
                <LotteryRowsContainer onClick={() => handleLotteryClick(index)}>
                  <LotteryColumn>
                    #{index}{' '}
                    <HideSmallFlex>
                      {DateTime.fromSeconds(JSBI.toNumber(info.startTime)).toLocaleString(DateTime.DATETIME_SHORT)}{' '}
                      {'-'} {DateTime.fromSeconds(JSBI.toNumber(info.endTime)).toLocaleString(DateTime.DATETIME_SHORT)}
                    </HideSmallFlex>
                  </LotteryColumn>
                  <HideSmallFlex>
                    <LotteryColumnWrap>
                      <LotteryAmount>
                        {info.softCap && info.softCap.toSignificant(4, { groupSeparator: ',' })}
                      </LotteryAmount>
                      <LotteryToken>DUEL</LotteryToken>
                    </LotteryColumnWrap>
                  </HideSmallFlex>
                  <LotteryColumn>
                    {info.currentSupply.toString()} {'/'} {info.ticketSupply.toString()}
                  </LotteryColumn>
                  <LotteryColumnWrap>
                    <LotteryAmount>
                      {info.ticketPrice && info.ticketPrice.toSignificant(4, { groupSeparator: ',' })}
                    </LotteryAmount>
                    <LotteryToken>DUEL</LotteryToken>
                  </LotteryColumnWrap>
                  <LotteryColumnLast>{info.userTicketCount.toString()}</LotteryColumnLast>
                </LotteryRowsContainer>
                <BuyTicketContainer show={visibleForms[index]}>
                  <Divider />
                  <BuyTicketWrapper>
                    {info.canBuy && <BuyTicketComponent info={info} balance={userBalace} />}
                    {!info.canBuy && <TextWrapper>You can not buy tickets at this time.</TextWrapper>}
                  </BuyTicketWrapper>
                </BuyTicketContainer>
              </LotteryWrapper>
            )
          })}
        </LotteriesContainer>
      )}

      {winnerLotteryInfo.length > 0 && (
        <>
          <LotteryTitleWrapper>
            <LotteryTitle>Past Winners</LotteryTitle>
          </LotteryTitleWrapper>

          <LotteriesContainer>
            <LotteryWinnersContainer>
              <LotteryHeaderTitle>Lottery</LotteryHeaderTitle>
              <LotteryHeaderTitle>Winner</LotteryHeaderTitle>
              <LotteryHeaderLast>Won</LotteryHeaderLast>
            </LotteryWinnersContainer>
            {winnerLotteryInfo.map((info, index) => {
              return (
                <LotteryWrapper key={index}>
                  <LotteryWinnersContainer>
                    <LotteryColumn>
                      #{index}{' '}
                      <HideSmallFlex>
                        {DateTime.fromSeconds(JSBI.toNumber(info.startTime)).toLocaleString(DateTime.DATETIME_SHORT)}{' '}
                        {'-'}{' '}
                        {DateTime.fromSeconds(JSBI.toNumber(info.endTime)).toLocaleString(DateTime.DATETIME_SHORT)}
                      </HideSmallFlex>
                    </LotteryColumn>
                    <LotteryColumn title={info.winner}>
                      {chainId && info.winner && (
                        <AddressLink href={chainId && getEtherscanLink(chainId, info.winner, 'address')}>
                          <span>{shortenAddress(info.winner)}</span>
                        </AddressLink>
                      )}
                    </LotteryColumn>
                    <LotteryColumnLast>
                      {info.winAmount && info.winAmount.toSignificant(4, { groupSeparator: ',' })} BUSD
                    </LotteryColumnLast>
                  </LotteryWinnersContainer>
                </LotteryWrapper>
              )
            })}
          </LotteriesContainer>
        </>
      )}

      {lotteryInfo.length === 0 && <TYPE.largeHeader>No active lotteries, please check back later.</TYPE.largeHeader>}
    </PageWrapper>
  )
}
