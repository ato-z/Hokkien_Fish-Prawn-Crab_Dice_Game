declare type Room = {
  id: string
  name: string
  sub: string
  minBet: number
  players: number
  maxPlayers: number
  status: string
  tag: string
  hot?: boolean
  private?: boolean
  password?: string
}

declare type OnChoiceTap = {
  (type: 'single', input: number): void
  (type: 'both', input: [number, number]): void
  (type: 'set', input: [number, number, number]): void
}

declare type GameState = 'betting' | 'rolling' | 'result'
