/**
 * 获取房间信息
 */
export const apiGetRoomInfoById = async (id: string) => {
  console.log('获取房间信息', id)
  return {
    id: '1',
    name: '韭菜收割机_101',
    sub: 'FERTILIZER ZONE',
    private: false,
    minBet: 0,
    jetton: [1, 5, 10],
    maxPlayers: 0,
    status: 'betting',
    tag: '无料',
  } as Room
}
