import { useCallback } from 'react'

import useDrugs from './useDrugs'
import { useWallet } from 'use-wallet'

import { stake, getOriginalGangsterContract } from '../drugs/utils'

const useStake = (pid: number) => {
  const { account } = useWallet()
  const drugs = useDrugs()

  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await stake(
        getOriginalGangsterContract(drugs),
        pid,
        amount,
        account,
      )
      console.log(txHash)
    },
    [account, pid, drugs],
  )

  return { onStake: handleStake }
}

export default useStake
