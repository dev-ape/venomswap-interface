import React, { useState, useCallback } from 'react'
import { AutoColumn } from '../Column'
import styled from 'styled-components'
import { RowBetween } from '../Row'
import { TYPE, CloseIcon } from '../../theme'
import { ButtonError } from '../Button'
import CurrencyInputPanel from '../CurrencyInputPanel'
import { TokenAmount } from '@venomswap/sdk'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { useEventContract } from '../../hooks/useContract'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { calculateGasMargin, getPairInstance } from '../../utils'
import { EventInfo, useDerivedUnstakeInfo } from 'state/event/hooks'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 1rem;
`

const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`
const ButtonErrorWrapper = styled(ButtonError)`
  height: 40px;
  border-radius: 8px;
  width: 100%;
  margin-right: 0;
`

interface UnstakingProps {
  address: string
  eventInfo: EventInfo
}

export default function UnstakingComponent({ address, eventInfo }: UnstakingProps) {
  // track and parse user input
  const [typedValue, setTypedValue] = useState('')
  const { parsedAmount, error } = useDerivedUnstakeInfo(typedValue, eventInfo.stakedAmount)

  // state for pending and submitted txn views
  const addTransaction = useTransactionAdder()
  const [attempting, setAttempting] = useState<boolean>(false)
  const [hash, setHash] = useState<string | undefined>()
  const [failed, setFailed] = useState<boolean>(false)
  const wrappedOnDismiss = useCallback(() => {
    setHash(undefined)
    setAttempting(false)
    setFailed(false)
    setTypedValue('')
  }, [])

  const eventContract = useEventContract(address)

  // pair contract for this token to be staked
  const dummyPair = getPairInstance(
    new TokenAmount(eventInfo.tokens[0], '0'),
    new TokenAmount(eventInfo.tokens[1], '0')
  )
  async function onWithdraw() {
    if (eventContract && eventInfo?.stakedAmount) {
      setAttempting(true)

      const formattedAmount = `0x${parsedAmount?.raw.toString(16)}`
      const estimatedGas = await eventContract.estimateGas.withdraw(eventInfo.pid, formattedAmount)

      await eventContract
        .withdraw(eventInfo.pid, formattedAmount, {
          gasLimit: calculateGasMargin(estimatedGas)
        })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Withdraw deposited liquidity`
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

  // wrapped onUserInput to clear signatures
  const onUserInput = useCallback((typedValue: string) => {
    setTypedValue(typedValue)
  }, [])

  // used for max input button
  const maxAmountInput = maxAmountSpend(eventInfo.stakedAmount)
  const atMaxAmount = Boolean(maxAmountInput && parsedAmount?.equalTo(maxAmountInput))
  const handleMax = useCallback(() => {
    maxAmountInput && onUserInput(maxAmountInput.toExact())
  }, [maxAmountInput, onUserInput])

  return (
    <ContentWrapper gap="lg">
      {!failed && (
        <InputWrapper>
          <CurrencyInputPanel
            value={typedValue}
            onUserInput={onUserInput}
            onMax={handleMax}
            showMaxButton={!atMaxAmount}
            currency={eventInfo.stakedAmount.token}
            pair={dummyPair}
            label={''}
            disableCurrencySelect={true}
            overrideSelectedCurrencyBalance={eventInfo.stakedAmount}
            customBalanceText={'Available to withdraw: '}
            id="stake-liquidity-token"
          />

          <ButtonErrorWrapper disabled={!!error} error={!!error && !!parsedAmount} onClick={onWithdraw}>
            {error ?? 'Withdraw'}
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
