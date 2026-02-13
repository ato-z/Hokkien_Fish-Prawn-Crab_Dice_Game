import { atom } from 'jotai'

/**
 * 当前选中的筹码索引
 * 用于记录玩家在游戏中选择的筹码选项
 */
export const currentJettonAtom = atom<number>(0)
