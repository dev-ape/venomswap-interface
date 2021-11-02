import React, { useState, useCallback } from 'react'
import useTransactionDeadline from '../../hooks/useTransactionDeadline'
import { AutoColumn } from '../Column'
import styled from 'styled-components'
import { TokenAmount } from '@venomswap/sdk'
import { TransactionResponse } from '@ethersproject/providers'

import { RowBetween } from '../Row'
import { TYPE, CloseIcon } from '../../theme'
import { ButtonError } from '../Button'
import CurrencyInputPanel from '../CurrencyInputPanel'
import { useActiveWeb3React } from '../../hooks'
import { useLotteryContract } from '../../hooks/useContract'
import { useApproveCallback, ApprovalState } from '../../hooks/useApproveCallback'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { calculateGasMargin } from '../../utils'
import { LotteryInfo, useDerivedBuyInfo } from 'state/lottery/hooks'

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
const ButtonErrorWrapper = styled(ButtonError)<{ show?: boolean }>`
  display: ${({ show }) => (show ? 'flex' : 'none')};
  height: 40px;
  border-radius: 8px;
  width: 100%;
  margin-right: 0;
`

interface StakingProps {
  info: LotteryInfo
  balance: TokenAmount | undefined
}

export default function BuyTicketComponent({ info, balance }: StakingProps) {
  const { library } = useActiveWeb3React()

  const ticketPrice = info?.ticketPrice
  // track and parse user input
  const [typedValue, setTypedValue] = useState('')
  const { parsedAmount, tokenAmount, error } = useDerivedBuyInfo(typedValue, ticketPrice, balance)

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

  const lotteryContract = useLotteryContract(info.address)

  const deadline = useTransactionDeadline()
  const [signatureData, setSignatureData] = useState<{ v: number; r: string; s: string; deadline: number } | null>(null)
  const [approval, approveCallback] = useApproveCallback(tokenAmount, lotteryContract?.address)

  async function onBuy() {
    setAttempting(true)
    if (lotteryContract && parsedAmount && deadline) {
      if (approval === ApprovalState.APPROVED) {
        const formattedAmount = `0x${parsedAmount.toString(16)}`

        const estimatedGas = await lotteryContract.estimateGas.buyTicket(formattedAmount)

        await lotteryContract
          .buyTicket(formattedAmount, {
            gasLimit: calculateGasMargin(estimatedGas)
          })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: `Buy Tickets`
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
      } else {
        setAttempting(false)
        throw new Error('Attempting to buy tickets without approval or a signature. Please contact support.')
      }
    }
  }

  // wrapped onUserInput to clear signatures
  const onUserInput = useCallback((typedValue: string) => {
    setSignatureData(null)
    setTypedValue(typedValue)
  }, [])

  async function onAttemptToApprove() {
    if (!library || !deadline) throw new Error('missing dependencies')
    const liquidityAmount = parsedAmount
    if (!liquidityAmount) throw new Error('missing liquidity amount')

    return approveCallback()
  }

  return (
    <ContentWrapper gap="lg">
      {!failed && (
        <InputWrapper>
          <CurrencyInputPanel
            value={typedValue}
            onUserInput={onUserInput}
            showMaxButton={false}
            currency={info.softCap.token}
            label={''}
            disableCurrencySelect={true}
            customBalanceText={'Balance: '}
            id="buy-ticket"
          />

          <>
            <ButtonErrorWrapper
              onClick={onAttemptToApprove}
              disabled={approval !== ApprovalState.NOT_APPROVED || signatureData !== null}
              show={approval !== ApprovalState.APPROVED}
              error={!!error && !!parsedAmount}
            >
              {error ?? 'Approve'}
            </ButtonErrorWrapper>
            <ButtonErrorWrapper
              disabled={!!error || (signatureData === null && approval !== ApprovalState.APPROVED)}
              show={approval === ApprovalState.APPROVED}
              error={!!error && !!parsedAmount}
              onClick={onBuy}
            >
              {error ?? 'Buy Tickets'}
            </ButtonErrorWrapper>
          </>
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
