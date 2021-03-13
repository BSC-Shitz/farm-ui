import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import { getEarnedG, getSmartGContract } from '../drugs/utils'
import useDrugs from './useDrugs'
import useBlock from './useBlock'

const useEarnings = (pid: number) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const {
    account,
    ethereum,
  }: { account: string; ethereum: provider } = useWallet()
  const drugs = useDrugs()
  const smartGContract = getSmartGContract(drugs)
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const balance = await getEarnedG(smartGContract, account)
    setBalance(new BigNumber(balance))
  }, [account, smartGContract, drugs])

  useEffect(() => {
    if (account && smartGContract && drugs) {
      fetchBalance()
    }
  }, [account, block, smartGContract, setBalance, drugs])

  return balance
}

export default useEarnings
