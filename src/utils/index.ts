import { Contract } from '@ethersproject/contracts'
import { getAddress, getCreate2Address } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { pack, keccak256 } from '@ethersproject/solidity'
import { BigNumber } from '@ethersproject/bignumber'
import { abi as IUniswapV2Router02ABI } from '@venomswap/periphery/build/IUniswapV2Router02.json'
import { FACTORY_ADDRESSES, INIT_CODE_HASH, ROUTER_ADDRESSES } from '../constants'
import {
  ChainId,
  JSBI,
  Percent,
  Token,
  CurrencyAmount,
  Currency,
  DEFAULT_CURRENCIES,
  Pair,
  TokenAmount
} from '@venomswap/sdk'
import { TokenAddressMap } from '../state/lists/hooks'
import { useActiveWeb3React } from '../hooks/index'

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

const ETHERSCAN_PREFIXES: { [chainId in ChainId]: string } = {
  1: '',
  3: 'ropsten.',
  4: 'rinkeby.',
  5: 'goerli.',
  42: 'kovan.',
  56: 'bscscan.com',
  97: 'testnet.bscscan.com',
  1666600000: 'explorer.harmony.one/#',
  1666700000: 'explorer.testnet.harmony.one/#'
}

export function getEtherscanLink(
  chainId: ChainId,
  data: string,
  type: 'transaction' | 'token' | 'address' | 'block'
): string {
  let prefix = `https://${ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[1]}`
  prefix = [56, 97, 1666600000, 1666700000].includes(chainId) ? prefix : `${prefix}etherscan.io`

  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`
    }
    case 'token': {
      return `${prefix}/token/${data}`
    }
    case 'block': {
      return `${prefix}/block/${data}`
    }
    case 'address':
    default: {
      return `${prefix}/address/${data}`
    }
  }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address)
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

// add 10%
export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000))
}

// converts a basis points value to a sdk percent
export function basisPointsToPercent(num: number): Percent {
  return new Percent(JSBI.BigInt(num), JSBI.BigInt(10000))
}

export function calculateSlippageAmount(value: CurrencyAmount, slippage: number): [JSBI, JSBI] {
  if (slippage < 0 || slippage > 10000) {
    throw Error(`Unexpected slippage value: ${slippage}`)
  }
  return [
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 - slippage)), JSBI.BigInt(10000)),
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 + slippage)), JSBI.BigInt(10000))
  ]
}

// account is not optional
export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library
}

// account is optional
export function getContract(address: string, ABI: any, library: Web3Provider, account?: string): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account) as any)
}

// account is optional
export function getRouterContract(chainId: number, library: Web3Provider, account?: string): Contract {
  const convertedChainId = chainId as ChainId
  const routerAddress = (chainId && ROUTER_ADDRESSES[convertedChainId]) as string
  return getContract(routerAddress, IUniswapV2Router02ABI, library, account)
}

export function useRouterContractAddress(): string | undefined {
  const { chainId } = useActiveWeb3React()
  const routerAddress = (chainId && ROUTER_ADDRESSES[chainId]) as string
  return routerAddress
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export function isTokenOnList(defaultTokens: TokenAddressMap, currency?: Currency): boolean {
  if (currency && DEFAULT_CURRENCIES.includes(currency)) return true
  return Boolean(currency instanceof Token && defaultTokens[currency.chainId]?.[currency.address])
}

let PAIR_ADDRESS_CACHE: { [token0Address: string]: { [token1Address: string]: string } } = {}

export function getPairAddress(tokenA: Token, tokenB: Token): string {
  const tokens = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA] // does safety checks

  if (PAIR_ADDRESS_CACHE?.[tokens[0].address]?.[tokens[1].address] === undefined) {
    PAIR_ADDRESS_CACHE = {
      ...PAIR_ADDRESS_CACHE,
      [tokens[0].address]: {
        ...PAIR_ADDRESS_CACHE?.[tokens[0].address],
        [tokens[1].address]: getCreate2Address(
          FACTORY_ADDRESSES[tokenA.chainId],
          keccak256(['bytes'], [pack(['address', 'address'], [tokens[0].address, tokens[1].address])]),
          INIT_CODE_HASH
        )
      }
    }
  }

  return PAIR_ADDRESS_CACHE[tokens[0].address][tokens[1].address]
}

export function getPairInstance(tokenAmountA: TokenAmount, tokenAmountB: TokenAmount): Pair {
  const pair = new Pair(tokenAmountA, tokenAmountB)
  Object.assign(pair, {
    liquidityToken: new Token(
      tokenAmountA.token.chainId,
      getPairAddress(tokenAmountA.token, tokenAmountB.token),
      18,
      'APE-LP',
      'Apeswap LP Token'
    )
  })
  return pair
}
