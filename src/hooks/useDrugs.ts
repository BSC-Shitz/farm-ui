import { useContext } from 'react'
import { Context } from '../contexts/DrugsProvider'

const useDrugs = () => {
  const { drugs } = useContext(Context)
  return drugs
}

export default useDrugs
