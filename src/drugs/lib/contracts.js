import BigNumber from 'bignumber.js/bignumber'
import ERC20Abi from './abi/erc20.json'
import OriginalGangsterAbi from './abi/originalgangster.json'
import SmartGAbi from './abi/smartgangster.json'
import HOesAbi from './abi/hoes.json'
import DrugsAbi from './abi/drugs.json'
import UNIV2PairAbi from './abi/uni_v2_lp.json'
import WBNBAbi from './abi/wbnb.json'
import credAbi from './abi/StreetCred.json'
import {
  contractAddresses,
  SUBTRACT_GAS_LIMIT,
  supportedPools
} from './constants.js'
import * as Types from './types.js'

export class Contracts {
  constructor(provider, networkId, web3, options) {
    this.web3 = web3
    this.defaultConfirmations = options.defaultConfirmations
    this.autoGasMultiplier = options.autoGasMultiplier || 1.5
    this.confirmationType =
      options.confirmationType || Types.ConfirmationType.Confirmed
    this.defaultGas = options.defaultGas
    this.defaultGasPrice = options.defaultGasPrice

    this.drugs = new this.web3.eth.Contract(DrugsAbi)
    this.originalGangster = new this.web3.eth.Contract(OriginalGangsterAbi)
    this.smartG = new this.web3.eth.Contract(SmartGAbi)
    this.cred = new this.web3.eth.Contract(credAbi)
    this.HoesStaking = new this.web3.eth.Contract(HOesAbi)
    this.wbnb = new this.web3.eth.Contract(WBNBAbi)
    this.thugs = new this.web3.eth.Contract(ERC20Abi)
    this.olddrugs = new this.web3.eth.Contract(ERC20Abi)

    this.pools = supportedPools.map((pool) =>
      Object.assign(pool, {
        lpAddress: pool.lpAddresses[networkId],
        tokenAddress: pool.tokenAddresses[networkId],
        lpContract: new this.web3.eth.Contract(UNIV2PairAbi),
        tokenContract: new this.web3.eth.Contract(ERC20Abi),
      }),
    )

    this.setProvider(provider, networkId)
    this.setDefaultAccount(this.web3.eth.defaultAccount)
  }

  setProvider(provider, networkId) {
    const setProvider = (contract, address) => {
      contract.setProvider(provider)
      if (address) contract.options.address = address
      else console.error('Contract address not found in network', networkId)
    }

    setProvider(this.drugs, contractAddresses.drugs[networkId])
    setProvider(this.originalGangster, contractAddresses.originalGangster[networkId])
    setProvider(this.cred, contractAddresses.cred[networkId])
    setProvider(this.HoesStaking, contractAddresses.Hoes[networkId])
    setProvider(this.wbnb, contractAddresses.wbnb[networkId])
    setProvider(this.thugs, contractAddresses.thugs[networkId])
    setProvider(this.olddrugs, contractAddresses.olddrugs[networkId])
    
    this.smartG.options.address = '0xf499d79Ac73569220c91F4bd016f328e40F983F2';
 //   this.drugs.options.address = '0xfD26889cd6454D8751562f1c0FcF88b18B46F7B7';
 //   this.originalGangster.options.address = '0xb752f0cB591Ecfb1c5058a93e1332F066bf38473';

    this.pools.forEach(
      ({ lpContract, lpAddress, tokenContract, tokenAddress }) => {
        setProvider(lpContract, lpAddress)
        setProvider(tokenContract, tokenAddress)
        // setProvider(token0Contract,token0)
      },
    )
  }

  setDefaultAccount(account) {
    this.drugs.options.from = account
    this.originalGangster.options.from = account
    this.smartG.options.from = account
    this.cred.options.from = account
    this.HoesStaking.options.from = account
    this.thugs.options.from = account
    this.olddrugs.options.from = account
  }

  async callContractFunction(method, options) {
    const {
      confirmations,
      confirmationType,
      autoGasMultiplier,
      ...txOptions
    } = options

    if (!this.blockGasLimit) {
      await this.setGasLimit()
    }

    if (!txOptions.gasPrice && this.defaultGasPrice) {
      txOptions.gasPrice = this.defaultGasPrice
    }

    if (confirmationType === Types.ConfirmationType.Simulate || !options.gas) {
      let gasEstimate
      if (
        this.defaultGas &&
        confirmationType !== Types.ConfirmationType.Simulate
      ) {
        txOptions.gas = this.defaultGas
      } else {
        try {
          console.log('estimating gas')
          gasEstimate = await method.estimateGas(txOptions)
        } catch (error) {
          const data = method.encodeABI()
          const { from, value } = options
          const to = method._parent._address
          error.transactionData = { from, value, data, to }
          throw error
        }

        const multiplier = autoGasMultiplier || this.autoGasMultiplier
        const totalGas = Math.floor(gasEstimate * multiplier)
        txOptions.gas =
          totalGas < this.blockGasLimit ? totalGas : this.blockGasLimit
      }

      if (confirmationType === Types.ConfirmationType.Simulate) {
        let g = txOptions.gas
        return { gasEstimate, g }
      }
    }

    if (txOptions.value) {
      txOptions.value = new BigNumber(txOptions.value).toFixed(0)
    } else {
      txOptions.value = '0'
    }

    const promi = method.send(txOptions)

    const OUTCOMES = {
      INITIAL: 0,
      RESOLVED: 1,
      REJECTED: 2,
    }

    let hashOutcome = OUTCOMES.INITIAL
    let confirmationOutcome = OUTCOMES.INITIAL

    const t =
      confirmationType !== undefined ? confirmationType : this.confirmationType

    if (!Object.values(Types.ConfirmationType).includes(t)) {
      throw new Error(`Invalid confirmation type: ${t}`)
    }

    let hashPromise
    let confirmationPromise

    if (
      t === Types.ConfirmationType.Hash ||
      t === Types.ConfirmationType.Both
    ) {
      hashPromise = new Promise((resolve, reject) => {
        promi.on('error', (error) => {
          if (hashOutcome === OUTCOMES.INITIAL) {
            hashOutcome = OUTCOMES.REJECTED
            reject(error)
            const anyPromi = promi
            anyPromi.off()
          }
        })

        promi.on('transactionHash', (txHash) => {
          if (hashOutcome === OUTCOMES.INITIAL) {
            hashOutcome = OUTCOMES.RESOLVED
            resolve(txHash)
            if (t !== Types.ConfirmationType.Both) {
              const anyPromi = promi
              anyPromi.off()
            }
          }
        })
      })
    }

    if (
      t === Types.ConfirmationType.Confirmed ||
      t === Types.ConfirmationType.Both
    ) {
      confirmationPromise = new Promise((resolve, reject) => {
        promi.on('error', (error) => {
          if (
            (t === Types.ConfirmationType.Confirmed ||
              hashOutcome === OUTCOMES.RESOLVED) &&
            confirmationOutcome === OUTCOMES.INITIAL
          ) {
            confirmationOutcome = OUTCOMES.REJECTED
            reject(error)
            const anyPromi = promi
            anyPromi.off()
          }
        })

        const desiredConf = confirmations || this.defaultConfirmations
        if (desiredConf) {
          promi.on('confirmation', (confNumber, receipt) => {
            if (confNumber >= desiredConf) {
              if (confirmationOutcome === OUTCOMES.INITIAL) {
                confirmationOutcome = OUTCOMES.RESOLVED
                resolve(receipt)
                const anyPromi = promi
                anyPromi.off()
              }
            }
          })
        } else {
          promi.on('receipt', (receipt) => {
            confirmationOutcome = OUTCOMES.RESOLVED
            resolve(receipt)
            const anyPromi = promi
            anyPromi.off()
          })
        }
      })
    }

    if (t === Types.ConfirmationType.Hash) {
      const transactionHash = await hashPromise
      if (this.notifier) {
        this.notifier.hash(transactionHash)
      }
      return { transactionHash }
    }

    if (t === Types.ConfirmationType.Confirmed) {
      return confirmationPromise
    }

    const transactionHash = await hashPromise
    if (this.notifier) {
      this.notifier.hash(transactionHash)
    }
    return {
      transactionHash,
      confirmation: confirmationPromise,
    }
  }

  async callConstantContractFunction(method, options) {
    const m2 = method
    const { blockNumber, ...txOptions } = options
    return m2.call(txOptions, blockNumber)
  }

  async setGasLimit() {
    const block = await this.web3.eth.getBlock('latest')
    this.blockGasLimit = block.gasLimit - SUBTRACT_GAS_LIMIT
  }
}
