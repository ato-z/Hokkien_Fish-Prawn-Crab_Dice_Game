/**
 * 获取 1 到 n 之间，取 k 个数的所有组合
 * @param n 最大数字
 * @param k 组合的长度
 */
export const combine = (n: number, k: number) => {
  const result: number[][] = []

  function backtrack(start: number, path: number[]) {
    // 如果路径长度等于 k，说明找到了一组组合
    if (path.length === k) {
      result.push([...path])
      return
    }

    // 从 start 开始遍历，避免重复选择之前的数字（保证组合唯一性）
    for (let i = start; i <= n; i++) {
      path.push(i) // 选择当前数字
      backtrack(i + 1, path) // 递归寻找下一个
      path.pop() // 回溯，撤销选择
    }
  }

  backtrack(0, [])
  return result
}

/**
 * 游戏元素类型定义
 */
export interface GameElement {
  name: string
  color: 'blue' | 'green' | 'red'
}

/**
 * 游戏元素映射表
 * 0： ['葫芦', 主题蓝色]
 * 1： ['蟹', 主题绿色]
 * 2： ['鱼', 主题红色]
 * 3： ['钱', 主题蓝色]
 * 4： ['虾', 主题绿色]
 * 5： ['鸡', 主题红色]
 */
const GAME_ELEMENT_MAP: Record<number, GameElement> = {
  0: { name: '葫芦', color: 'blue' },
  1: { name: '蟹', color: 'green' },
  2: { name: '鱼', color: 'red' },
  3: { name: '钱', color: 'blue' },
  4: { name: '虾', color: 'green' },
  5: { name: '鸡', color: 'red' },
}

/**
 * 将索引字符串转换为游戏元素数组
 * @param eq 索引字符串，格式如 "0"、"0_1"、"0_1_2"
 * @returns 游戏元素数组
 * @example
 * eqTransform("0") // [{ name: '葫芦', color: 'blue' }]
 * eqTransform("0_1") // [{ name: '葫芦', color: 'blue' }, { name: '蟹', color: 'green' }]
 */
export const eqTransform = (eq: string): GameElement[] => {
  const indices = eq.split('_').map(Number)
  return indices.map((index) => GAME_ELEMENT_MAP[index])
}

/**
 * 获取下注类型的赔率
 */
export const getOdds = (elementsCount: number): number => {
  if (elementsCount === 1) return 1
  if (elementsCount === 2) return 4
  return 6
}
