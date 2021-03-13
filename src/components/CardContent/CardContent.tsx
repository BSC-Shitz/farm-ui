import React from 'react'
import styled from 'styled-components'

const CardContent: React.FC = ({ children }) => (
  <StyledCardContent>{children}</StyledCardContent>
)

const StyledCardContent = styled.div`
  color: ${(props) => props.theme.color.grey[500]};
  font-weight: 400;
  display: flex;
  font-size: 16px;
  flex: 1;
  flex-direction: column;
  padding: ${(props) => props.theme.spacing[3]}px;
`

export default CardContent
