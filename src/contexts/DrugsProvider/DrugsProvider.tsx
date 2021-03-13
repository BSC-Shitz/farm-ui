import React, { createContext, useEffect, useState } from 'react'

import { useWallet } from 'use-wallet'

import { Drugs } from '../../drugs'

export interface DrugsContext {
  drugs?: typeof Drugs
}

export const Context = createContext<DrugsContext>({
  drugs: undefined,
})

declare global {
  interface Window {
    drugssauce: any
  }
}

const DrugsProvider: React.FC = ({ children }) => {
  const { ethereum }: { ethereum: any } = useWallet()
  const [drugs, setDrugs] = useState<any>()

  // @ts-ignore
  window.drugs = drugs
  // @ts-ignore


  useEffect(() => {
    if (ethereum) {
      const chainId = Number(ethereum.chainId)
      const drugsLib = new Drugs(ethereum, chainId, false, {
        defaultAccount: ethereum.selectedAddress,
        defaultConfirmations: 1,
        autoGasMultiplier: 1.5,
        testing: false,
        defaultGas: '6000000',
        defaultGasPrice: '1000000000000',
        accounts: [],
        ethereumNodeTimeout: 10000,
      })
      setDrugs(drugsLib)
      window.drugssauce = drugsLib
    }
  }, [ethereum])

  return <Context.Provider value={{ drugs }}>{children}</Context.Provider>
}

export default DrugsProvider
