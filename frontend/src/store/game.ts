import { apiGetRoomInfoById } from '@/api'
import { GAME_DEFAULT_OPTION } from '@/constant'
import type { SYMBOL_TYPE } from '@/enum'
import { HearthstoneSpinner } from '@/helper/HearthstoneSpinner'
import { atom } from 'jotai'
import { currentJettonAtom, playerJettonAtom } from './player'

// 游戏配置
export const gameOptionAtom = atom(GAME_DEFAULT_OPTION)

// 原始数据
export const roomInfoAtom = atom<Room | null>(null)

// 房间号
export const roomIdAtom = atom<string | null>(null)

// 房间状态
export const roomStatusAtom = atom<GameState>('betting')

// 开奖结果
export const diceResultAtom = atom<SYMBOL_TYPE[] | null>(null)

// 当前游戏控制器
export const gameControllerAtom = atom<HearthstoneSpinner | null>(null)

// 设置房间号并更新房间元信息
export const withRoomIdAtom = atom(null, async (get, set, input: string) => {
  const currentRoomId = get(roomIdAtom)
  if (currentRoomId === input) return void 0
  const gameOption = {
    roomId: currentRoomId!,
    ...get(gameOptionAtom),
  }

  // 效果旧的控制器
  HearthstoneSpinner.destroy(currentRoomId!, gameOption)

  // 以前更新避免并发
  set(roomIdAtom, input)

  // 从线上获取房间信息
  const roomInfo = await apiGetRoomInfoById(input)
  set(roomInfoAtom, roomInfo)
  // 更新玩家持有筹码
  set(playerJettonAtom, roomInfo.jetton[get(currentJettonAtom)])

  // 更新控制器
  set(gameControllerAtom, HearthstoneSpinner.getInstance(input, gameOption))
})

// 开奖逻辑
export const startRollAtom = atom(null, async (get, set, runToParams: { duration: number; column: number[] }) => {
  const gameController = get(gameControllerAtom)
  if (gameController === null) return void 0

  // 1. 防止重复触发：如果已经在滚动，直接返回
  if (get(roomStatusAtom) === 'rolling') return void 0

  // 2. 开始滚动
  set(roomStatusAtom, 'rolling')
  set(diceResultAtom, null)

  try {
    // 3. 执行动画逻辑
    await gameController.runTo(runToParams)

    // 4. 动画结束，更新结果
    set(diceResultAtom, runToParams.column as SYMBOL_TYPE[])
    set(roomStatusAtom, 'result')

    // 5. 延时重置状态
    setTimeout(() => {
      set(roomStatusAtom, 'betting')
    }, 3000)
  } catch (error) {
    console.error('动画执行失败', error)
    set(roomStatusAtom, 'betting') // 出错回滚
  }
})
