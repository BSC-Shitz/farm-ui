import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import useDrugs from './useDrugs'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { Contract } from 'web3-eth-contract'

import { getAllowance } from '../utils/erc20'
import { getOriginalGangsterContract } from '../drugs/utils'

const useAllowance = (lpContract: Contract) => {
  const [allowance, setAllowance] = useState(new BigNumber(0))
  const { account }: { account: string; ethereum: provider } = useWallet()
  const drugs = useDrugs()
  const originalGangsterContract = getOriginalGangsterContract(drugs)

  const fetchAllowance = useCallback(async () => {
    const allowance = await getAllowance(
      lpContract,
      account,
      originalGangsterContract.options.address,
    )
    setAllowance(new BigNumber(allowance))
  }, [account, originalGangsterContract, lpContract])

  useEffect(() => {
    if (account && originalGangsterContract && lpContract) {
      fetchAllowance()
    }
    let refreshInterval = setInterval(fetchAllowance, 10000)
    return () => clearInterval(refreshInterval)
  }, [account, originalGangsterContract, lpContract])

  return allowance
}

export default useAllowance
