export const GameBoard = ({ diceResult, isRolling }: { diceResult: unknown[] | null; isRolling: boolean }) => {
  console.log(diceResult, isRolling)
  return <div className="aspect-square w-full bg-[#FCFBFE]"></div>
}
