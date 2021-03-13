import BigNumber from 'bignumber.js'
import React, {useCallback, useState} from 'react'
import styled from 'styled-components'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import Label from '../../../components/Label'
import Value from '../../../components/Value'
import Value2 from '../../../components/Value2'
import useModal from '../../../hooks/useModal'
import drugslogo from '../../../assets/img/drugslogo.png'
import hoeslogo from '../../../assets/img/hoes2.png'
import gunslogo from '../../../assets/img/gunslogo.png'
import stakedhoes from '../../../assets/img/stakedhoes.png'
import useTokenBalance from '../../../hooks/useTokenBalance'
import {getBalanceNumber} from '../../../utils/formatBalance'
import DepositModal from './DepositModal'
import WithdrawModal from "./WithdrawModal";
import IconButton from '../../../components/IconButton'
import { AddIcon } from '../../../components/icons'
import {contractAddresses} from '../../../drugs/lib/constants'
import useEnter from "../../../hooks/useEnterG";
import useLeave from "../../../hooks/useLeaveG";
import useELeave from "../../../hooks/useELeaveG";
import useEarnings from '../../../hooks/useEarningsG'
import useReward from '../../../hooks/useRewardG'
import useStakedBalance from '../../../hooks/useStakedBalanceG'
import useAllowanceStaking from "../../../hooks/useAllowanceStakingG";

import useApproveStaking from "../../../hooks/useApproveStakingG";


interface StakeProps {
}

const StakeHoes: React.FC<StakeProps> = ({}) => {
  const tokenName = "HOES"
  const rewardName = "GUNS"
  const [requestedApproval, setRequestedApproval] = useState(false)

  const allowance = useAllowanceStaking()
  const {onApprove} = useApproveStaking()
  const [pendingTx, setPendingTx] = useState(false)

  const tokenBalance = useTokenBalance(contractAddresses.Hoes[97])
  const gunsBalance = useTokenBalance(contractAddresses.GunsToken[97])
  const stakedBalance = useStakedBalance(0)
  const earnings = useEarnings(0)
  const {onEnter} = useEnter()
  const {onLeave} = useLeave()
  const {onELeave} = useELeave()
  const { onReward } = useReward(0)

  const [onPresentDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      onConfirm={onEnter}
      tokenName={tokenName}
    />,
  )

  const [onPresentLeave] = useModal(
    <WithdrawModal
      max={stakedBalance}
      onConfirm={onLeave}
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
          <CardTitle>
          <Value2 value="GUNS Staking Phase 1 Has Ended"/>
          </CardTitle>
          </StyledCardHeader>
          <StyledCardHeader>
          <TokenBalances>
          The GUNS Hoes staking pool has been paused and will resume within 2 weeks.
          So it's time to unstake your HOES now playa!
          </TokenBalances>
          </StyledCardHeader>
          <StyledCardHeader>
            {<img src={stakedhoes} height={68} />}
            <TokenBalances>
            <Value2 value={getBalanceNumber(stakedBalance)} />
            HOES Staked
            </TokenBalances>
          </StyledCardHeader>
          <StyledCardActions>
            {!allowance.toNumber() ? (
              <Button
                disabled={requestedApproval}
                onClick={handleApprove}
                text={`Approve HOES`}
              />
            ) : (
              <>
            <Button
              disabled={!stakedBalance.toNumber() || pendingTx}
              size='md'
              text={pendingTx ? 'Whistling Dem Hoes Back' : 'Unstake Your HOES'}
              onClick={async () => {
                setPendingTx(true)
                await onELeave()
                setPendingTx(false)
              }}
            />
              </>
            )}
          </StyledCardActions>
                <StyledActionSpacer/>
          <StyledCardHeader>
            <CardIcon>{<img src={gunslogo} height={80} />}</CardIcon>
           <StyledLink2
             target="__blank"
             href="https://docs.thugs.fi/thugonomics/guns"
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
                 text={'GUNS Info'}
                 size='sm'
              />
             </div>
           </StyledLink2>
           </StyledCardHeader>
        </StyledCardContentInner>
      </CardContent>
    </Card>
  )
}

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  padding-left: 10px;
`
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 0px;
  width: 100%;
`

const TokenBalances = styled.div`
  justify-content: center;
  margin-top: 0px;
  padding: 15px;
  width: 100%;
  flex-direction: column;
`

const CardTitle = styled.div`
  justify-content: center;
  margin-top: -10px;
  padding-bottom: 10px;
`

const StyledLink2 = styled.a`
  color: ${(props) => props.theme.color.grey[400]};
  padding-left: ${(props) => props.theme.spacing[3]}px;
  padding-right: ${(props) => props.theme.spacing[3]}px;
  text-decoration: none;
  font-size: 15px;
  &:hover {
    color: ${(props) => props.theme.color.grey[500]};
  }
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

export default StakeHoes
