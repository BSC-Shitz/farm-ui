import { useCallback } from 'react'

import useDrugs from './useDrugs'
import { useWallet } from 'use-wallet'

import { leaveStaking, getOriginalGangsterContract } from '../drugs/utils'

const useStakeReward = (pid: number) => {
  const { account } = useWallet()
  const drugs = useDrugs()
  const originalGangsterContract = getOriginalGangsterContract(drugs)

  const handleReward = useCallback(async () => {
    const txHash = await leaveStaking(originalGangsterContract, pid, account)
    console.log(txHash)
    return txHash
  }, [account, pid, drugs])

  return { onStakeReward: handleReward }
}


export default useStakeReward
