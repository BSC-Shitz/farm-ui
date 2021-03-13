import React, { useCallback, useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { UseWalletProvider } from 'use-wallet'
//import DisclaimerModal from './components/DisclaimerModal'
import MobileMenu from './components/MobileMenu'
import TopBar from './components/TopBar'
import TrapsProvider from './contexts/Traps'
import ModalsProvider from './contexts/Modals'
import TransactionProvider from './contexts/Transactions'
import DrugsProvider from './contexts/DrugsProvider'
import useModal from './hooks/useModal'
import theme from './theme'
import Traps from './views/Traps'
import Home from './views/Home'
import Pool from './views/Pool'
import Upgrade from './views/Upgrade'
import Staking from "./views/Staking";
import Cred from "./views/Cred";

const App: React.FC = () => {
  const [mobileMenu, setMobileMenu] = useState(false)

  const handleDismissMobileMenu = useCallback(() => {
    setMobileMenu(false)
  }, [setMobileMenu])

  const handlePresentMobileMenu = useCallback(() => {
    setMobileMenu(true)
  }, [setMobileMenu])

  return (
    <Providers>
      <Router>
        <TopBar onPresentMobileMenu={handlePresentMobileMenu} />
        <MobileMenu onDismiss={handleDismissMobileMenu} visible={mobileMenu} />
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/Upgrade">
            <Upgrade />
          </Route>
          <Route path="/traps">
            <Traps />
          </Route>
          <Route path="/staking">
            <Staking />
          </Route>
          <Route path="/pool">
            <Pool />
          </Route>
          <Route path="/cred">
            <Cred />
          </Route>
        </Switch>
      </Router>
    </Providers>
  )
}

const Providers: React.FC = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <UseWalletProvider
        chainId={97}
      >
        <DrugsProvider>
          <TransactionProvider>
            <TrapsProvider>
              <ModalsProvider>{children}</ModalsProvider>
            </TrapsProvider>
          </TransactionProvider>
        </DrugsProvider>
      </UseWalletProvider>
    </ThemeProvider>
  )
}

export default App
