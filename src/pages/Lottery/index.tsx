import React, { useState } from 'react'
import Column, { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { DateTime } from 'luxon'
import { JSBI } from '@venomswap/sdk'

import { HideSmall, TYPE } from 'theme'
import { useActiveWeb3React } from 'hooks'

import { useTokenBalance } from 'state/wallet/hooks'
import { useLotteryInfo } from 'state/lottery/hooks'
import useGovernanceToken from 'hooks/useGovernanceToken'
import BuyTicketComponent from 'components/lottery/BuyTicket'

const PageWrapper = styled(AutoColumn)`
  max-width: 920px;
  width: 100%;
`

const LotteriesContainer = styled(Column)`
  width: 100%;
  gap: 24px;
`

const LotteryRowsContainer = styled.div`
  display: grid;
  grid-template-columns: 40% repeat(4, auto);
  row-gap: 20px;
  cursor: pointer;
  user-select: none;
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

export default function Lottery() {
  //const theme = useTheme()
  const { account } = useActiveWeb3React()
  const [visibleForms, setVisibleForms] = useState<{ [key: number]: boolean }>({})

  const lotteryInfo = useLotteryInfo()

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
      {lotteryInfo.length > 0 && (
        <LotteriesContainer>
          <LotteryRowsContainer>
            <LotteryHeaderTitle>Lotter #</LotteryHeaderTitle>
            <HideSmallFlex>
              <LotteryHeaderTitle>Soft Cap</LotteryHeaderTitle>
            </HideSmallFlex>
            <LotteryHeaderTitle>Tickets</LotteryHeaderTitle>
            <LotteryHeaderTitle>Ticket price</LotteryHeaderTitle>
            <LotteryHeaderLast>Owned</LotteryHeaderLast>
          </LotteryRowsContainer>
          {lotteryInfo.map((info, index) => {
            return (
              <LotteryWrapper key={index}>
                <LotteryRowsContainer onClick={() => handleLotteryClick(index)}>
                  <LotteryColumn>
                    #{index}{' '}
                    {DateTime.fromSeconds(JSBI.toNumber(info.startTime)).toLocaleString(DateTime.DATETIME_SHORT)} {'-'}{' '}
                    {DateTime.fromSeconds(JSBI.toNumber(info.endTime)).toLocaleString(DateTime.DATETIME_SHORT)}
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
      {lotteryInfo.length === 0 && <TYPE.largeHeader>No active lotteries, please check back later.</TYPE.largeHeader>}
    </PageWrapper>
  )
}
