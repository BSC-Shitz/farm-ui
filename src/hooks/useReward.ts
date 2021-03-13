import { useCallback } from 'react'

import useDrugs from './useDrugs'
import { useWallet } from 'use-wallet'

import { harvest, getOriginalGangsterContract } from '../drugs/utils'

const useReward = (pid: number) => {
  const { account } = useWallet()
  const drugs = useDrugs()
  const originalGangsterContract = getOriginalGangsterContract(drugs)

  const handleReward = useCallback(async () => {
    const txHash = await harvest(originalGangsterContract, pid, account)
    console.log(txHash)
    return txHash
  }, [account, pid, drugs])

  return { onReward: handleReward }
}

export default useReward
