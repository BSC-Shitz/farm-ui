import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import { getStaked, getOriginalGangsterContract } from '../drugs/utils'
import useDrugs from './useDrugs'
import useBlock from './useBlock'

const useStakedBalance = (pid: number) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account }: { account: string } = useWallet()
  const drugs = useDrugs()
  const originalGangsterContract = getOriginalGangsterContract(drugs)
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const balance = await getStaked(originalGangsterContract, pid, account)
    setBalance(new BigNumber(balance))
  }, [account, pid, drugs])

  useEffect(() => {
    if (account && drugs) {
      fetchBalance()
    }
  }, [account, pid, setBalance, block, drugs])

  return balance
}

export default useStakedBalance
