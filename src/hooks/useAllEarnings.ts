import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import { getEarned, getOriginalGangsterContract, getTraps } from '../drugs/utils'
import useDrugs from './useDrugs'
import useBlock from './useBlock'

const useAllEarnings = () => {
  const [balances, setBalance] = useState([] as Array<BigNumber>)
  const { account }: { account: string; ethereum: provider } = useWallet()
  const drugs = useDrugs()
  const traps = getTraps(drugs)
  const originalGangsterContract = getOriginalGangsterContract(drugs)
  const block = useBlock()

  const fetchAllBalances = useCallback(async () => {
    const balances: Array<BigNumber> = await Promise.all(
      traps.map(({ pid }: { pid: number }) =>
        getEarned(originalGangsterContract, pid, account),
      ),
    )
    setBalance(balances)
  }, [account, originalGangsterContract, drugs])

  useEffect(() => {
    if (account && originalGangsterContract && drugs) {
      fetchAllBalances()
    }
  }, [account, block, originalGangsterContract, setBalance, drugs])

  return balances
}

export default useAllEarnings
