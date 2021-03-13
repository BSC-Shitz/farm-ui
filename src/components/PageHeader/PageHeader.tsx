import React from 'react'
import styled from 'styled-components'

import Container from '../Container'

interface PageHeaderProps {
  subtitle?: string
  title?: string
}

const PageHeader: React.FC<PageHeaderProps> = ({ subtitle, title }) => {
  return (
    <Container size="sm">
      <StyledPageHeader>
        <StyledTitle>{title}</StyledTitle>
        <StyledSubtitle>{subtitle}</StyledSubtitle>
      </StyledPageHeader>
    </Container>
  )
}

const StyledPageHeader = styled.div`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding-bottom: ${(props) => props.theme.spacing[6]}px;
  padding-top: ${(props) => props.theme.spacing[6]}px;
  margin: 1 auto;
`

const StyledIcon = styled.div`
  font-size: 120px;
  height: 240px;
  line-height: 120px;
  text-align: center;
  width: 240px;
`

const StyledTitle = styled.h1`
  
  color: ${(props) => props.theme.color.grey[600]};
  font-size: 48px;
  text-align: center;
  font-weight: 700;
  margin: 1;
  padding: 0;
`

const StyledSubtitle = styled.h3`
  color: ${(props) => props.theme.color.grey[400]};
  font-size: 18px;
  font-weight: 400;
  margin: 0;
  padding: 0;
  text-align: center;
`

export default PageHeader
