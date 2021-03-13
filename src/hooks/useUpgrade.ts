import {useCallback} from 'react'

import useDrugs from './useDrugs'
import {useWallet} from 'use-wallet'

import {enterUpgrade, getOriginalGangsterContract} from '../drugs/utils'

const useUpgrade = () => {
  const {account} = useWallet()
  const drugs = useDrugs()

  const handle = useCallback(
    async (amount: string) => {
      const txHash = await enterUpgrade(
        getOriginalGangsterContract(drugs),
        amount,
        account,
      )
      console.log(txHash)
    },
    [account, drugs],
  )

  return {onEnter: handle}
}

export default useUpgrade
