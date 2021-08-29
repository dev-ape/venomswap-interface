import React, { useState, useCallback } from 'react'

import { AutoColumn } from '../Column'
import styled from 'styled-components'
import { RowBetween } from '../Row'
import { TYPE, CloseIcon } from '../../theme'
import { ButtonError } from '../Button'

import { useEventContract } from '../../hooks/useContract'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { calculateGasMargin } from '../../utils'
import { EventInfo } from 'state/event/hooks'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 1rem;
`

const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: space-between;
`
const ButtonErrorWrapper = styled(ButtonError)<{ show?: boolean }>`
  display: ${({ show }) => (show ? 'flex' : 'none')};
  height: 40px;
  border-radius: 8px;
  width: 100%;
  margin-right: 0;
`

const RewardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  align-items: center;
  gap: 5px;
`
const RewardAmount = styled.div`
  font-size: 24px;
`
const RewardText = styled.div`
  font-size: 24px;
  color: ${({ theme }) => theme.text3};
`

interface ExitProps {
  address: string
  eventInfo: EventInfo
}

export default function ExitComponent({ address, eventInfo }: ExitProps) {
  // state for pending and submitted txn views
  const addTransaction = useTransactionAdder()
  const [attempting, setAttempting] = useState<boolean>(false)
  const [hash, setHash] = useState<string | undefined>()
  const [failed, setFailed] = useState<boolean>(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const wrappedOnDismiss = useCallback(() => {
    setError(undefined)
    setHash(undefined)
    setAttempting(false)
    setFailed(false)
  }, [])

  const eventContract = useEventContract(address)

  async function onExit() {
    if (eventContract) {
      setAttempting(true)

      const estimatedGas = await eventContract.estimateGas.exit(eventInfo.pid)

      await eventContract
        .exit(eventInfo.pid, {
          gasLimit: calculateGasMargin(estimatedGas)
        })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Exit from the event pool`
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
          <RewardWrapper>
            <RewardAmount>{eventInfo?.earnedAmount.toSignificant(4, { groupSeparator: ',' })}</RewardAmount>
            <RewardText>DUEL</RewardText>
          </RewardWrapper>
          <ButtonErrorWrapper disabled={!!error} show={true} error={!!error} onClick={onExit}>
            {error ?? 'Claim & Exit'}
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
