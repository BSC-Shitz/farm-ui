import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'

import {
  getOriginalGangsterContract,
  getWbnbContract,
  getTraps,
  getTotalLPWbnbValue,
} from '../drugs/utils'
import useDrugs from './useDrugs'
import useBlock from './useBlock'

export interface StakedValue {
  tokenAmount: BigNumber
  wbnbAmount: BigNumber
  totalWbnbValue: BigNumber
  tokenPriceInWbnb: BigNumber
  poolWeight: BigNumber,
  tokenXSymbol: string
}

const useAllStakedValue = () => {
  const [balances, setBalance] = useState([] as Array<StakedValue>)
  const { account ,ethereum}: { account: string; ethereum: provider } = useWallet()
  const drugs = useDrugs()
  const traps = getTraps(drugs)
  const originalGangsterContract = getOriginalGangsterContract(drugs)
  const wbnbContact = getWbnbContract(drugs)
  const block = useBlock()

  const fetchAllStakedValue = useCallback(async () => {
    const balances: Array<StakedValue> = await Promise.all(
      traps.map(
        ({
          pid,
          lpContract,
          tokenContract,
        }: {
          pid: number
          lpContract: Contract
          tokenContract: Contract
        }) =>
          getTotalLPWbnbValue(
            originalGangsterContract,
            wbnbContact,
            lpContract,
            tokenContract,
            pid,
            ethereum
          ),
      ),
    )

    setBalance(balances)
  }, [account, originalGangsterContract, drugs])

  useEffect(() => {
    if (account && originalGangsterContract && drugs) {
      fetchAllStakedValue()
    }
  }, [account, block, originalGangsterContract, setBalance, drugs])

  return balances
}

export default useAllStakedValue
