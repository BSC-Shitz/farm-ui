import { useCallback, useEffect, useState } from 'react'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'

import useBlock from './useBlock'
import useDrugs from './useDrugs'
import {getCredThugsRatio} from '../drugs/utils'
const useCredsToThugs = (drugs : any) => {
    const [ratio, setRatio] = useState(new Number(0))
    const {
      ethereum,
    } = useWallet()
    const block = useBlock()
  
    const fetchRatio = useCallback(async () => {
      const ratio = await getCredThugsRatio(ethereum,drugs)
      setRatio(new Number(ratio))
    }, [ethereum])
  
    useEffect(() => {
      if (ethereum) {
        fetchRatio()
      }
    }, [ethereum, setRatio, block])
  
    return ratio
}
  export default useCredsToThugs
