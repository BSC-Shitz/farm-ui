import React, {useEffect, useMemo, useState} from 'react'
import styled from 'styled-components'
import {useWallet} from 'use-wallet'
import {provider} from 'web3-core'
import Spacer from '../../components/Spacer'
import useDrugs from '../../hooks/useDrugs'
import {getContract} from '../../utils/erc20'
import StakeHoes2 from "./components/StakeHoes2";

import {contractAddresses} from '../../drugs/lib/constants'
import {getHOesInGunsFarm} from "../../drugs/utils";
import BigNumber from "bignumber.js";
import {getBalanceNumber} from "../../utils/formatBalance";

const PoolHoes: React.FC = () => {

  const [totalSupply, setTotalSupply] = useState<BigNumber>()

  const drugs = useDrugs()
  const {ethereum} = useWallet()


  useEffect(() => {
    async function fetchTotalSupply() {
      const supply = await getHOesInGunsFarm(drugs)
      setTotalSupply(supply)
    }
    if (drugs) {
      fetchTotalSupply()
    }
  }, [drugs, setTotalSupply])


  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <StyledTrap>
        <StyledCardsWrapper>
          <Spacer/>
          <StyledCardWrapper>
            <StakeHoes2
            />
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
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  max-width: 440px;
  flex-direction: column;
  @media (max-width: 383px) {
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

export default PoolHoes
