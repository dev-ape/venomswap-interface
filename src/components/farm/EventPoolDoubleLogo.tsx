import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div<{ margin: boolean; sizeraw: number }>`
  position: relative;
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-right: ${({ sizeraw, margin }) => margin && (sizeraw / 3 + 8).toString() + 'px'};
`

interface EventLogoProps {
  eventImg1: string
  eventImg2: string
}

const StyledLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
`

const HigherLogo = styled(StyledLogo)`
  z-index: 2;
`

export default function EventPoolDoubleLogo({ eventImg1, eventImg2 }: EventLogoProps) {
  return (
    <Wrapper sizeraw={16} margin={true}>
      {eventImg1 && <HigherLogo src={eventImg1} size={'48px'} />}
      {eventImg2 && <HigherLogo src={eventImg2} size={'48px'} />}
    </Wrapper>
  )
}
