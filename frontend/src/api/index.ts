/**
 * 获取房间信息
 */
export const apiGetRoomInfoById = async (id: string) => {
  console.log('获取房间信息', id)

  await new Promise((res) => {
    setTimeout(res, 3000)
  })

  return {
    id: '1',
    name: '韭菜收割机_101',
    sub: 'FERTILIZER ZONE',
    private: true,
    minBet: 0,
    jetton: [1, 5, 10],
    maxPlayers: 0,
    status: 'betting',
    tag: '无料',
  } as Room
}

/**
 * 加入房间
 * @param roodId
 * @param password
 */
export const apiPostRoomJoinById = async (roodId: string, password?: string) => {
  console.log('模拟加入房间', roodId, password)
}
