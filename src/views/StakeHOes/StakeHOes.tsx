import React, {useEffect, useMemo, useState} from 'react'
import styled from 'styled-components'
import {useWallet} from 'use-wallet'
import {provider} from 'web3-core'
import Spacer from '../../components/Spacer'
import useDrugs from '../../hooks/useDrugs'
import {getContract} from '../../utils/erc20'
import UnstakeHOes from './components/UnstakeHOes'
import StakeDrugs from "./components/StakeDrugs";
import Harvest from '../Trap/components/Harvest'

import {contractAddresses} from '../../drugs/lib/constants'
import {getHOesSupply} from "../../drugs/utils";
import BigNumber from "bignumber.js";
import {getBalanceNumber} from "../../utils/formatBalance";

const StakeHOes: React.FC = () => {
  const {
    tokenAddress,
  } = {
    tokenAddress: contractAddresses.Hoes[97],
  }

  const [totalSupply, setTotalSupply] = useState<BigNumber>()

  const drugs = useDrugs()
  const {ethereum} = useWallet()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    async function fetchTotalSupply() {
      const supply = await getHOesSupply(drugs)
      setTotalSupply(supply)
    }
    if (drugs) {
      fetchTotalSupply()
    }
  }, [drugs, setTotalSupply])



  const lpContract = useMemo(() => {
    debugger
    return getContract(ethereum as provider, tokenAddress)
  }, [ethereum, tokenAddress])

  return (
    <>
      <StyledTrap>
        <StyledCardsWrapper>
          <StyledCardWrapper>
            <UnstakeHOes
              lpContract={lpContract}
            />
          </StyledCardWrapper>
          <Spacer/>
          <StyledCardWrapper>
          <Harvest pid={0}/>
          </StyledCardWrapper>
          <Spacer/>
          <StyledCardWrapper>
            <StakeDrugs
            />
          </StyledCardWrapper>
        </StyledCardsWrapper>
        <Spacer size="lg"/>
        <StyledCardsWrapper>
          <StyledCardWrapper>
            <StyledInfo>
              💰️ You will earn a portion of newly created DRUGS dependent on the amount
              of Hoes held relative to the weight of total staking. Hoes can be minted
              by staking Drugs. To redeem Drugs staked plus rewarded DRUGS just convert Hoes
              back to Drugs. 💰️
            </StyledInfo>
          </StyledCardWrapper>
        </StyledCardsWrapper>
        <Spacer size="lg"/>
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
  width: 800px;
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
  margin: 0;
  padding: 0;
  text-align: center;
`

export default StakeHOes
