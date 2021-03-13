import {useCallback} from 'react'

import useDrugs from './useDrugs'
import {useWallet} from 'use-wallet'

import {emergencyWithdraw, getSmartGContract} from '../drugs/utils'

const useELeave = () => {
  const {account} = useWallet()
  const drugs = useDrugs()

  const handle = useCallback(
    async () => {
      const txHash = await emergencyWithdraw(
        getSmartGContract(drugs),
        account,
      )
      console.log(txHash)
    },
    [account, drugs],
  )

  return {onELeave: handle}
}

export default useELeave
