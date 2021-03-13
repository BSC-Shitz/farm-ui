import {useCallback} from 'react'

import useDrugs from './useDrugs'
import {useWallet} from 'use-wallet'
import {provider} from 'web3-core'
import {
  approve,
  getoldDrugsContract,
  getOriginalGangsterContract
} from '../drugs/utils'

const useApproveUpgrade = () => {
  const {account}: { account: string; ethereum: provider } = useWallet()
  const drugs = useDrugs()
  const lpContract = getoldDrugsContract(drugs)
  const contract = getOriginalGangsterContract(drugs)

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(lpContract, contract, account)
      return tx
    } catch (e) {
      return false
    }
  }, [account, lpContract, contract])

  return {onApprove: handleApprove}
}

export default useApproveUpgrade
