import { SYMBOL_TYPE } from './enum'
import { combine } from './helper/utils'
import sidesPath from '@/assets/sides.webp'
import spinPath from '@/assets/spin.mp3'

/**
 * 可下注的类型
 */
export const GAME_TAGS: {
  single: SYMBOL_TYPE[]
  both: [SYMBOL_TYPE, SYMBOL_TYPE][]
  set: Array<[SYMBOL_TYPE, SYMBOL_TYPE, SYMBOL_TYPE]>
} = {
  single: Object.values(SYMBOL_TYPE),
  both: combine(5, 2) as [SYMBOL_TYPE, SYMBOL_TYPE][],
  set: [
    [SYMBOL_TYPE.GOURD, SYMBOL_TYPE.CRAB, SYMBOL_TYPE.FISH] as [SYMBOL_TYPE, SYMBOL_TYPE, SYMBOL_TYPE],
    [SYMBOL_TYPE.COIN, SYMBOL_TYPE.PRAWN, SYMBOL_TYPE.ROOSTER] as [SYMBOL_TYPE, SYMBOL_TYPE, SYMBOL_TYPE],
  ],
}

export const GAME_DEFAULT_OPTION = {
  column: 3,
  sideNumber: 6,
  sidesPath: sidesPath,
  audioPath: spinPath,
}
