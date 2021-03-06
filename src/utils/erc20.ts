import Web3 from 'web3'
import { provider } from 'web3-core'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'
import ERC20ABI from '../constants/abi/ERC20.json'
import { BigNumber } from '../drugs'

export const getContract = (provider: provider, address: string) => {
  const web3 = new Web3(provider)
  const contract = new web3.eth.Contract(
    (ERC20ABI.abi as unknown) as AbiItem,
    address,
  )
  return contract
}

export const getAllowance = async (
  contract: Contract,
  owner: string,
  spender: string,
): Promise<string> => {
  try {
    const allowance: string = await contract.methods
      .allowance(owner, spender)
      .call()
    return allowance
  } catch (e) {
    return '0'
  }
}

export const getBalance = async (
  provider: provider,
  tokenAddress: string,
  userAddress: string,
): Promise<string> => {
  const lpContract = getContract(provider, tokenAddress)
  try {
    const balance: string = await lpContract.methods
      .balanceOf(userAddress)
      .call()
    return balance
  } catch (e) {
    return '0'
  }
}

export const getDecimals = async (
  provider: provider,
  tokenAddress: string
): Promise<string> => {
  const tokenContract = getContract(provider, tokenAddress)
  try {
    const balance: string = await tokenContract.methods
      .decimals()
      .call()
    return balance
  } catch (e) {
    console.log(e)
    return '0'
  }
}
export const getTicker = async (
  provider: provider,
  tokenAddress: string
): Promise<string> => {
  const tokenContract = getContract(provider, tokenAddress)
  try {
    const name: string = await tokenContract.methods
      .symbol()
      .call()
      console.log(name)
    return name
  } catch (e) {
    console.log(e)
    return '0'
  }
}