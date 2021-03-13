import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import { getStakedG, getSmartGContract } from '../drugs/utils'
import useDrugs from './useDrugs'
import useBlock from './useBlock'

const useStakedBalance = (pid: number) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account }: { account: string } = useWallet()
  const drugs = useDrugs()
  const smartGContract = getSmartGContract(drugs)
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const balance = await getStakedG(smartGContract, account)
    setBalance(new BigNumber(balance))
  }, [account, drugs])

  useEffect(() => {
    if (account && drugs) {
      fetchBalance()
    }
  }, [account, pid, setBalance, block, drugs])

  return balance
}

export default useStakedBalance
