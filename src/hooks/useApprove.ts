import { useCallback } from 'react'

import useDrugs from './useDrugs'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { Contract } from 'web3-eth-contract'

import { approve, getOriginalGangsterContract } from '../drugs/utils'

const useApprove = (lpContract: Contract) => {
  const { account }: { account: string; ethereum: provider } = useWallet()
  const drugs = useDrugs()
  const originalGangsterContract = getOriginalGangsterContract(drugs)

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(lpContract, originalGangsterContract, account)
      return tx
    } catch (e) {
      return false
    }
  }, [account, lpContract, originalGangsterContract])

  return { onApprove: handleApprove }
}

export default useApprove
