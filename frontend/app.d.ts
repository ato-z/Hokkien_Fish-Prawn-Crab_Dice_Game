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
