import { useContext } from 'react'
import { Context as TrapsContext } from '../contexts/Traps'

const useTraps = () => {
  const { traps } = useContext(TrapsContext)
  return [traps]
}

export default useTraps
