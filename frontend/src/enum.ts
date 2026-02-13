export const SYMBOL_TYPE = {
  GOURD: 0,
  CRAB: 1,
  FISH: 2,
  COIN: 3,
  PRAWN: 4,
  ROOSTER: 5,
} as const

export type SYMBOL_TYPE = (typeof SYMBOL_TYPE)[keyof typeof SYMBOL_TYPE]

export const GAME_STATE_STRING: Record<GameState, string> = {
  betting: '强制交割 (EXECUTE)',
  rolling: '制造波动 (VOLATILITY)',
  result: '资金清算 (SETTLED)',
}
