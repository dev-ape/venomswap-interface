import React from 'react'
import styled from 'styled-components'
import { TYPE } from 'theme'

const BlurContainer = styled.div`
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(20, 31, 43, 0.75);
  backdrop-filter: blur(50px);
  display: flex;
  align-items: center;
  justify-content: center;
`

const BlurWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  align-items: center;
  max-width: 920px;
  width: 100%;
  gap: 20px;
`

const Title = styled.div`
  color: #e52421;
`
export default function Challenge() {
  return (
    <BlurContainer>
      <BlurWrapper>
        <Title>
          <TYPE.largeHeader>Challenges NFT</TYPE.largeHeader>
        </Title>
        <TYPE.mediumHeader>Coming Soon</TYPE.mediumHeader>
      </BlurWrapper>
    </BlurContainer>
  )
}
