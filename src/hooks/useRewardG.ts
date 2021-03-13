import { useCallback } from 'react'

import useDrugs from './useDrugs'
import { useWallet } from 'use-wallet'

import { harvestG, getSmartGContract } from '../drugs/utils'

const useReward = (pid: number) => {
  const { account } = useWallet()
  const drugs = useDrugs()
  const smartGContract = getSmartGContract(drugs)

  const handleReward = useCallback(async () => {
    const txHash = await harvestG(smartGContract, account)
    console.log(txHash)
    return txHash
  }, [account, drugs])

  return { onReward: handleReward }
}

export default useReward
