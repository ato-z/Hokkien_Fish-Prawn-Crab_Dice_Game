import { useEffect, useRef } from 'react'
import type { HearthstoneSpinner } from '@/helper/HearthstoneSpinner'

interface GameBoardProps {
  diceResult: unknown[] | null
  isRolling: boolean
  gameController: HearthstoneSpinner
}

export const GameBoard = ({ gameController }: GameBoardProps) => {
  const canvasView = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (canvasView.current) {
      gameController.appendTo(canvasView.current)
    }
  }, [canvasView, gameController])

  return (
    <aside className="aspect-square w-full bg-[#FCFBFE] flex flex-col">
      {/* 顶部 */}
      <section className="h-1/5 w-full flex border-b-2 border-red-700">
        <div className="w-1/4 border-r-2 border-red-700 flex flex-col justify-center items-center p-2">
          {/* 葫 鱼 蟹 */}
          <span className="text-xs text-blue-800 font-bold mt-1">六倍区</span>
        </div>

        <div className="w-2/4 flex flex-col justify-center items-center border-r-2" ref={canvasView}>
          {/* canvas 开奖盘 */}
        </div>

        <div className="w-1/4 flex flex-col justify-center items-center p-2">
          {/* 钱 虾 鸡 */}
          <span className="text-xs text-red-800 font-bold mt-1 ">六倍区</span>
        </div>
      </section>

      {/* 主区域 */}
      <section className="flex h-3/5 text-black border-b-2 border-red-700">
        <div className="flex-1 grid grid-cols-3 bg-red-700 gap-0.5">
          {new Array(15).fill(1).map((_, i) => (
            <div className="size-full" key={i}>
              <div className="flex items-center justify-center size-full bg-[#FCFBFE]">{i + 1}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 单独 */}
      <section className="h-1/5">
        <div className="h-full grid grid-cols-6 bg-red-700 gap-0.5 text-black">
          {['葫', '鱼', '蟹', '钱', '虾', '鸡'].map((_, i) => (
            <div className="size-full" key={i}>
              <div className="flex items-center justify-center size-full bg-[#FCFBFE]">{_}</div>
            </div>
          ))}
        </div>
      </section>
    </aside>
  )
}
