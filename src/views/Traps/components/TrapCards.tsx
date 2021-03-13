import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import Countdown, { CountdownRenderProps } from 'react-countdown'
import styled, { keyframes } from 'styled-components'
import { useWallet } from 'use-wallet'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import Loader from '../../../components/Loader'
import Spacer from '../../../components/Spacer'
import { Trap } from '../../../contexts/Traps'
import useAllStakedValue, {
  StakedValue,
} from '../../../hooks/useAllStakedValue'
import useTraps from '../../../hooks/useTraps'
import useDrugs from '../../../hooks/useDrugs'
import { getEarned, getOriginalGangsterContract } from '../../../drugs/utils'
import { bnToDec } from '../../../utils'

interface TrapWithStakedValue extends Trap, StakedValue {
  apy: BigNumber
}

const TrapCards: React.FC = () => {
  const [traps] = useTraps()
  const stakedValue = useAllStakedValue()

  const drugsIndex = traps.findIndex(
    ({ tokenSymbol }) => tokenSymbol === 'DRUGS',
  )

  console.log(stakedValue);

  const drugsPrice =
    drugsIndex >= 0 && stakedValue[drugsIndex]
      ? stakedValue[drugsIndex].tokenPriceInWbnb
      : new BigNumber(0)

  const BLOCKS_PER_YEAR = new BigNumber(10513334)
  const DRUGS_PER_BLOCK = new BigNumber(7)

  const rows = traps.reduce<TrapWithStakedValue[][]>(
    (trapRows, trap, i) => {
      const trapWithStakedValue = {
        ...trap,
        ...stakedValue[i],
        apy: stakedValue[i]
          ? drugsPrice
              .times(DRUGS_PER_BLOCK)
              .times(BLOCKS_PER_YEAR)
              .times(stakedValue[i].poolWeight)
              .div(stakedValue[i].totalWbnbValue)
          : null,
      }
      const newTrapRows = [...trapRows]
      if (newTrapRows[newTrapRows.length - 1].length === 3) {
        newTrapRows.push([trapWithStakedValue])
      } else {
        newTrapRows[newTrapRows.length - 1].push(trapWithStakedValue)
      }
      return newTrapRows
    },
    [[]],
  )

  return (
    <StyledCards>
      {!!rows[0].length ? (
        rows.map((trapRow, i) => (
          <StyledRow key={i}>
            {trapRow.map((trap, j) => (
              <React.Fragment key={j}>
                <TrapCard trap={trap} />
                {(j === 0 || j === 1) && <StyledSpacer />}
              </React.Fragment>
            ))}
          </StyledRow>
        ))
      ) : (
        <StyledLoadingWrapper>
          <Loader text="Cooking the rice ..." />
        </StyledLoadingWrapper>
      )}
    </StyledCards>
  )
}

interface TrapCardProps {
  trap: TrapWithStakedValue
}

const TrapCard: React.FC<TrapCardProps> = ({ trap }) => {
  const [startTime, setStartTime] = useState(0)
  const [harvestable, setHarvestable] = useState(0)

  const { account } = useWallet()
  const { lpTokenAddress } = trap
  const drugs = useDrugs()

  const renderer = (countdownProps: CountdownRenderProps) => {
    const { hours, minutes, seconds } = countdownProps
    const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes
    const paddedHours = hours < 10 ? `0${hours}` : hours
    return (
      <span style={{ width: '100%' }}>
        {paddedHours}:{paddedMinutes}:{paddedSeconds}
      </span>
    )
  }

  useEffect(() => {
    async function fetchEarned() {
      if (drugs) return
      const earned = await getEarned(
        getOriginalGangsterContract(drugs),
        lpTokenAddress,
        account,
      )
      setHarvestable(bnToDec(earned))
    }
    if (drugs && account) {
      fetchEarned()
    }
  }, [drugs, lpTokenAddress, account, setHarvestable])

  const poolActive = true // startTime * 1000 - Date.now() <= 0

  return (
    <StyledCardWrapper>
      {trap.tokenSymbol === 'DRUGS' && <StyledCardAccent />}
      <Card>
        <CardContent>
          <StyledContent>
            <CardIcon>{trap.icon}</CardIcon>
            <StyledTitle>{trap.name}</StyledTitle>
            <StyledDetails>
              <StyledDetail>Deposit</StyledDetail>
              <StyledDetail2><b>{trap.lpToken}</b></StyledDetail2>
              <StyledDetail>Earn {trap.earnToken.toUpperCase()}</StyledDetail>
            </StyledDetails>
            <Spacer />
            <Button
              disabled={!poolActive}
              text={poolActive ? 'Select' : undefined}
              to={`/traps/${trap.id}`}
            >
              {!poolActive && (
                <Countdown
                  date={new Date(startTime * 1000)}
                  renderer={renderer}
                />
              )}
            </Button>
            <StyledInsight>
              <span>
                {trap.apy
                  ? `${trap.apy
                      .times(new BigNumber(100))
                      .times(new BigNumber(6))
                      .toNumber()
                      .toLocaleString('en-US')
                      .slice(0, -1)}%`
                  : 'Loading ...'}
              </span>
              <span>
              APY
              </span>
           </StyledInsight>
           <p>
           Total Value Locked
           </p>
           <StyledInsight>
              <span>
                {trap.tokenAmount
                  ? (trap.tokenAmount.toNumber() || 0).toLocaleString('en-US')
                  : '-'}{' '}
                {trap.tokenSymbol}
              </span>
              <span>
                {trap.wbnbAmount
                  ? (trap.wbnbAmount.toNumber() || 0).toLocaleString('en-US')
                  : '-'}{' '}{trap.tokenXSymbol}
              </span>
            </StyledInsight>
          </StyledContent>
        </CardContent>
      </Card>
    </StyledCardWrapper>
  )
}

const RainbowLight = keyframes`

	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`

const StyledCardAccent = styled.div`
  background: linear-gradient(
    45deg,
    rgba(255, 0, 0, 1) 0%,
    rgba(255, 200, 61, 1) 10%,
    rgba(255, 0, 0, 1) 20%,
    rgba(255, 200, 61, 1) 30%,
    rgba(255, 0, 0, 1) 40%,
    rgba(255, 200, 61, 1) 50%,
    rgba(255, 0, 0, 1) 60%,
    rgba(255, 200, 61, 1) 70%,
    rgba(255, 200, 61, 1) 80%,
    rgba(255, 0, 0, 1) 90%,
    rgba(255, 200, 61, 1) 100%
  );
  background-size: 300% 300%;
  animation: ${RainbowLight} 2s linear infinite;
  border-radius: 12px;
  filter: blur(6px);
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: -1;
`

const StyledCards = styled.div`
  width: 900px;
  @media (max-width: 768px) {
    width: 100%;
  }
`

const StyledLoadingWrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
`

const StyledRow = styled.div`
  display: flex;
  margin-bottom: ${(props) => props.theme.spacing[4]}px;
  flex-flow: row wrap;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`

const StyledCardWrapper = styled.div`
  display: flex;
  width: calc((900px - ${(props) => props.theme.spacing[4]}px * 2) / 3);
  position: relative;
`

const StyledTitle = styled.h4`
  color: ${(props) => props.theme.color.grey[600]};
  font-size: 24px;
  font-weight: 700;
  margin: ${(props) => props.theme.spacing[2]}px 0 0;
  padding: 0;
`

const StyledContent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`

const StyledSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`

const StyledDetails = styled.div`
  margin-top: ${(props) => props.theme.spacing[2]}px;
  text-align: center;
`

const StyledDetail = styled.div`
  color: ${(props) => props.theme.color.grey[500]};
`

const StyledDetail2 = styled.div`
  color: ${(props) => props.theme.color.grey[500]};
  font-weight: 400;
  margin-bottom: 5px;
  margin-top: 5px;
  text-align: center;
`

const StyledInsight = styled.div`
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  border-radius: 8px;
  background: #1e1e1e;
  color: #aa9584;
  width: 100%;
  margin-top: 12px;
  line-height: 32px;
  font-size: 13px;
  border: 0px solid #e6dcd5 !important;
  text-align: center;
  padding: 0 12px;
`

export default TrapCards
