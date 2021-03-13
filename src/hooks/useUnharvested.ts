import { useContext } from 'react'
import { Context as TrapsContext } from '../contexts/Traps'

const useUnharvested = () => {
  const { unharvested } = useContext(TrapsContext)
  return unharvested
}

export default useUnharvested
