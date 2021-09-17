import React, { useState, useCallback } from 'react'
import { AutoColumn } from '../Column'
import styled from 'styled-components'
import { RowBetween } from '../Row'
import { TYPE, CloseIcon } from '../../theme'
import { ButtonError } from '../Button'
import { useStakeContract } from '../../hooks/useContract'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { calculateGasMargin } from '../../utils'
import { StakeInfo } from 'state/farm/hooks'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 1rem;
`

const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: flex-end;
`
const ButtonErrorWrapper = styled(ButtonError)`
  height: 40px;
  border-radius: 8px;
  width: 100%;
  margin-right: 0;
`

interface ClaimProps {
  address: string | undefined
  stakeInfo: StakeInfo
}

export default function ClaimComponent({ address, stakeInfo }: ClaimProps) {
  // state for pending and submitted txn views
  const addTransaction = useTransactionAdder()
  const [attempting, setAttempting] = useState<boolean>(false)
  const [hash, setHash] = useState<string | undefined>()
  const [failed, setFailed] = useState<boolean>(false)
  const [error, setError] = useState<string | undefined>()
  const wrappedOnDismiss = useCallback(() => {
    setHash(undefined)
    setAttempting(false)
    setFailed(false)
    setError('')
  }, [])

  const stakeContract = useStakeContract(address)

  async function onWithdraw() {
    if (stakeContract && stakeInfo?.stakedAmount) {
      setAttempting(true)

      const estimatedGas = await stakeContract.estimateGas.withdraw(stakeInfo.pid, 0)

      await stakeContract
        .withdraw(stakeInfo.pid, 0, {
          gasLimit: calculateGasMargin(estimatedGas)
        })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Claim rewards from Staking`
          })
          setHash(response.hash)
          wrappedOnDismiss()
        })
        .catch((error: any) => {
          setAttempting(false)
          if (error?.code === -32603) {
            setFailed(true)
          }
          console.log(error)
        })
    }
  }

  return (
    <ContentWrapper gap="lg">
      {!failed && (
        <InputWrapper>
          <ButtonErrorWrapper disabled={stakeInfo?.earnedAmount.equalTo('0')} error={!!error} onClick={onWithdraw}>
            {'Claim'}
          </ButtonErrorWrapper>
        </InputWrapper>
      )}
      {!attempting && !hash && failed && (
        <ContentWrapper gap="sm">
          <RowBetween>
            <TYPE.mediumHeader>
              <span role="img" aria-label="wizard-icon" style={{ marginRight: '0.5rem' }}>
                ⚠️
              </span>
              Error!
            </TYPE.mediumHeader>
            <CloseIcon onClick={wrappedOnDismiss} />
          </RowBetween>
          <TYPE.subHeader style={{ textAlign: 'center' }}>
            Your transaction couldn&apos;t be submitted.
            <br />
            You may have to increase your Gas Price (GWEI) settings!
          </TYPE.subHeader>
        </ContentWrapper>
      )}
    </ContentWrapper>
  )
}
