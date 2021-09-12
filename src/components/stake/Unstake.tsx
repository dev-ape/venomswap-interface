import React, { useState, useCallback } from 'react'
import { AutoColumn } from '../Column'
import styled from 'styled-components'
import { RowBetween } from '../Row'
import { TYPE, CloseIcon } from '../../theme'
import { ButtonError } from '../Button'
import CurrencyInputPanel from '../CurrencyInputPanel'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { calculateGasMargin } from '../../utils'
import { StakeInfo, useDerivedUnstakeInfo } from 'state/farm/hooks'
import { useStakeContract } from 'hooks/useContract'

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
  address: string | undefined
  stakeInfo: StakeInfo
}

export default function UnstakingComponent({ address, stakeInfo }: UnstakingProps) {
  // track and parse user input
  const [typedValue, setTypedValue] = useState('')
  const { parsedAmount, error } = useDerivedUnstakeInfo(typedValue, stakeInfo.stakedAmount)

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

  const stakeContract = useStakeContract(address)

  async function onWithdraw() {
    if (stakeContract && stakeInfo?.stakedAmount) {
      setAttempting(true)

      const formattedAmount = `0x${parsedAmount?.raw.toString(16)}`
      const estimatedGas = await stakeContract.estimateGas.withdraw(stakeInfo.pid, formattedAmount)

      await stakeContract
        .withdraw(stakeInfo.pid, formattedAmount, {
          gasLimit: calculateGasMargin(estimatedGas)
        })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Unstake tokens`
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
  const maxAmountInput = maxAmountSpend(stakeInfo.stakedAmount)
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
            currency={stakeInfo.stakedAmount.token}
            label={''}
            disableCurrencySelect={true}
            overrideSelectedCurrencyBalance={stakeInfo.stakedAmount}
            customBalanceText={'Available to unstake: '}
            id="unstake-token"
          />

          <ButtonErrorWrapper disabled={!!error} error={!!error && !!parsedAmount} onClick={onWithdraw}>
            {error ?? 'Unstake'}
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
