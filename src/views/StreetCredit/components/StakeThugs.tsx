import BigNumber from 'bignumber.js'
import React, {useCallback, useState, useEffect} from 'react'
import styled from 'styled-components'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import Label from '../../../components/Label'
import Value from '../../../components/Value'
import Value2 from '../../../components/Value2'
import useModal from '../../../hooks/useModal'
import drugslogo from '../../../assets/img/thugslogo.png'
import useTokenBalance from '../../../hooks/useTokenBalance'
import {getBalanceNumber} from '../../../utils/formatBalance'
import DepositModal from './DepositModal'
import {contractAddresses} from '../../../drugs/lib/constants'
import useEnterC from "../../../hooks/useEnterC";
import useLeaveC from "../../../hooks/useLeaveC";
import Spacer from '../../../components/Spacer'
import useDrugs from '../../../hooks/useDrugs'
import useAllowanceCred from "../../../hooks/useAllowanceCred";
import useApproveCred from "../../../hooks/useApproveCred";

interface StakeProps {
  currentBurn: string
}

const StakeThugs: React.FC<StakeProps> = ({currentBurn}) => {
  const tokenName = "THUGS"
  const [requestedApproval, setRequestedApproval] = useState(false)

  const allowance = useAllowanceCred()
  const {onApprove} = useApproveCred()

  const tokenBalance = useTokenBalance(contractAddresses.thugs[97])

  const {onEnter} = useEnterC()
  const {onLeave} = useLeaveC()

  const [onPresentDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      onConfirm={onEnter}
      tokenName={tokenName}
    />,
  )

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const txHash = await onApprove()
      // user rejected tx or didn't go thru
      if (!txHash) {
        setRequestedApproval(false)
      }
    } catch (e) {
      console.log(e)
    }
  }, [onApprove, setRequestedApproval])

  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
            <Spacer/>
            <CardIcon>{<img src={drugslogo} height={96} />}</CardIcon>
            <Value value={getBalanceNumber(tokenBalance)}/>
            <Label text={`THUGS Tokens Available`}/>
            <StyledValue>
            {currentBurn}%
            </StyledValue>
            <StyledInfo>
            Current Burn Rate
            </StyledInfo>
          </StyledCardHeader>
          <StyledCardActions>
            {!allowance.toNumber() ? (
              <Button
                disabled={requestedApproval}
                onClick={handleApprove}
                text={`Approve THUGS`}
              />
            ) : (
              <>
                <Button
                  disabled={tokenBalance.eq(new BigNumber(0))}
                  text="Convert to CRED"
                  onClick={onPresentDeposit}
                />
              </>
            )}
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

const StyledActionSpacer = styled.div`
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

export default StakeThugs
