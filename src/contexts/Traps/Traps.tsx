import React, { useCallback, useEffect, useState } from 'react'

import { useWallet } from 'use-wallet'
import useDrugs from '../../hooks/useDrugs'

import { bnToDec } from '../../utils'
import { getOriginalGangsterContract, getEarned } from '../../drugs/utils'
import { getTraps } from '../../drugs/utils'

import Context from './context'
import { Trap } from './types'

const Traps: React.FC = ({ children }) => {
  const [unharvested, setUnharvested] = useState(0)

  const drugs = useDrugs()
  const { account } = useWallet()

  const traps = getTraps(drugs)

  return (
    <Context.Provider
      value={{
        traps,
        unharvested,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export default Traps
