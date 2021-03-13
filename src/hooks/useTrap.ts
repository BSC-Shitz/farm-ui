import { useContext } from 'react'
import { Context as TrapsContext, Trap } from '../contexts/Traps'

const useTrap = (id: string): Trap => {
  const { traps } = useContext(TrapsContext)
  const trap = traps.find((trap) => trap.id === id)
  return trap
}

export default useTrap
