import { useCallback, useEffect, useRef } from 'react'
import type { HearthstoneSpinner } from '@/helper/HearthstoneSpinner'
import { SYMBOL_TYPE } from '@/enum'
import { GAME_TAGS } from '@/constant'

interface GameBoardProps {
  diceResult: SYMBOL_TYPE[] | null
  isRolling: boolean
  gameController: HearthstoneSpinner
  onChoice?: OnChoiceTap
}

export const GameBoard = ({ diceResult, gameController, isRolling, onChoice }: GameBoardProps) => {
  const canvasView = useRef<HTMLDivElement>(null)
  const onTap: OnChoiceTap = useCallback(
    (type, input) => {
      if (isRolling) return void 0
      if (onChoice) {
        onChoice(type as 'single', input as number)
      }
    },
    [isRolling, onChoice]
  )

  console.log('结果', diceResult)

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
          <ul className="flex flex-col" onClick={() => onTap('set', GAME_TAGS.set[0])}>
            {new Array(3).fill(GAME_TAGS.set[0]).map((list: number[], LIdx) => (
              <li className="grid grid-cols-3" key={LIdx}>
                {list.map((_, i) => (
                  <i key={i} className={`aspect-square branch-index branch-${_}`}></i>
                ))}
              </li>
            ))}
          </ul>
        </div>

        <div
          className="w-3/5 flex flex-col justify-center bg-body items-center relative overflow-hidden"
          ref={canvasView}>
          {/* canvas 开奖盘 */}
        </div>

        <div className="w-1/5 bg-body">
          <ul className="flex flex-col" onClick={() => onTap('set', GAME_TAGS.set[1])}>
            {new Array(3).fill(GAME_TAGS.set[1]).map((list: number[], LIdx) => (
              <li className="grid grid-cols-3" key={LIdx}>
                {list.map((_, i) => (
                  <i key={i} className={`aspect-square branch-index branch-${_}`}></i>
                ))}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 主区域 */}
      <section className="flex h-3/5 text-black">
        <div className="flex-1 grid grid-cols-3  gap-0.5">
          {GAME_TAGS.both.map(([l, r]) => (
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
          {GAME_TAGS.single.map((i) => (
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
