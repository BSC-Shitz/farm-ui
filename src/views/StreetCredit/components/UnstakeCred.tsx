import React, {useState} from 'react'
import styled from 'styled-components'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import Label from '../../../components/Label'
import Value from '../../../components/Value'
import Value2 from '../../../components/Value2'
import useReward from '../../../hooks/useReward'
import {getBalanceNumber} from '../../../utils/formatBalance'
import useTokenBalance from "../../../hooks/useTokenBalance";
import useDrugs from '../../../hooks/useDrugs'
import Spacer from '../../../components/Spacer'

import {Contract} from "web3-eth-contract";
import useModal from "../../../hooks/useModal";
import WithdrawModal from "./WithdrawModal";
import useLeaveC from "../../../hooks/useLeaveC";
import credlogo from '../../../assets/img/cred.png'

interface HarvestProps {
  lpContract: Contract,
  ratiotoThugs : Number,
}

const UnstakeCred: React.FC<HarvestProps> = ({lpContract,ratiotoThugs}) => {

  const credBalance = useTokenBalance(lpContract.options.address)
  const [pendingTx, setPendingTx] = useState(false)

  const {onLeave} = useLeaveC()

  const tokenName = "CRED"

  const [onPresentLeave] = useModal(
    <WithdrawModal
      max={credBalance}
      onConfirm={onLeave}
      tokenName={tokenName}
    />,
  )

  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
            <Spacer/>
            <CardIcon>{<img src={credlogo} height={96} />}</CardIcon>
            <Value value={getBalanceNumber(credBalance)}/>
            <Label text="CRED Available"/>
            <StyledValue>
            {(getBalanceNumber(credBalance) * Number(ratiotoThugs)).toFixed(3)} THUGS
            </StyledValue>
            <StyledInfo>
            Approx Thugs Value
            </StyledInfo>
          </StyledCardHeader>
          <StyledCardActions>
            <Button
              disabled={!credBalance.toNumber() || pendingTx}
              text={pendingTx ? 'Converting to THUGS' : 'Convert to THUGS'}
              onClick={async () => {
                setPendingTx(true)
                await onPresentLeave()
                setPendingTx(false)
              }}
            />
          </StyledCardActions>
        </StyledCardContentInner>
      </CardContent>
    </Card>
  )
}

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.theme.spacing[6]}px;
  width: 100%;
`

const StyledSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`

const StyledInfo = styled.h3`
  color: ${(props) => props.theme.color.grey[400]};
  font-size: 13px;
  font-weight: 400;
  margin: 0;
  padding: 0;
  text-align: center;
`


const StyledValue = styled.div`
  font-family: 'Roboto Mono', monospace;
  color: ${(props) => props.theme.color.grey[600]};
  font-size: 20px;
  font-weight: 700;
`

export default UnstakeCred
