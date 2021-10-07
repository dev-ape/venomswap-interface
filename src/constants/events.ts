import { ChainId, Token } from '@venomswap/sdk'
import getPairTokensWithDefaults from '../utils/getPairTokensWithDefaults'

export interface ConfigEventInfo {
  title: string
  desc: string
  address: string
  tokens: [Token, Token]
  active: boolean
  startBlock: number
  endBlock: number
  pools: ConfigEventPoolInfo[]
}

export interface ConfigEventPoolInfo {
  pid: number
  title: string
  img1: string
  img2: string
}

export const EVENTS_INFO: {
  [chainId in ChainId]?: ConfigEventInfo[]
} = {
  [ChainId.BSC_MAINNET]: [
    {
      title: 'BTC Price Guess OLD',
      desc: 'WITHDRAW FROM THIS POOL, and deposit to the new POOL',
      address: '0xaF7BF584be79d5335ac1c2404215B3F809684bA2',
      tokens: getPairTokensWithDefaults(ChainId.BSC_MAINNET, 'WBNB/DUEL'),
      active: false,
      startBlock: 10630150,
      endBlock: 10630150,
      pools: [
        { pid: 0, title: 'BTC HIGHER', img1: '/images/events/btc.png', img2: '/images/events/duel_dark.png' },
        { pid: 1, title: 'BTC LOWER', img1: '/images/events/btc.png', img2: '/images/events/duel_dark.png' }
      ]
    },
    {
      title: 'BTC Price Guess NEW',
      desc:
        'You win if you correctly guess the price of BTC. Will it be higher or lower then $52,400 USD at 11 September 23:59 UTC?',
      address: '0xC231470e926678CfE8539acdd8b748082A2e4476',
      tokens: getPairTokensWithDefaults(ChainId.BSC_MAINNET, 'WBNB/DUEL'),
      active: true,
      startBlock: 10658800,
      endBlock: 10834421,
      pools: [
        { pid: 0, title: 'BTC HIGHER', img1: '/images/events/btc.png', img2: '/images/events/duel_dark.png' },
        { pid: 1, title: 'BTC LOWER', img1: '/images/events/btc.png', img2: '/images/events/duel_dark.png' }
      ]
    },
    {
      title: 'Juventus vs. Milan',
      desc:
        'You win if you correctly guess Juventus vs. Milan match result, who wins ?, ML1 or ML2, 19 September 18:45 UTC',
      address: '0x65A12a07e793939244F50FaE954dFd3841100A51',
      tokens: getPairTokensWithDefaults(ChainId.BSC_MAINNET, 'WBNB/DUEL'),
      active: true,
      startBlock: 10853600,
      endBlock: 11060380,
      pools: [
        { pid: 0, title: 'JUVENTUS WIN', img1: '/images/events/juve.png', img2: '/images/events/duel_dark.png' },
        { pid: 1, title: 'MILAN WIN', img1: '/images/events/milan.png', img2: '/images/events/duel_dark.png' }
      ]
    },
    {
      title: 'AVAX vs. ETH',
      desc:
        'AVAXs Current Price $72, ETHs Current Price $3511, Which one gains more value until 25 September 21:00 UTC',
      address: '0x4B1e9130992925e73eA286fCe977760c46B26640',
      tokens: getPairTokensWithDefaults(ChainId.BSC_MAINNET, 'WBNB/DUEL'),
      active: true,
      startBlock: 11031991,
      endBlock: 11233591,
      pools: [
        { pid: 0, title: 'AVAX MORE GAIN', img1: '/images/events/AVAXX.png', img2: '/images/events/duel_dark.png' },
        { pid: 1, title: 'ETH MORE GAIN', img1: '/images/events/ETHH.png', img2: '/images/events/duel_dark.png' }
      ]
    },
    {
      title: 'Paris Saint Germain vs. Manchester City',
      desc:
        'You win if you correctly guess Paris Saint Germain vs. Manchester City match OVER 2.5 GOALS or UNDER 2.5 GOALS 28th Sept. 21:00 UTC',
      address: '0x5C1F8600D750Dcc615076fB4CA0e87c5C0be741c',
      tokens: getPairTokensWithDefaults(ChainId.BSC_MAINNET, 'WBNB/DUEL'),
      active: true,
      startBlock: 11232191,
      endBlock: 11318400,
      pools: [
        { pid: 0, title: '2.5 OVER', img1: '/images/events/over.png', img2: '/images/events/duel_dark.png' },
        { pid: 1, title: '2.5 UNDER', img1: '/images/events/under.png', img2: '/images/events/duel_dark.png' }
      ]
    },
    {
      title: 'Whatsapp vs. Telegram User Experience',
      desc: 'Is Whatsapp more useful or Telegram? The side with the highest LP will win 02nd October 21:00 UTC',
      address: '0x0E6C15a0f03e74Ae3288d25f7c709DDBE6bBeb1D',
      tokens: getPairTokensWithDefaults(ChainId.BSC_MAINNET, 'WBNB/DUEL'),
      active: true,
      startBlock: 11232192,
      endBlock: 11433900,
      pools: [
        { pid: 0, title: 'Whatsapp', img1: '/images/events/whatsapp.png', img2: '/images/events/duel_dark.png' },
        { pid: 1, title: 'Telegram', img1: '/images/events/telegram.png', img2: '/images/events/duel_dark.png' }
      ]
    },
    {
      title: 'Atletico Madrid vs. Barcelona',
      desc:
        'You win if you correctly guess Atletico Madrid vs. Barcelona match OVER 2.5 GOALS or UNDER 2.5 GOALS 02nd October 21:00 UTC',
      address: '0x535579296da57459fb6F766b57b4FBfE26B9323F',
      tokens: getPairTokensWithDefaults(ChainId.BSC_MAINNET, 'WBNB/DUEL'),
      active: true,
      startBlock: 11346406,
      endBlock: 11432806,
      pools: [
        { pid: 0, title: '2.5 OVER', img1: '/images/events/over.png', img2: '/images/events/duel_dark.png' },
        { pid: 1, title: '2.5 UNDER', img1: '/images/events/under.png', img2: '/images/events/duel_dark.png' }
      ]
    },
    {
      title: 'Hanwha Life Esports vs. LNG Esports',
      desc: 'You win if you correctly guess Hanwha Life Esports vs. LNG Esports ML1 or ML2 05th October 11:00 UTC',
      address: '0x6af5a8ac8b719f416c091f79727d8600126a51e7',
      tokens: getPairTokensWithDefaults(ChainId.BSC_MAINNET, 'WBNB/DUEL'),
      active: true,
      startBlock: 11426106,
      endBlock: 11518643,
      pools: [
        { pid: 0, title: 'Hanwha WIN', img1: '/images/events/hanwha.png', img2: '/images/events/duel_dark.png' },
        { pid: 1, title: 'LNG WIN', img1: '/images/events/lng.png', img2: '/images/events/duel_dark.png' }
      ]
    },
    {
      title: 'Italy vs. Spain National Football Match',
      desc:
        'You win if you correctly guess Italy vs. Spain National match Both Teams to Score YES or NO 06th October 21:00 UTC',
      address: '0x413f472ad44734ea39ddc65107b765553ad87ef2',
      tokens: getPairTokensWithDefaults(ChainId.BSC_MAINNET, 'WBNB/DUEL'),
      active: true,
      startBlock: 11426106,
      endBlock: 11548486,
      pools: [
        { pid: 0, title: 'BTTS YES', img1: '/images/events/yes.png', img2: '/images/events/duel_dark.png' },
        { pid: 1, title: 'BTTS NO', img1: '/images/events/no.png', img2: '/images/events/duel_dark.png' }
      ]
    },
    {
      title: 'MacaronSwap vs. CafeSwap',
      desc: 'Which DEX do you use more? Vote the side, the highest LP side will win 17th October 21:00 UTC',
      address: '0x829857d70d0b4388fD6226B2657b441AB258df69',
      tokens: getPairTokensWithDefaults(ChainId.BSC_MAINNET, 'WBNB/DUEL'),
      active: true,
      startBlock: 11425826,
      endBlock: 11722206,
      pools: [
        { pid: 0, title: 'MacaronSwap', img1: '/images/events/macaron.png', img2: '/images/events/duel_dark.png' },
        { pid: 1, title: 'CafeSwap', img1: '/images/events/cafe.png', img2: '/images/events/duel_dark.png' }
      ]
    }
  ],
  [ChainId.BSC_TESTNET]: []
}
