import BigNumber from 'bignumber.js'
import React, {useCallback, useState} from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import Label from '../../../components/Label'
import Value from '../../../components/Value'
import useModal from '../../../hooks/useModal'
import drugslogo from '../../../assets/img/drugslogo.png'
import drugsgray from '../../../assets/img/drugsgray.png'
import useTokenBalance from '../../../hooks/useTokenBalance'
import {getBalanceNumber} from '../../../utils/formatBalance'
import DepositModal from './DepositModal'
import {contractAddresses} from '../../../drugs/lib/constants'
import useUpgrade from "../../../hooks/useUpgrade";
import useAllowanceUpgrade from "../../../hooks/useAllowanceUpgrade";

import useApproveUpgrade from "../../../hooks/useApproveUpgrade";

interface StakeProps {
}

const Upgrade: React.FC<StakeProps> = ({}) => {
  const tokenName = "DRUGSv1"
  const [requestedApproval, setRequestedApproval] = useState(false)

  const allowance = useAllowanceUpgrade()
  const {onApprove} = useApproveUpgrade()

  const tokenBalance = useTokenBalance(contractAddresses.olddrugs[97])
  const { account, ethereum }: { account: any; ethereum: any } = useWallet()

  const {onEnter} = useUpgrade()

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
            <CardIcon>{<img src={drugsgray} height={96} />}</CardIcon>
            <Value value={!!account ? getBalanceNumber(tokenBalance) : '🔒️ Locked'}/>
            <Label text={`DRUGSv1 Ready to Upgrade`}/>
          </StyledCardHeader>
          <StyledCardActions>
            {!allowance.toNumber() ? (
              <Button
                disabled={requestedApproval}
                onClick={handleApprove}
                text={`Approve DRUGSv1`}
              />
            ) : (
              <>
                <Button
                  disabled={tokenBalance.eq(new BigNumber(0))}
                  text="Upgrade to DRUGSV2"
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
  padding: 25px;
`

export default Upgrade
