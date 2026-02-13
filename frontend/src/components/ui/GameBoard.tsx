import { useCallback, useEffect, useRef } from 'react'
import type { HearthstoneSpinner } from '@/helper/HearthstoneSpinner'
import { combine } from '@/helper/utils'

interface GameBoardProps {
  diceResult: unknown[] | null
  isRolling: boolean
  gameController: HearthstoneSpinner
  onChoice?: OnChoiceTap
}

export const GameBoard = ({ gameController, isRolling, onChoice }: GameBoardProps) => {
  const canvasView = useRef<HTMLDivElement>(null)
  const bothGroup = combine(5, 2)
  const onTap: OnChoiceTap = useCallback(
    (type, input) => {
      if (isRolling) return void 0
      if (onChoice) {
        onChoice(type as 'single', input as number)
      }
    },
    [isRolling, onChoice]
  )

  useEffect(() => {
    if (canvasView.current) {
      gameController.appendTo(canvasView.current)
    }
  }, [canvasView, gameController])

  return (
    <aside className="aspect-square w-full game-container flex flex-col gap-0.5">
      <div className="flex-1 bg-body"></div>
      <section className="h-1/5 w-full flex gap-0.5">
        <div className="w-1/5 bg-body">
          <div className="grid grid-cols-3" onClick={() => onTap('set', [0, 1, 2])}>
            {new Array(9).fill(1).map((_, i) => (
              <i key={i} className={`aspect-square branch-index branch-${~~(i / 3)}`}></i>
            ))}
          </div>
        </div>

        <div className="w-3/5 flex flex-col justify-center bg-body items-center" ref={canvasView}>
          {/* canvas 开奖盘 */}
        </div>

        <div className="w-1/5 bg-body">
          <div className="grid grid-cols-3" onClick={() => onTap('set', [3, 4, 5])}>
            {new Array(9).fill(1).map((_, i) => (
              <i key={i} className={`aspect-square branch-index branch-${~~(i / 3) + 3}`}></i>
            ))}
          </div>
        </div>
      </section>

      {/* 主区域 */}
      <section className="flex h-3/5 text-black">
        <div className="flex-1 grid grid-cols-3  gap-0.5">
          {bothGroup.map(([l, r]) => (
            <div
              className="size-full both-group"
              onClick={() => onTap('both', [l, r])}
              key={`${l}_${r}`}
              data-key={`${l}_${r}`}>
              <i className={`branch-index branch-${l}`}></i>
              <i className={`branch-index branch-${r}`}></i>
            </div>
          ))}
        </div>
      </section>

      {/* 单独 */}
      <section>
        <div className="h-full grid grid-cols-6 gap-0.5 text-black">
          {new Array(6).fill(0).map((_, i) => (
            <div className="size-full" key={i} onClick={() => onTap('single', i)}>
              <i className={`branch-index branch-${i}`}></i>
            </div>
          ))}
        </div>
      </section>

      <div className="flex-1 bg-body"></div>
    </aside>
  )
}
