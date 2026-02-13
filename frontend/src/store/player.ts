import { atom } from 'jotai'

/**
 * 当前选中的筹码索引
 * 用于记录玩家在游戏中选择的筹码选项
 */
export const currentJettonAtom = atom<number>(0)

/**
 * 当前玩家手持的筹码
 */
export const playerJettonAtom = atom(0)

/**
 * 当前用户是否为房主
 */
export const bossAtom = atom(false)

/**
 * 自己的下注
 */
// export const betSelfAtom = atom<Bet>({ single: [], both: [], set: [] })
export const betSelfAtom = atom<Bet>({
  single: [
    { eq: '1', value: 1 },
    { eq: '2', value: 1 },
    { eq: '3', value: 1 },
    { eq: '4', value: 1 },
    { eq: '5', value: 1 },
    { eq: '0', value: 1 },
  ],
  both: [
    { eq: '1_5', value: 1 },
    { eq: '2_4', value: 1 },
    { eq: '2_3', value: 1 },
    { eq: '1_3', value: 1 },
    { eq: '3_4', value: 1 },
  ],
  set: [{ eq: '0_1_2', value: 1 }],
})

//

/**
 * 所有人的下注
 */
// export const betAllAtom = atom<Bet>({ single: [], both: [], set: [] })
export const betAllAtom = atom<Bet>({
  single: [
    { eq: '1', value: 1 },
    { eq: '2', value: 1 },
    { eq: '3', value: 1 },
    { eq: '4', value: 1 },
    { eq: '5', value: 1 },
    { eq: '0', value: 1 },
  ],
  both: [
    { eq: '1_5', value: 1 },
    { eq: '2_4', value: 1 },
    { eq: '2_3', value: 1 },
    { eq: '3_4', value: 1 },
    { eq: '1_2', value: 1 },
    { eq: '0_3', value: 1 },
    { eq: '0_5', value: 1 },
    { eq: '0_1', value: 1 },
  ],
  set: [],
})

/**
 * 为自己下注， 如果不存在则下注，反之取消
 */
export const pushBetSelfAtom = atom(null, (get, set, input: { key: keyof Bet; eq: string; notice: BetNotice }) => {
  const isBoss = get(bossAtom)
  if (isBoss) return

  const { key, eq, notice } = input
  const value = get(playerJettonAtom)
  const prevBet = get(betSelfAtom) // 获取当前快照用于逻辑判断
  const list = prevBet[key]
  const index = list.findIndex((current) => current.eq === eq)

  // 1. 预先确定操作类型和最终通知的值
  const isRemoving = index !== -1
  const noticeValue = isRemoving ? -list[index].value : value

  // 2. 执行状态更新（保持纯净）
  set(betSelfAtom, (prev) => {
    const currentList = prev[key]
    const nextList = isRemoving ? currentList.filter((item) => item.eq !== eq) : [...currentList, { eq, value }]

    return { ...prev, [key]: nextList }
  })

  try {
    notice(key, eq, noticeValue)
  } catch (e) {
    console.error('通知失败', e)
  }
})
/**
 * 所有人的下注， 如果要取消 使用-value值
 */
export const pushBetAllAtom = atom(null, (_, set, input: { key: keyof Bet; target: BetStore }) => {
  const { key, target } = input

  set(betAllAtom, (prev) => {
    const list = prev[key]
    const index = list.findIndex((current) => current.eq === target.eq)

    let newList = [...list]

    if (index !== -1) {
      const newValue = newList[index].value + target.value
      if (newValue <= 0) {
        newList = newList.filter((_, i) => i !== index)
      } else {
        newList[index] = { ...newList[index], value: newValue }
      }
    } else if (target.value > 0) {
      newList.push(target)
    }

    return { ...prev, [key]: newList }
  })
})
