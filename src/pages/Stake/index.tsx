import React, { useState } from 'react'
import Column, { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
//import { useActiveWeb3React } from 'hooks'
//import { useBlockNumber } from 'state/application/hooks'
//import { useTokenBalance } from 'state/wallet/hooks'
//import { useStakeInfo } from 'state/farm/hooks'
//import useConfigStaking from 'hooks/useStakingConfig'
import StakingComponent from 'components/stake/Stake'
import UnstakingComponent from 'components/stake/Unstake'
import useConfigStaking from 'hooks/useStakingConfig'
import { useActiveWeb3React } from 'hooks'
import { useTokenBalance } from 'state/wallet/hooks'
import { useStakeInfo } from 'state/farm/hooks'
import ClaimComponent from 'components/stake/Claim'
import { TYPE } from 'theme'

const PageWrapper = styled(AutoColumn)`
  max-width: 720px;
  width: 100%;
`

const PageColumn = styled(Column)`
  max-width: 720px;
  width: 100%;
`

const StakeTitle = styled.div`
  width: 100%;
  font-size: 24px;
  font-weight: 700;
`

const StakeDesc = styled.div`
  width: 100%;
  font-size: 16px;
  line-height: 20px;
  font-weight: 500;
  margin: 20px 0;
  color: ${({ theme }) => theme.text2};
`
const StakeContainer = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  grid-column-gap: 12px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    grid-gap: 12px;
  `};
`

const StakeUnstakeWrapper = styled.div`
  display: flex;
  gap: 20px;
  flex-direction: column;

  padding: 20px 0;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.bg3};
  border: none;
  color: ${({ theme }) => theme.text1};
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 15px ${({ theme }) => theme.advancedBG};

  /* ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
  `}; */
`

const StakeTabWrapper = styled.div`
  padding: 0 1rem;
  display: flex;
  gap: 16px;
`

const StakeTabTitle = styled.div<{ active?: boolean }>`
  font-size: 20px;
  padding: 6px 20px;
  color: ${({ theme, active }) => (active ? theme.text1 : theme.text3)};
  cursor: pointer;
`

const InputWrapper = styled.div<{ show?: boolean }>`
  width: 100%;
  display: ${({ show }) => (show ? 'flex' : 'none')};
  flex-direction: column;
  gap: 20px;
`

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  gap: 20px;

  padding: 16px 20px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.bg3};
  border: none;
  box-shadow: 0 4px 15px ${({ theme }) => theme.advancedBG};
`
const StatsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const StatsTitle = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.text3};
`
const StatsValue = styled.div`
  font-size: 16px;
`
const ClaimWrapper = styled.div``

const TextWrapper = styled.div`
  width: 100%;
  align-items: center;
  display: flex;
  text-align: center;
  font-size: 20px;
  padding: 6px 20px;
`

export default function Stake() {
  //const theme = useTheme()
  const { chainId, account } = useActiveWeb3React()
  const [stakeSelected, setStakeSelected] = useState(true)

  const stakingConfig = useConfigStaking(chainId)

  const stakeInfo = useStakeInfo(stakingConfig?.address)

  //const lastBlockNumber = useBlockNumber()

  const userUnstaked = useTokenBalance(account ?? undefined, stakeInfo?.stakedAmount?.token)

  return (
    <PageWrapper gap="lg" justify="center">
      <PageColumn>
        <StakeTitle>Stake</StakeTitle>
        <StakeDesc>Stake DUEL earn DUEL!</StakeDesc>
        {stakeInfo && (
          <StakeContainer>
            <StakeUnstakeWrapper>
              <StakeTabWrapper>
                <StakeTabTitle active={stakeSelected} onClick={() => setStakeSelected(true)}>
                  Stake
                </StakeTabTitle>
                <StakeTabTitle active={!stakeSelected} onClick={() => setStakeSelected(false)}>
                  Unstake
                </StakeTabTitle>
              </StakeTabWrapper>
              {!stakeInfo?.canDeposit && (
                <TextWrapper>Deposit deadline time has passed. Please check back later.</TextWrapper>
              )}
              {stakeInfo?.canDeposit && (
                <InputWrapper show={stakeSelected}>
                  <StakingComponent
                    address={stakingConfig?.address}
                    stakeInfo={stakeInfo}
                    unstakedAmount={userUnstaked}
                  />
                </InputWrapper>
              )}
              <InputWrapper show={!stakeSelected}>
                <UnstakingComponent address={stakingConfig?.address} stakeInfo={stakeInfo} />
              </InputWrapper>
            </StakeUnstakeWrapper>
            <StatsContainer>
              <StatsRow>
                <StatsTitle>TVL</StatsTitle>
                <StatsValue>
                  {stakeInfo?.valueOfTotalStakedAmountInUsd
                    ? `$${stakeInfo?.valueOfTotalStakedAmountInUsd.toSignificant(2, { groupSeparator: ',' })}`
                    : '-'}
                </StatsValue>
              </StatsRow>
              <StatsRow>
                <StatsTitle>APR</StatsTitle>
                <StatsValue>
                  {stakeInfo?.apr && stakeInfo?.apr.greaterThan('0')
                    ? `${stakeInfo?.apr.multiply('100').toSignificant(4, { groupSeparator: ',' })}%`
                    : 'TBD'}
                </StatsValue>
              </StatsRow>
              <StatsRow>
                <StatsTitle>Staked</StatsTitle>
                <StatsValue>{stakeInfo?.stakedAmount.toSignificant(4, { groupSeparator: ',' })} DUEL</StatsValue>
              </StatsRow>
              <StatsRow>
                <StatsTitle>Rewards</StatsTitle>
                <StatsValue>{stakeInfo?.earnedAmount.toSignificant(4, { groupSeparator: ',' })} DUEL</StatsValue>
              </StatsRow>
              <ClaimWrapper>
                <ClaimComponent address={stakingConfig?.address} stakeInfo={stakeInfo} />
              </ClaimWrapper>
            </StatsContainer>
          </StakeContainer>
        )}
        {!stakeInfo && <TYPE.largeHeader>No active staking pools, please check back later.</TYPE.largeHeader>}
      </PageColumn>
    </PageWrapper>
  )
}
