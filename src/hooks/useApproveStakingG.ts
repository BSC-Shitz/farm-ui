import {useCallback} from 'react'

import useDrugs from './useDrugs'
import {useWallet} from 'use-wallet'
import {provider} from 'web3-core'
import {
  approve,
  getHOesStakingContract,
  getSmartGContract
} from '../drugs/utils'

const useApproveStaking = () => {
  const {account}: { account: string; ethereum: provider } = useWallet()
  const drugs = useDrugs()
  const lpContract = getHOesStakingContract(drugs)
  const contract = getSmartGContract(drugs)

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

export default useApproveStaking
