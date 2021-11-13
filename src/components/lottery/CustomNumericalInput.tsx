import React from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { Currency, CurrencyAmount, TokenAmount } from '@venomswap/sdk'
import { RowBetween } from '../Row'
import { TYPE } from '../../theme'
import { Input as NumericalInput } from '../NumericalInput'
import useTheme from '../../hooks/useTheme'
import CurrencyLogo from 'components/CurrencyLogo'

const InputRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: 0.75rem 0.5rem 0.75rem 1rem;
`

const LabelRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.text1};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0 1rem;
  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.text2)};
  }
`

const InputPanel = styled.div`
  width: 100%;
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.bg1};
  z-index: 1;
`

const Container = styled.div`
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.bg1};
  background-color: ${({ theme }) => theme.bg2};
`

const CurrencySelect = styled.button`
  align-items: center;
  height: 2.2rem;
  font-size: 20px;
  font-weight: 500;
  background-color: ${({ theme }) => theme.bg2};
  color: ${({ theme }) => theme.text1};
  border-radius: 12px;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 0 0.5rem;

  :focus,
  :hover {
    background-color: ${({ theme }) => theme.bg2};
  }
`

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
`

const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? '  margin: 0 0.25rem 0 0.75rem;' : '  margin: 0 0.25rem 0 0.25rem;')}
  font-size:  ${({ active }) => (active ? '20px' : '16px')};

`

interface CustomNumericalInputProps {
  id: string
  value: string
  onUserInput: (value: string) => void
  label?: string
  placeholder?: string
  hideBalance?: boolean
  customBalanceText?: string
  balance?: CurrencyAmount | null
  currency?: Currency | null
  price?: TokenAmount | undefined
}

export default function CustomNumericalInput({
  id,
  value,
  onUserInput,
  label = 'Input',
  placeholder = '0',
  hideBalance = false,
  customBalanceText,
  balance = null,
  currency,
  price
}: CustomNumericalInputProps) {
  const theme = useTheme()

  return (
    <InputPanel id={id}>
      <Container>
        <LabelRow>
          <RowBetween>
            <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
              {label}
            </TYPE.body>
            {!hideBalance && (
              <TYPE.body
                color={theme.text2}
                fontWeight={500}
                fontSize={14}
                style={{ display: 'inline', cursor: 'pointer' }}
              >
                {!hideBalance && !!balance ? (customBalanceText ?? 'Balance: ') + balance?.toSignificant(6) : ' -'}
              </TYPE.body>
            )}
          </RowBetween>
        </LabelRow>
        <InputRow>
          <NumericalInput
            className="token-amount-input"
            value={value}
            placeholder={placeholder}
            onUserInput={val => {
              onUserInput(val)
            }}
          />
          {currency && (
            <CurrencySelect>
              <Aligner>
                {price?.toSignificant(6)}
                <CurrencyLogo currency={currency} size={'24px'} />
                <StyledTokenName>{currency.symbol} per ticket</StyledTokenName>
              </Aligner>
            </CurrencySelect>
          )}
        </InputRow>
      </Container>
    </InputPanel>
  )
}
