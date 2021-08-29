import React from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { TYPE } from 'theme'

const PageWrapper = styled(AutoColumn)`
  max-width: 920px;
  width: 100%;
  grid-template-columns: 200px 720px;
  grid-column-gap: 24px;
`

export default function Soon() {
  return (
    <PageWrapper gap="lg" justify="center">
      <TYPE.largeHeader>Coming Soon</TYPE.largeHeader>
    </PageWrapper>
  )
}
