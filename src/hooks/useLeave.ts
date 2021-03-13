import {useCallback} from 'react'

import useDrugs from './useDrugs'
import {useWallet} from 'use-wallet'

import {leaveStaking, getOriginalGangsterContract} from '../drugs/utils'

const useLeave = () => {
  const {account} = useWallet()
  const drugs = useDrugs()

  const handle = useCallback(
    async (amount: string) => {
      const txHash = await leaveStaking(
        getOriginalGangsterContract(drugs),
        amount,
        account,
      )
      console.log(txHash)
    },
    [account, drugs],
  )

  return {onLeave: handle}
}

export default useLeave
