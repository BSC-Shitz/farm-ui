import React from 'react'
import styled from 'styled-components'

const Card: React.FC = ({ children }) => <StyledCard>{children}</StyledCard>

const StyledCard = styled.div`
  background: #1e1e1e;
  background: linear-gradient(to left top, rgba(22,22,22,1) 0%, rgba(0,0,0,1) 40%, rgba(13,13,13,1) 100%);
  border-bottom: 1px solid #f1f1f1;
  border-right: 1px solid #f1f1f1;
  border-top: 1px solid #fff;
  border-left: 1px solid #fff;
  border-radius: 12px;
  box-shadow: 2px 2px 2px #c8c8c8;
  color:#fff;
  display: flex;
  flex: 1;
  flex-direction: column;
`

export default Card
