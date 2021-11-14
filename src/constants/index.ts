import { BigNumber } from '@ethersproject/bignumber'
import { ChainId, JSBI, Percent, Token, WETH } from '@venomswap/sdk'
import { AbstractConnector } from '@web3-react/abstract-connector'

import { fortmatic, injected, portis, walletconnect, walletlink } from '../connectors'

import getTokenWithDefault from '../utils/getTokenWithDefault'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const ZERO_ONE_ADDRESS = '0x0000000000000000000000000000000000000001'

export const LUQIDITY_ADD_URI = 'https://pancakeswap.finance/liquidity'

export const ROUTER_ADDRESSES: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: ZERO_ONE_ADDRESS,
  [ChainId.ROPSTEN]: ZERO_ONE_ADDRESS,
  [ChainId.RINKEBY]: ZERO_ONE_ADDRESS,
  [ChainId.GÖRLI]: ZERO_ONE_ADDRESS,
  [ChainId.KOVAN]: ZERO_ONE_ADDRESS,
  [ChainId.BSC_MAINNET]: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
  [ChainId.BSC_TESTNET]: '0xD99D1c33F9fC3444f8101754aBC46c52416550D1',
  [ChainId.HARMONY_MAINNET]: '0xD99D1c33F9fC3444f8101754aBC46c52416550D1',
  [ChainId.HARMONY_TESTNET]: '0xD99D1c33F9fC3444f8101754aBC46c52416550D1'
}

export const FACTORY_ADDRESSES: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: ZERO_ONE_ADDRESS,
  [ChainId.ROPSTEN]: ZERO_ONE_ADDRESS,
  [ChainId.RINKEBY]: ZERO_ONE_ADDRESS,
  [ChainId.GÖRLI]: ZERO_ONE_ADDRESS,
  [ChainId.KOVAN]: ZERO_ONE_ADDRESS,
  [ChainId.BSC_MAINNET]: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
  [ChainId.BSC_TESTNET]: '0x6725F303b657a9451d8BA641348b6761A6CC7a17',
  [ChainId.HARMONY_MAINNET]: '0x6725F303b657a9451d8BA641348b6761A6CC7a17',
  [ChainId.HARMONY_TESTNET]: '0x6725F303b657a9451d8BA641348b6761A6CC7a17'
}

export const INIT_CODE_HASH: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: ZERO_ONE_ADDRESS,
  [ChainId.ROPSTEN]: ZERO_ONE_ADDRESS,
  [ChainId.RINKEBY]: ZERO_ONE_ADDRESS,
  [ChainId.GÖRLI]: ZERO_ONE_ADDRESS,
  [ChainId.KOVAN]: ZERO_ONE_ADDRESS,
  [ChainId.BSC_MAINNET]: '0x00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5',
  [ChainId.BSC_TESTNET]: '0xd0d4c4cd0848c93cb4fd1f498d7013ee6bfb25783ea21593d5834f5d250ece66',
  [ChainId.HARMONY_MAINNET]: ZERO_ONE_ADDRESS,
  [ChainId.HARMONY_TESTNET]: ZERO_ONE_ADDRESS
}

export const GOVERNANCE_ADDRESS = '0x5e4be8Bc9637f0EAA1A755019e06A68ce081D58F'

export const TIMELOCK_ADDRESS = '0x1a9C8182C09F50C8318d769245beA52c32BE35BC'

export const GOVERNANCE_TOKEN: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, ZERO_ONE_ADDRESS, 18, 'VIPER', 'Viper'),
  [ChainId.RINKEBY]: new Token(ChainId.RINKEBY, ZERO_ONE_ADDRESS, 18, 'VIPER', 'Viper'),
  [ChainId.ROPSTEN]: new Token(ChainId.ROPSTEN, ZERO_ONE_ADDRESS, 18, 'VIPER', 'Viper'),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, ZERO_ONE_ADDRESS, 18, 'VIPER', 'Viper'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, ZERO_ONE_ADDRESS, 18, 'VIPER', 'Viper'),
  [ChainId.BSC_MAINNET]: new Token(
    ChainId.BSC_MAINNET,
    '0x297817CE1a8De777e7ddbed86C3B7f9Dc9349f2c',
    18,
    'DUEL',
    'Duel'
  ),
  [ChainId.BSC_TESTNET]: new Token(
    ChainId.BSC_TESTNET,
    '0x6ee9b76A9cDd69190b5Aad2B2F3B3fCB3471228e',
    18,
    'DUEL',
    'Duel'
  ),
  [ChainId.HARMONY_MAINNET]: new Token(
    ChainId.HARMONY_MAINNET,
    '0xEa589E93Ff18b1a1F1e9BaC7EF3E86Ab62addc79',
    18,
    'VIPER',
    'Viper'
  ),
  [ChainId.HARMONY_TESTNET]: new Token(
    ChainId.HARMONY_TESTNET,
    '0x69A655c56087D927eb05247FB56495a0f19B9f70',
    18,
    'VIPER',
    'Viper'
  )
}

export const LOTTERY_FACTORY: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: ZERO_ONE_ADDRESS,
  [ChainId.RINKEBY]: ZERO_ONE_ADDRESS,
  [ChainId.ROPSTEN]: ZERO_ONE_ADDRESS,
  [ChainId.GÖRLI]: ZERO_ONE_ADDRESS,
  [ChainId.KOVAN]: ZERO_ONE_ADDRESS,
  [ChainId.BSC_MAINNET]: '0xDEe2d6c780dEB396F034eE4b1204b7F6E5bdaCeA',
  [ChainId.BSC_TESTNET]: '0xc719c542792643FaEB9aEa68938791456a00bE1e',
  [ChainId.HARMONY_MAINNET]: ZERO_ONE_ADDRESS,
  [ChainId.HARMONY_TESTNET]: ZERO_ONE_ADDRESS
}

export const MASTER_BREEDER: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: ZERO_ONE_ADDRESS,
  [ChainId.RINKEBY]: ZERO_ONE_ADDRESS,
  [ChainId.ROPSTEN]: ZERO_ONE_ADDRESS,
  [ChainId.GÖRLI]: ZERO_ONE_ADDRESS,
  [ChainId.KOVAN]: ZERO_ONE_ADDRESS,
  [ChainId.BSC_MAINNET]: '0x8782d54F1B1f85875028F759cB5C5FDdAEDaE0a1',
  [ChainId.BSC_TESTNET]: '0xd3260Bdec435b0E4388622DE6d16d7ef3Fcd1F9f',
  [ChainId.HARMONY_MAINNET]: '0xd3260Bdec435b0E4388622DE6d16d7ef3Fcd1F9f',
  [ChainId.HARMONY_TESTNET]: '0xd3260Bdec435b0E4388622DE6d16d7ef3Fcd1F9f'
}

export const PIT_BREEDER: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: ZERO_ONE_ADDRESS,
  [ChainId.RINKEBY]: ZERO_ONE_ADDRESS,
  [ChainId.ROPSTEN]: ZERO_ONE_ADDRESS,
  [ChainId.GÖRLI]: ZERO_ONE_ADDRESS,
  [ChainId.KOVAN]: ZERO_ONE_ADDRESS,
  [ChainId.BSC_MAINNET]: ZERO_ONE_ADDRESS,
  [ChainId.BSC_TESTNET]: '0x38a75B033c2C3444Cb91D580645F76d042F98EdA',
  [ChainId.HARMONY_MAINNET]: '0x08913d353091e24B361f0E519e2f7aD07a78995d',
  [ChainId.HARMONY_TESTNET]: '0x3945509547b74370468238F715e2dcf698a088B4'
}

export const PIT: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, ZERO_ONE_ADDRESS, 18, 'xVIPER', 'ViperPit'),
  [ChainId.RINKEBY]: new Token(ChainId.RINKEBY, ZERO_ONE_ADDRESS, 18, 'xVIPER', 'ViperPit'),
  [ChainId.ROPSTEN]: new Token(ChainId.ROPSTEN, ZERO_ONE_ADDRESS, 18, 'xVIPER', 'ViperPit'),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, ZERO_ONE_ADDRESS, 18, 'xVIPER', 'ViperPit'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, ZERO_ONE_ADDRESS, 18, 'xVIPER', 'ViperPit'),
  [ChainId.BSC_MAINNET]: new Token(ChainId.BSC_MAINNET, ZERO_ONE_ADDRESS, 18, 'xCOBRA', 'CobraDen'),
  [ChainId.BSC_TESTNET]: new Token(
    ChainId.BSC_TESTNET,
    '0x6F08B9914A4BDce7a2220D9f72BC2728Bc083A18',
    18,
    'xCOBRA',
    'CobraDen'
  ),
  [ChainId.HARMONY_MAINNET]: new Token(
    ChainId.HARMONY_MAINNET,
    '0xE064a68994e9380250CfEE3E8C0e2AC5C0924548',
    18,
    'xVIPER',
    'ViperPit'
  ),
  [ChainId.HARMONY_TESTNET]: new Token(
    ChainId.HARMONY_TESTNET,
    '0x1e11CA9830Cd3a9867990CE2769EDf77F21ae5FA',
    18,
    'xVIPER',
    'ViperPit'
  )
}

export const PIT_SETTINGS: { [chainId in ChainId]: Record<string, string> } = {
  [ChainId.MAINNET]: { name: '', path: '' },
  [ChainId.RINKEBY]: { name: '', path: '' },
  [ChainId.ROPSTEN]: { name: '', path: '' },
  [ChainId.GÖRLI]: { name: '', path: '' },
  [ChainId.KOVAN]: { name: '', path: '' },
  [ChainId.BSC_MAINNET]: { name: 'CobraDen', path: '/cobraDen' },
  [ChainId.BSC_TESTNET]: { name: 'CobraDen', path: '/cobraDen' },
  [ChainId.HARMONY_MAINNET]: { name: 'ViperPit', path: '/viperPit' },
  [ChainId.HARMONY_TESTNET]: { name: 'ViperPit', path: '/viperPit' }
}

export const WEB_INTERFACES: { [chainId in ChainId]: string[] } = {
  [ChainId.MAINNET]: [''],
  [ChainId.RINKEBY]: [''],
  [ChainId.ROPSTEN]: [''],
  [ChainId.GÖRLI]: [''],
  [ChainId.KOVAN]: [''],
  [ChainId.BSC_MAINNET]: ['app.duel.network'],
  [ChainId.BSC_TESTNET]: ['app.duel.network'],
  [ChainId.HARMONY_MAINNET]: ['app.duel.network'],
  [ChainId.HARMONY_TESTNET]: ['app.duel.network']
}

export { PRELOADED_PROPOSALS } from './proposals'

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

//export const DAI = new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin')
export const USDC = new Token(ChainId.BSC_MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD//C')
//export const USDT = new Token(ChainId.MAINNET, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT', 'Tether USD')
export const COMP = new Token(ChainId.BSC_MAINNET, '0xc00e94Cb662C3520282E6f5717214004A7f26888', 18, 'COMP', 'Compound')
export const MKR = new Token(ChainId.BSC_MAINNET, '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', 18, 'MKR', 'Maker')
export const AMPL = new Token(
  ChainId.BSC_MAINNET,
  '0xD46bA6D942050d489DBd938a2C909A5d5039A161',
  9,
  'AMPL',
  'Ampleforth'
)
export const WBTC = new Token(
  ChainId.BSC_MAINNET,
  '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  8,
  'WBTC',
  'Wrapped BTC'
)

export const DAI = new Token(
  ChainId.BSC_MAINNET,
  '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
  18,
  'DAI',
  'Dai Stablecoin'
)
export const BUSD = new Token(
  ChainId.BSC_MAINNET,
  '0xe9e7cea3dedca5984780bafc599bd69add087d56',
  18,
  'BUSD',
  'Binance USD'
)
export const USDT = new Token(
  ChainId.BSC_MAINNET,
  '0x55d398326f99059ff775485246999027b3197955',
  18,
  'USDT',
  'Tether USD'
)
export const EOS = new Token(ChainId.BSC_MAINNET, '0x56b6fb708fc5732dec1afc8d8556423a2edccbd6', 18, 'EOS', 'EOS Token')
export const DOT = new Token(
  ChainId.BSC_MAINNET,
  '0x7083609fce4d1d8dc0c979aab8c869ea2c873402',
  18,
  'DOT',
  'Polkadot Token'
)
export const ETH = new Token(
  ChainId.BSC_MAINNET,
  '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
  18,
  'ETH',
  'Ethereum Token'
)
export const BETH = new Token(
  ChainId.BSC_MAINNET,
  '0x250632378E573c6Be1AC2f97Fcdf00515d0Aa91B',
  18,
  'BETH',
  'Binance Beacon Ethereum Token'
)
export const MBANANA = new Token(
  ChainId.BSC_MAINNET,
  '0x603c7f932ED1fc6575303D8Fb018fDCBb0f39a95',
  18,
  'BANANA',
  'ApeSwap token'
)
export const BTCB = new Token(
  ChainId.BSC_MAINNET,
  '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
  18,
  'BTCB',
  'Binance BTC'
)

export const DUEL = new Token(
  ChainId.BSC_MAINNET,
  '0x297817CE1a8De777e7ddbed86C3B7f9Dc9349f2c',
  18,
  'DUEL',
  'Duel Token'
)
export const TBUSD = new Token(
  ChainId.BSC_TESTNET,
  '0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7',
  18,
  'BUSD',
  'Testnet Binance USD'
)
export const TETH = new Token(
  ChainId.BSC_TESTNET,
  '0x8babbb98678facc7342735486c851abd7a0d17ca',
  18,
  'ETH',
  'Testnet Binance ETH'
)
export const TBTC = new Token(
  ChainId.BSC_TESTNET,
  '0x6ce8da28e2f864420840cf74474eff5fd80e65b8',
  18,
  'BTCB',
  'Testnet Binance BTC'
)

export const TDAI = new Token(
  ChainId.BSC_TESTNET,
  '0x8a9424745056Eb399FD19a0EC26A14316684e274',
  18,
  'DAI',
  'Testnet Binance BTC'
)

// Block time here is slightly higher (~1s) than average in order to avoid ongoing proposals past the displayed time
export const AVERAGE_BLOCK_TIME_IN_SECS = 3
export const PROPOSAL_LENGTH_IN_BLOCKS = 40_320
export const PROPOSAL_LENGTH_IN_SECS = AVERAGE_BLOCK_TIME_IN_SECS * PROPOSAL_LENGTH_IN_BLOCKS

export const COMMON_CONTRACT_NAMES: { [address: string]: string } = {
  [GOVERNANCE_ADDRESS]: 'Governance',
  [TIMELOCK_ADDRESS]: 'Timelock'
}

export const FALLBACK_GAS_LIMIT = BigNumber.from(6721900)

// TODO: specify merkle distributor for mainnet
export const MERKLE_DISTRIBUTOR_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: '0x090D4613473dEE047c3f2706764f49E0821D256e'
}

const WETH_ONLY: ChainTokenList = {
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET]],
  [ChainId.ROPSTEN]: [WETH[ChainId.ROPSTEN]],
  [ChainId.RINKEBY]: [WETH[ChainId.RINKEBY]],
  [ChainId.GÖRLI]: [WETH[ChainId.GÖRLI]],
  [ChainId.KOVAN]: [WETH[ChainId.KOVAN]],
  [ChainId.BSC_MAINNET]: [WETH[ChainId.BSC_MAINNET]],
  [ChainId.BSC_TESTNET]: [WETH[ChainId.BSC_TESTNET]],
  [ChainId.HARMONY_MAINNET]: [WETH[ChainId.HARMONY_MAINNET]],
  [ChainId.HARMONY_TESTNET]: [WETH[ChainId.HARMONY_TESTNET]]
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, USDC, USDT, COMP, MKR, WBTC],
  [ChainId.BSC_MAINNET]: [...WETH_ONLY[ChainId.BSC_MAINNET], BUSD, DAI, USDT],
  [ChainId.BSC_TESTNET]: [...WETH_ONLY[ChainId.BSC_TESTNET], TBUSD, TDAI],
  [ChainId.HARMONY_MAINNET]: [
    ...WETH_ONLY[ChainId.HARMONY_MAINNET],
    getTokenWithDefault(ChainId.HARMONY_MAINNET, 'BUSD'),
    getTokenWithDefault(ChainId.HARMONY_MAINNET, 'bscBUSD'),
    getTokenWithDefault(ChainId.HARMONY_MAINNET, '1USDC'),
    getTokenWithDefault(ChainId.HARMONY_MAINNET, 'VIPER'),
    getTokenWithDefault(ChainId.HARMONY_MAINNET, '1ETH'),
    getTokenWithDefault(ChainId.HARMONY_MAINNET, 'LINK')
  ]
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.MAINNET]: {
    [ETH.address]: [DAI, WETH[ChainId.MAINNET]]
  }
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, USDC, USDT, WBTC],
  [ChainId.BSC_MAINNET]: [...WETH_ONLY[ChainId.BSC_MAINNET], BUSD, DAI, DUEL],
  [ChainId.HARMONY_MAINNET]: [
    ...WETH_ONLY[ChainId.HARMONY_MAINNET],
    getTokenWithDefault(ChainId.HARMONY_MAINNET, 'BUSD'),
    getTokenWithDefault(ChainId.HARMONY_MAINNET, 'VIPER')
  ]
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, USDC, USDT, WBTC],
  [ChainId.BSC_MAINNET]: [...WETH_ONLY[ChainId.BSC_MAINNET], BUSD, DAI, USDT, DUEL],
  [ChainId.HARMONY_MAINNET]: [
    ...WETH_ONLY[ChainId.HARMONY_MAINNET],
    getTokenWithDefault(ChainId.HARMONY_MAINNET, 'BUSD'),
    getTokenWithDefault(ChainId.HARMONY_MAINNET, 'bscBUSD'),
    getTokenWithDefault(ChainId.HARMONY_MAINNET, '1USDC'),
    getTokenWithDefault(ChainId.HARMONY_MAINNET, 'VIPER'),
    getTokenWithDefault(ChainId.HARMONY_MAINNET, '1ETH'),
    getTokenWithDefault(ChainId.HARMONY_MAINNET, 'LINK')
  ]
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.MAINNET]: [
    [
      new Token(ChainId.MAINNET, '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643', 8, 'cDAI', 'Compound Dai'),
      new Token(ChainId.MAINNET, '0x39AA39c021dfbaE8faC545936693aC917d5E7563', 8, 'cUSDC', 'Compound USD Coin')
    ],
    [USDC, USDT],
    [DAI, USDT]
  ]
}

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'WalletConnect',
    iconName: 'walletConnectIcon.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true
  },
  WALLET_LINK: {
    connector: walletlink,
    name: 'Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Use Coinbase Wallet app on mobile device',
    href: null,
    color: '#315CF5'
  },
  COINBASE_LINK: {
    name: 'Open in Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Open in Coinbase Wallet app.',
    href: 'https://go.cb-w.com/mtUDhEZPy1',
    color: '#315CF5',
    mobile: true,
    mobileOnly: true
  },
  FORTMATIC: {
    connector: fortmatic,
    name: 'Fortmatic',
    iconName: 'fortmaticIcon.png',
    description: 'Login using Fortmatic hosted wallet',
    href: null,
    color: '#6748FF',
    mobile: true
  },
  Portis: {
    connector: portis,
    name: 'Portis',
    iconName: 'portisIcon.png',
    description: 'Login using Portis hosted wallet',
    href: null,
    color: '#4A6C9B',
    mobile: true
  }
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

// used for rewards deadlines
export const BIG_INT_SECONDS_IN_WEEK = JSBI.BigInt(60 * 60 * 24 * 7)

export const BIG_INT_ZERO = JSBI.BigInt(0)

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), JSBI.BigInt(10000))

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

// SDN OFAC addresses
export const BLOCKED_ADDRESSES: string[] = [
  '0x7F367cC41522cE07553e823bf3be79A889DEbe1B',
  '0xd882cFc20F52f2599D84b8e8D58C7FB62cfE344b',
  '0x901bb9583b24D97e995513C6778dc6888AB6870e',
  '0xA7e5d5A720f06526557c513402f2e6B5fA20b008',
  '0x8576aCC5C05D6Ce88f4e49bf65BdF0C62F91353C'
]
