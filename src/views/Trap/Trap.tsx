import React, { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import PageHeader from '../../components/PageHeader'
import Spacer from '../../components/Spacer'
import useTrap from '../../hooks/useTrap'
import useRedeem from '../../hooks/useRedeem'
import useDrugs from '../../hooks/useDrugs'
import { getOriginalGangsterContract } from '../../drugs/utils'
import { getContract } from '../../utils/erc20'
import Harvest from './components/Harvest'
import Stake from './components/Stake'
import Button from '../../components/Button'

const Trap: React.FC = () => {
  const { trapId } = useParams()
  const {
    pid,
    lpToken,
    lpTokenAddress,
    tokenAddress,
    earnToken,
    name,
    icon,
    lppairurl,
    lpaddurl,
  } = useTrap(trapId) || {
    pid: 0,
    lpToken: '',
    lpTokenAddress: '',
    tokenAddress: '',
    earnToken: '',
    name: '',
    icon: '',
    lppairurl: '',
    lpaddurl: '',
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const drugs = useDrugs()
  const { ethereum } = useWallet()

  const lpContract = useMemo(() => {
    return getContract(ethereum as provider, lpTokenAddress)
  }, [ethereum, lpTokenAddress])

  const { onRedeem } = useRedeem(getOriginalGangsterContract(drugs))

  const lpTokenName = useMemo(() => {
    return lpToken
  }, [lpToken])

  const earnTokenName = useMemo(() => {
    return earnToken.toUpperCase()
  }, [earnToken])

  return (
    <>
      <PageHeader
        subtitle={`Deposit ${lpTokenName}  Tokens to earn ${earnTokenName} Playa`}
        title={name}
      />
      <StyledLink2
        target="__blank"
        href={`${lpaddurl}`}
      >
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <Button
            text={'Click to Add Liquidity'}
          />
        </div>        
        Click Here to add liquidity to {lpTokenName}
      </StyledLink2>
      <StyledTrap>
        <StyledCardsWrapper>
          <StyledCardWrapper>
            <Harvest pid={pid}/>
          </StyledCardWrapper>
          <Spacer />
          <StyledCardWrapper>
            <Stake
              lpContract={lpContract}
              pid={pid}
              tokenName={lpToken}
            />
          </StyledCardWrapper>
        </StyledCardsWrapper>
        <Spacer size="lg" />
        <StyledInfo>
          🤖️ Every time you stake or unstake LP tokens the traphouse will
          harvest your pending DRUGS reward for you! 🤖️
        </StyledInfo>
        <Spacer size="md" />
        <StyledLink
          target="__blank"
          href={`${lppairurl}`}
        >
          {lpTokenName} Info
        </StyledLink>
      </StyledTrap>
    </>
  )
}

const StyledTrap = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`

const StyledCardsWrapper = styled.div`
  display: flex;
  width: 600px;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
`

const StyledInfo = styled.h3`
  color: ${(props) => props.theme.color.grey[400]};
  font-size: 16px;
  font-weight: 400;
  margin: 25px;
  padding: 0;
  text-align: center;
`

const StyledLink = styled.a`
  color: ${(props) => props.theme.color.grey[400]};
  padding-left: ${(props) => props.theme.spacing[3]}px;
  padding-right: ${(props) => props.theme.spacing[3]}px;
  text-decoration: none;
  &:hover {
    color: ${(props) => props.theme.color.grey[500]};
  }
`

const StyledLink2 = styled.a`
  color: ${(props) => props.theme.color.grey[400]};
  padding-left: ${(props) => props.theme.spacing[3]}px;
  padding-right: ${(props) => props.theme.spacing[3]}px;
  text-decoration: none;
  font-size: 15px;
  margin-top: -40px;
  margin-bottom: 20px;
  &:hover {
    color: ${(props) => props.theme.color.grey[500]};
  }
`

export default Trap
