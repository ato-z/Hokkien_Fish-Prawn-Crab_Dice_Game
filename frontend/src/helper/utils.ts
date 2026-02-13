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
