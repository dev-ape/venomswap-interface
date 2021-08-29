import React from 'react'
import { Currency } from '@venomswap/sdk'
import styled from 'styled-components'
import CurrencyLogo from '../CurrencyLogo'

const Wrapper = styled.div<{ margin: boolean; sizeraw: number }>`
  position: relative;
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-right: ${({ sizeraw, margin }) => margin && (sizeraw / 3 + 8).toString() + 'px'};
`

interface EventLogoProps {
  eventImg: string
  eventCurrency: Currency
}

const StyledLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
`

const HigherLogo = styled(StyledLogo)`
  z-index: 2;
`
const CoveredLogo = styled(CurrencyLogo)<{ sizeraw: number }>`
  position: absolute;
  left: ${({ sizeraw }) => '-' + (sizeraw / 2).toString() + 'px'} !important;
`

export default function EventPoolDoubleLogo({ eventImg, eventCurrency }: EventLogoProps) {
  return (
    <Wrapper sizeraw={16} margin={true}>
      {eventImg && <HigherLogo src={eventImg} size={'48px'} />}
      {eventCurrency && <CoveredLogo currency={eventCurrency} size={'48px'} sizeraw={48} />}
    </Wrapper>
  )
}
