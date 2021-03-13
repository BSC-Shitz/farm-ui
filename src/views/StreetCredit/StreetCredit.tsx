import React, {useEffect, useMemo, useState} from 'react'
import styled from 'styled-components'
import {useWallet} from 'use-wallet'
import {provider} from 'web3-core'
import Spacer from '../../components/Spacer'
import useDrugs from '../../hooks/useDrugs'
import {getContract} from '../../utils/erc20'
import UnstakeCred from './components/UnstakeCred'
import StakeThugs from "./components/StakeThugs";

import {contractAddresses} from '../../drugs/lib/constants'
import {getCredSupply,getThugsCredRatio,getCredThugsRatio,getBurnRate} from "../../drugs/utils";
import BigNumber from "bignumber.js";
import {getBalanceNumber} from "../../utils/formatBalance";

const StakeCred: React.FC = () => {
  const {
    tokenAddress,
  } = {
    tokenAddress: contractAddresses.cred[97],
  }

  const [totalSupply, setTotalSupply] = useState<BigNumber>()
  const [thugscredRatio, sethugscredRatio] = useState<Number>()
  const [credthugsRatio, setcredThugsRatio] = useState<Number>()
  const [CurrentBurnRate, setCurrentBurnRate] = useState<string>()

  const thugs = useDrugs()
  const {ethereum} = useWallet()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    async function fetchTotalSupply() {
      const supply = await getCredSupply(thugs)
      const ratio = await getThugsCredRatio(ethereum,thugs)
      const ratio2 = await getCredThugsRatio(ethereum,thugs)
      const rate = await getBurnRate(thugs)

      setCurrentBurnRate(rate)
      setTotalSupply(supply)
      sethugscredRatio(ratio);
      setcredThugsRatio(ratio2)
    }
    if (thugs) {
      fetchTotalSupply()
    }
  }, [thugs, setTotalSupply])



  const lpContract = useMemo(() => {
    debugger
    return getContract(ethereum as provider, tokenAddress)
  }, [ethereum, tokenAddress])

  return (
    <>
      <StyledTrap>
        <StyledCardsWrapper>
          <StyledCardWrapper>
            <UnstakeCred
              lpContract={lpContract}
              ratiotoThugs={credthugsRatio}
            />
          </StyledCardWrapper>
          <Spacer/>
          <Spacer/>
          <StyledCardWrapper>
            <StakeThugs
              currentBurn={CurrentBurnRate}
            />
          </StyledCardWrapper>
        </StyledCardsWrapper>
        <Spacer size="lg"/>
        <StyledCardsWrapper>
          <StyledCardWrapper>
            <StyledInfo>
              The longer you stake your THUGS into CRED the more THUGS you will earn from Exchange Fee Buy-Backs. 
              Buy-Backs are initiated consistently based on the amount of fees accumulated from StreetSwap. No 
              Exchange Fees are kept by the THUGS & StreetSwap team. 0.3% goes to LPs (more than any other BSC AMM)
              while 0.1% are used for THUGS Buy-Backs and rewarded to CRED holders. To receive your additional THUGS just
              convert back to THUGS from CRED. Remember there is ALWAYS burn when you convert to CRED so it's most profitable
              to leave the majority of your balance staking so that you don't have to suffer burn on re-entrance.
            </StyledInfo>
          </StyledCardWrapper>
        </StyledCardsWrapper>
        <StyledCardWrapper>
            <StyledInfo>
          {"1 CRED = "}{Number(credthugsRatio).toFixed(4)}{" THUGS"}
          <br></br>
          {"BURN = "}{CurrentBurnRate}{" %"}
            </StyledInfo>
          </StyledCardWrapper>
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

export default StakeCred
