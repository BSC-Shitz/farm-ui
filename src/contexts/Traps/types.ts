import { Contract } from 'web3-eth-contract'

export interface Trap {
  pid: number
  name: string
  lpToken: string
  lpTokenAddress: string
  lppairurl: string
  lpaddurl: string
  lpContract: Contract
  tokenAddress: string
  earnToken: string
  earnTokenAddress: string
  icon: React.ReactNode
  id: string
  tokenSymbol: string
}

export interface TrapsContext {
  traps: Trap[]
  unharvested: number
}
