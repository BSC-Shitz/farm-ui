import { createContext } from 'react'
import { TrapsContext } from './types'

const context = createContext<TrapsContext>({
  traps: [],
  unharvested: 0,
})

export default context
