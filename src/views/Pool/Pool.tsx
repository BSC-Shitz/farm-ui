import React from 'react'
import {Route, Switch, useRouteMatch} from 'react-router-dom'
import {useWallet} from 'use-wallet'

import hoesstake from '../../assets/img/header-staking.png'
import styled from 'styled-components'

import Button from '../../components/Button'
import Page from '../../components/Page'
import PageHeader from '../../components/PageHeader'
import WalletProviderModal from '../../components/WalletProviderModal'

import useModal from '../../hooks/useModal'
import PoolHoes from "../PoolHoes";

const Pool: React.FC = () => {
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
               {<img src={hoesstake} height={"50%"} width={"50%"} />}
              </StyledInfo5>
              <StyledInfo4>
               Time to put these hoes (tokens) to <b>WORK</b>! Stake your HOES here to stack
               new Tokens playa. Be sure to check out the Info link for specifics on each project/option.
              </StyledInfo4>
            </Route>
            <PoolHoes/>
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
  font-size: 16px;
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

export default Pool
