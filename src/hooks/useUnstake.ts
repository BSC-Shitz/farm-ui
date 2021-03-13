import { useCallback } from 'react'

import useDrugs from './useDrugs'
import { useWallet } from 'use-wallet'

import { unstake, getOriginalGangsterContract } from '../drugs/utils'

const useUnstake = (pid: number) => {
  const { account } = useWallet()
  const drugs = useDrugs()
  const originalGangsterContract = getOriginalGangsterContract(drugs)

  const handleUnstake = useCallback(
    async (amount: string) => {
      const txHash = await unstake(originalGangsterContract, pid, amount, account)
      console.log(txHash)
    },
    [account, pid, drugs],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstake
