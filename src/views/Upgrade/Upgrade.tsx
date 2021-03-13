import React from 'react'
import {Route, Switch, useRouteMatch} from 'react-router-dom'
import {useWallet} from 'use-wallet'

import upgrade from '../../assets/img/upgrade.png'
import styled from 'styled-components'

import Button from '../../components/Button'
import Page from '../../components/Page'
import PageHeader from '../../components/PageHeader'
import WalletProviderModal from '../../components/WalletProviderModal'

import useModal from '../../hooks/useModal'
import UpgradeDrugs from "../UpgradeDrugs";

const Upgrade: React.FC = () => {
  const {path} = useRouteMatch()
  const {account} = useWallet()
  const [onPresentWalletProviderModal] = useModal(<WalletProviderModal/>)
  return (
    <Switch>
      <Page>
        {!!account ? (
          <>
            <Route exact path={path}>
              <StyledInfo5>
               {<img src={upgrade} height={"66%"} width={"66%"} />}
              </StyledInfo5>
              <StyledInfo4>
               It's time elevate playas and playettes! <b>Traphouse & Drugs V2 is here</b>! Some call these Super Drugs
               or Super Hoes. One thing is for sure <b>TRAPHOUSE & HOES STAKING</b> is <b>BACK Baby!</b>
                Convert your old stale DRUGSv1 to these fresh, dank ass V2 DRUGS below and don't forget to check
               them Super Hoes!
              </StyledInfo4>
            </Route>
            <UpgradeDrugs/>
          </>
        ) : (
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <Button
              onClick={onPresentWalletProviderModal}
              text="🔓 Unlock Wallet"
            />
          </div>
        )}
      </Page>
    </Switch>
  )
}

const StyledInfo5 = styled.h3`
  color: ${(props) => props.theme.color.grey[500]};
  font-size: 32px;
  font-weight: 400;
  margin-top: 25px;
  margin-left: 50px;
  margin-right: 50px;
  padding: 0;
  text-align: center;

  > b {
    color: ${(props) => props.theme.color.grey[600]};
  }
`

const StyledInfo4 = styled.h3`
  color: ${(props) => props.theme.color.grey[500]};
  font-size: 18px;
  font-weight: 400;
  margin-left: 20%;
  margin-right: 20%;
  margin-top: -20px;
  padding: 0;
  text-align: center;

  > b {
    color: ${(props) => props.theme.color.grey[600]};
  }
`

export default Upgrade
