import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { getNameOfDeclaration } from 'typescript'
import { web3 } from 'web3'

import { getBalance ,getDecimals, getTicker} from '../utils/erc20'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const GAS_LIMIT = {
  STAKING: {
    DEFAULT: 200000,
    SNX: 850000,
  },
}

export const getOriginalGangsterAddress = (drugs) => {
  return drugs && drugs.originalGangsterAddress
}
export const getDrugsAddress = (drugs) => {
  return drugs && drugs.drugsAddress
}
export const getThugsContract = (drugs) => {
  return drugs && drugs.contracts && drugs.contracts.thugs
}
export const getcredAddress = (drugs) => {
  return drugs && drugs.credAddress
}
export const getWbnbContract = (drugs) => {
  return drugs && drugs.contracts && drugs.contracts.wbnb
}
export const getSmartGContract = (drugs) => {
  return drugs && drugs.contracts && drugs.contracts.smartG
}
export const getCredContract = (drugs) => {
  return drugs && drugs.contracts && drugs.contracts.cred
}
export const getOriginalGangsterContract = (drugs) => {
  return drugs && drugs.contracts && drugs.contracts.originalGangster
}
export const getDrugsContract = (drugs) => {
  return drugs && drugs.contracts && drugs.contracts.drugs
}
export const getoldDrugsContract = (drugs) => {
  return drugs && drugs.contracts && drugs.contracts.olddrugs
}
export const getHOesStakingContract = (drugs) => {
  return drugs && drugs.contracts && drugs.contracts.HoesStaking
}

export const getTraps = (drugs) => {
  return drugs
    ? drugs.contracts.pools.map(
        ({
          pid,
          name,
          symbol,
          icon,
          tokenAddress,
          tokenSymbol,
          tokenContract,
          lpAddress,
          lpContract,
          lppairurl,
          lpaddurl,
        }) => ({
          pid,
          id: symbol,
          name,
          lpToken: symbol,
          lpTokenAddress: lpAddress,
          lpContract,
          tokenAddress,
          tokenSymbol,
          tokenContract,
          earnToken: 'drugs',
          earnTokenAddress: drugs.contracts.drugs.options.address,
          icon,
          lppairurl,
          lpaddurl,
        }),
      )
    : []
}

export const getPoolWeight = async (originalGangsterContract, pid) => {
  const { allocPoint } = await originalGangsterContract.methods.poolInfo(pid).call()
  const totalAllocPoint = await originalGangsterContract.methods
    .totalAllocPoint()
    .call()
  return new BigNumber(allocPoint).div(new BigNumber(totalAllocPoint))
}

export const getEarned = async (originalGangsterContract, pid, account) => {
  return originalGangsterContract.methods.pendingDrugs(pid, account).call()
}

export const getEarnedG = async (smartGContract, account) => {
  return smartGContract.methods.pendingReward(account).call()
}

export const getTotalLPWbnbValue = async (
  originalGangsterContract,
  wbnbContract,
  lpContract,
  tokenContract,
  pid,
  ethereum
) => {
  // Get balance of the token address
  const tokenAmountWholeLP = await tokenContract.methods
    .balanceOf(lpContract.options.address)
    .call()
  const tokenDecimals = await tokenContract.methods.decimals().call()

  // Get the share of lpContract that originalGangsterContract owns
  const balance = await lpContract.methods
    .balanceOf(originalGangsterContract.options.address)
    .call()
  // Convert that into the portion of total lpContract = p1
  const totalSupply = await lpContract.methods.totalSupply().call()
  // Get total wbnb value for the lpContract = w1
  //Here we change it to get token1 balance
  let tokenX = await lpContract.methods.token0().call()
  const tokenXIsBNB = tokenX === wbnbContract.options.address;
  if(!tokenXIsBNB)
    tokenX = await lpContract.methods.token1().call()
  let lpContractTokenX = await getBalance(ethereum,tokenX,lpContract.options.address)
  const tokenXDecimals = await getDecimals(ethereum,tokenX)
  let tokenXSymbol = await getTicker(ethereum,tokenX)
  if(tokenXSymbol === "WBNB")
    tokenXSymbol = "BNB"
  // Return p1 * w1 * 2
  const portionLp = new BigNumber(balance).div(new BigNumber(totalSupply))
  const lpWbnbWorth = new BigNumber(lpContractTokenX)
  const totalLpWbnbValue = portionLp.times(lpWbnbWorth).times(new BigNumber(2))
  // Calculate
  const tokenAmount = new BigNumber(tokenAmountWholeLP)
    .times(portionLp)
    .div(new BigNumber(10).pow(tokenDecimals))

  const wbnbAmount = new BigNumber(lpContractTokenX)
    .times(portionLp)
    .div(new BigNumber(10).pow(tokenXDecimals))
  return {
    tokenAmount,
    wbnbAmount,
    totalWbnbValue: totalLpWbnbValue.div(new BigNumber(10).pow(18)),
    tokenPriceInWbnb: wbnbAmount.div(tokenAmount),
    poolWeight: await getPoolWeight(originalGangsterContract, pid),
    tokenXSymbol,
  }
}

export const approve = async (lpContract, originalGangsterContract, account) => {
  return lpContract.methods
    .approve(originalGangsterContract.options.address, ethers.constants.MaxUint256)
    .send({ from: account })
}

export const approveAddress = async (lpContract, address, account) => {
  return lpContract.methods
      .approve(address, ethers.constants.MaxUint256)
      .send({ from: account })
}

export const getDrugsSupply = async (drugs) => {
  return new BigNumber(await drugs.contracts.drugs.methods.totalSupply().call())
}

export const getHOesSupply = async (drugs) => {
  return new BigNumber(await drugs.contracts.HoesStaking.methods.totalSupply().call())
}

export const getBurnRate = async (drugs) => {
  const rate = await drugs.contracts.cred.methods.CurrentBurnRate().call()
  const scalefactor = 1e9
  const burnrate = rate / scalefactor
  return burnrate.toFixed(3)
}

export const getCredSupply = async (drugs) => {
  return new BigNumber(await drugs.contracts.cred.methods.totalSupply().call())
}

export const getThugsInCredFarm = async (drugs) => {
  return new BigNumber(await drugs.contracts.cred.methods.balanceOf( drugs && drugs.thugsAddress).call())
}

export const getThugsCredRatio = async (ethereum,drugs) => {
  // const ThugsInCred = new BigNumber(await drugs.contracts.
  const thugsincred = await getBalance(ethereum,drugs.thugsAddress,drugs.credAddress);
  const credsupply  = await drugs.contracts.cred.methods.totalSupply().call();
  return credsupply / thugsincred
  // return new BigNumber(await drugs.contracts.cred.methods.balanceOf( drugs && drugs.thugsAddress).call()) / new BigNumber(await drugs.contracts.cred.methods.totalSupply().call())
}

export const getCredThugsRatio = async (ethereum,drugs) => {
  // const ThugsInCred = new BigNumber(await drugs.contracts.
  const thugsincred = await getBalance(ethereum,drugs.thugsAddress,drugs.credAddress);
  const credsupply  = await drugs.contracts.cred.methods.totalSupply().call();
  return thugsincred / credsupply 
  // return new BigNumber(await drugs.contracts.cred.methods.balanceOf( drugs && drugs.thugsAddress).call()) / new BigNumber(await drugs.contracts.cred.methods.totalSupply().call())
}
export const getHOesInGunsFarm = async (drugs) => {
  return new BigNumber(await drugs.contracts.HoesStaking.methods.balanceOf( drugs && drugs.gunsStakerAddress).call())
}

export const stake = async (originalGangsterContract, pid, amount, account) => {
  return originalGangsterContract.methods
    .deposit(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}

export const unstake = async (originalGangsterContract, pid, amount, account) => {
  return originalGangsterContract.methods
    .withdraw(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}
export const harvest = async (originalGangsterContract, pid, account) => {
  return originalGangsterContract.methods
    .deposit(pid, '0')
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}

export const harvestG = async (smartGContract, account) => {
  return smartGContract.methods
    .deposit('0')
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}

export const getStaked = async (originalGangsterContract, pid, account) => {
  try {
    const { amount } = await originalGangsterContract.methods
      .userInfo(pid, account)
      .call()
    return new BigNumber(amount)
  } catch {
    return new BigNumber(0)
  }
}

export const getStakedG = async (smartGContract, account) => {
  try {
    const { amount } = await smartGContract.methods
      .userInfo(account)
      .call()
    return new BigNumber(amount)
  } catch {
    return new BigNumber(0)
  }
}

export const redeem = async (originalGangsterContract, account) => {
  let now = new Date().getTime() / 1000
  if (now >= 1597172400) {
    return originalGangsterContract.methods
      .exit()
      .send({ from: account })
      .on('transactionHash', (tx) => {
        console.log(tx)
        return tx.transactionHash
      })
  } else {
    alert('pool not active')
  }
}

export const enterStaking = async (originalGangsterContract, amount, account) => {
  debugger
  return originalGangsterContract.methods
      .enterStaking(
          new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
      )
      .send({ from: account })
      .on('transactionHash', (tx) => {
        console.log(tx)
        return tx.transactionHash
      })
}

export const leaveStaking = async (originalGangsterContract, amount, account) => {
  return originalGangsterContract.methods
      .leaveStaking(
          new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
      )
      .send({ from: account })
      .on('transactionHash', (tx) => {
        console.log(tx)
        return tx.transactionHash
      })
}

export const enterCred = async (credContract, amount, account) => {
  return credContract.methods
      .enter(
          new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
      )
      .send({ from: account })
      .on('transactionHash', (tx) => {
        console.log(tx)
        return tx.transactionHash
      })
}

export const leaveCred = async (credContract, amount, account) => {
  return credContract.methods
      .leave(
          new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
      )
      .send({ from: account })
      .on('transactionHash', (tx) => {
        console.log(tx)
        return tx.transactionHash
      })
}

export const depositG = async (smartGContract, amount, account) => {
  debugger
  return smartGContract.methods
      .deposit(
          new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
      )
      .send({ from: account })
      .on('transactionHash', (tx) => {
        console.log(tx)
        return tx.transactionHash
      })
}

export const withdrawG = async (smartGContract, amount, account) => {
  return smartGContract.methods
      .withdraw(
          new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
      )
      .send({ from: account })
      .on('transactionHash', (tx) => {
        console.log(tx)
        return tx.transactionHash
      })
}

export const emergencyWithdraw = async (smartGContract, account) => {
  return smartGContract.methods
      .emergencyWithdraw()
      .send({ from: account })
      .on('transactionHash', (tx) => {
        console.log(tx)
        return tx.transactionHash
      })
}

export const enterUpgrade = async (originalGangsterContract, amount, account) => {
  debugger
  return originalGangsterContract.methods
      .upgradeDrugs(
          new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
      )
      .send({ from: account })
      .on('transactionHash', (tx) => {
        console.log(tx)
        return tx.transactionHash
      })
}
