/**
 * 每一列的动画状态数据接口
 */
interface ColumnState {
  currentPos: number // 当前浮动位置
  lastIntPos: number // 上一次的整数位置（用于检测 Tick）
  targetPos: number // 目标位置
  startPos: number // 动画开始时的位置
  startTime: number // 动画开始时间戳
  duration: number // 动画持续时间
  isAnimating: boolean // 是否正在动画中
  velocity: number // 当前速度
}

/**
 * 构造函数配置接口
 */
interface SpinnerOptions {
  roomId: string
  column: number // 列数
  sidesPath: string // 图片路径
  sideNumber: number // 面数（一圈有多少个图标）
  audioPath?: string // 音频路径（可选）
}

/**
 * runTo 方法的参数接口
 */
interface RunToOptions {
  column: number[] // 目标结果索引数组
  duration: number // 基础持续时间
}

const gameMap = new Map<string, HearthstoneSpinner>()

/**
 * 骰子转盘类
 */
export class HearthstoneSpinner {
  /**
   * 获取示例
   * @param roomId
   * @param option
   */
  static getInstance(roomId: string, option: SpinnerOptions) {
    const key = `${roomId}_${JSON.stringify(option)}`
    const ins = gameMap.get(key)
    if (ins) return ins

    const newClass = new this(option)
    gameMap.set(key, newClass)
    return newClass
  }

  /**
   * 销毁
   * @param roomId
   */
  static destroy(roomId: string, option: SpinnerOptions) {
    const key = `${roomId}_${JSON.stringify(option)}`
    const instance = gameMap.get(key)

    if (instance) {
      instance.destroy()
    }
  }

  /**
   * 播放 Tick 音效，增加频率限制判断
   */
  private playTick(): void {
    if (!this.audioBuffer || !this.audioContext) return

    const now = performance.now()
    // 检查是否在保护期内
    if (now - this.lastTickTime < this.minTickInterval) {
      return
    }

    try {
      const source = this.audioContext.createBufferSource()
      source.buffer = this.audioBuffer
      source.connect(this.audioContext.destination)
      source.start(0)
      this.lastTickTime = now // 记录本次播放时间
    } catch {
      // 忽略音频播放错误（如用户未交互导致被浏览器阻止）
    }
  }

  /**
   * 物理与状态更新
   * @returns 是否还有列在动画中
   */
  private update(): boolean {
    const now = performance.now()
    let maxVelocity = 0
    let shouldPlayTick = false
    let hasAnimating = false

    this.columns.forEach((col) => {
      if (!col.isAnimating) {
        col.velocity = 0
        return
      }

      hasAnimating = true
      const elapsed = now - col.startTime
      const progress = Math.min(elapsed / col.duration, 1)

      if (progress < 1) {
        const prevPos = col.currentPos
        const eased = this.easeInOutQuint(progress)
        col.currentPos = col.startPos + (col.targetPos - col.startPos) * eased
        col.velocity = Math.abs(col.currentPos - prevPos)

        const currentIntPos = Math.floor(col.currentPos)
        // 依然检测位置变化，但实际播放由 playTick 的节流逻辑控制
        if (currentIntPos !== col.lastIntPos) {
          shouldPlayTick = true
          col.lastIntPos = currentIntPos
        }
      } else {
        col.currentPos = col.targetPos
        col.isAnimating = false
        col.velocity = 0
      }

      if (col.velocity > maxVelocity) maxVelocity = col.velocity
    })

    if (shouldPlayTick) {
      this.playTick()
    }

    this.updatePointers(maxVelocity)

    return hasAnimating
  }

  /**
   * 更新指针的视觉震动效果
   */
  private updatePointers(speed: number): void {
    if (!this.pLeft || !this.pRight) return

    const angleRange = Math.min(speed * 50, 50)

    if (angleRange > 0.1) {
      const rotL = (Math.random() - 0.5) * angleRange * 2
      const rotR = (Math.random() - 0.5) * angleRange * 2
      this.pLeft.style.transform = `rotate(${rotL}deg)`
      this.pRight.style.transform = `rotate(${rotR}deg)`
    } else {
      this.pLeft.style.transform = `rotate(0deg)`
      this.pRight.style.transform = `rotate(0deg)`
    }
  }

  /**
   * 绘制单列
   */
  private drawColumn(index: number): void {
    const col = this.columns[index]
    const x = index * this.displaySize
    const ctx = this.ctx

    if (!ctx) return

    const floatIdx = col.currentPos % this.sideNumber
    const topIdx = Math.floor(floatIdx)
    const offset = (floatIdx - topIdx) * this.displaySize

    // 模糊效果（速度越快越模糊）
    const blurAmount = Math.min(col.velocity * 6, 8)
    ctx.filter = `blur(${blurAmount}px)`

    // 绘制上下相邻的图块以实现循环滚动视觉
    for (let i = -1; i <= 1; i++) {
      const drawIdx = (topIdx + i + this.sideNumber) % this.sideNumber
      // drawY 是相对于当前列顶部的偏移量
      const drawY = i * this.displaySize - offset

      // 只有在可视区域内才绘制
      if (drawY > -this.displaySize && drawY < this.displaySize) {
        ctx.drawImage(
          this.img,
          0,
          drawIdx * this.sideSize, // Source Y
          this.sideSize, // Source Height
          this.sideSize, // Source Width
          x, // Dest X
          drawY, // Dest Y
          this.displaySize, // Dest Width
          this.displaySize // Dest Height
        )
      }
    }

    ctx.filter = 'none'

    // 绘制上下遮罩阴影，制造立体感
    const grad = ctx.createLinearGradient(x, 0, x, this.displaySize)
    grad.addColorStop(0, 'rgba(0,0,0,0.25)')
    grad.addColorStop(0.25, 'rgba(0,0,0,0)')
    grad.addColorStop(0.75, 'rgba(0,0,0,0)')
    grad.addColorStop(1, 'rgba(0,0,0,0.25)')
    ctx.fillStyle = grad
    ctx.fillRect(x, 0, this.displaySize, this.displaySize)

    // 绘制列分割线
    if (index < this.columnCount - 1) {
      ctx.fillStyle = 'rgba(212, 175, 55, 0.25)'
      ctx.fillRect(x + this.displaySize - 1, 0, 2, this.displaySize)
    }
  }

  /**
   * 渲染循环（按需执行）
   */
  private renderLoop(): void {
    if (!this.isReady || !this.ctx) return

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    const hasAnimating = this.update()

    for (let i = 0; i < this.columnCount; i++) {
      this.drawColumn(i)
    }

    // 绘制外边框
    this.ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)'
    this.ctx.lineWidth = 4
    this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height)

    // 只有在动画进行中时才继续循环
    if (hasAnimating) {
      this.animationFrameId = requestAnimationFrame(() => this.renderLoop())
    } else {
      // 动画完成，停止循环并 resolve Promise
      this.animationFrameId = null
      if (this.resolveAnimation) {
        this.resolveAnimation()
        this.resolveAnimation = null
      }
    }
  }

  /**
   * 初始渲染（仅绘制一次静态画面）
   */
  private renderOnce(): void {
    if (!this.isReady || !this.ctx) return

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    for (let i = 0; i < this.columnCount; i++) {
      this.drawColumn(i)
    }

    // 绘制外边框
    this.ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)'
    this.ctx.lineWidth = 4
    this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height)
  }

  /**
   * 缓动函数
   */
  private easeInOutQuint(t: number): number {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2
  }

  /**
   * 加载音频资源
   */
  async loadAudio(url: string): Promise<void> {
    try {
      const requestUrl = url.startsWith('http') || url.startsWith('./') ? url : `./${url}`
      const response = await fetch(requestUrl)
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

      const arrayBuffer = await response.arrayBuffer()
      this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)
    } catch (e: unknown) {
      console.warn('音频加载失败，转盘将以静音模式运行:', e)
    }
  }

  /**
   * 运行转盘到指定结果
   * @returns Promise，在动画完成时 resolve
   */
  runTo({ column, duration }: RunToOptions): Promise<void> {
    return new Promise<void>((resolve) => {
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume()
      }

      // 如果已有动画在运行，先取消
      if (this.animationFrameId !== null) {
        cancelAnimationFrame(this.animationFrameId)
        this.animationFrameId = null
        // 如果有未完成的 Promise，先 resolve 它
        if (this.resolveAnimation) {
          this.resolveAnimation()
        }
      }

      // 保存新的 resolve 函数
      this.resolveAnimation = resolve

      const now = performance.now()
      const minSpins = 15

      // 注意：这里的 column 参数实际上是目标索引数组 (targetIndices)
      column.forEach((targetIndex, i) => {
        if (i >= this.columns.length) return

        const col = this.columns[i]
        col.startTime = now
        col.duration = duration + i * 200 // 每一列错开停止
        col.startPos = col.currentPos
        col.lastIntPos = Math.floor(col.currentPos)
        col.isAnimating = true

        // 计算目标位置：当前基数 + 最小旋转圈数 + 目标偏移
        const currentBase = Math.ceil(col.startPos / this.sideNumber) * this.sideNumber
        col.targetPos = currentBase + minSpins * this.sideNumber + targetIndex
      })

      // 启动渲染循环
      this.renderLoop()
    })
  }

  /**
   * 按顺序插入节点
   * @param param0
   */
  appendTo(el: HTMLElement) {
    el.classList.add('game-canvas')
    el.appendChild(this.pLeft)
    el.appendChild(this.canvas)
    el.appendChild(this.pRight)
  }

  /**
   * 销毁方法
   * @param param0
   */
  destroy() {
    const key = `${this.option.roomId}_${JSON.stringify(this.option)}`
    gameMap.delete(key)
    console.log('注销类')
  }

  private constructor(option: SpinnerOptions) {
    this.option = option
    const { column, sidesPath, sideNumber, audioPath } = option
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.pLeft = document.createElement('div')
    this.pRight = document.createElement('div')
    this.pLeft.className = 'index-left'
    this.pRight.className = 'index-right'

    this.columnCount = column
    this.sidesPath = sidesPath
    this.sideNumber = sideNumber

    const AudioContextClass = window.AudioContext || Reflect.get(window, 'webkitAudioContext')
    this.audioContext = new AudioContextClass()

    if (audioPath) {
      this.loadAudio(audioPath)
    }

    this.canvas.width = this.displaySize * this.columnCount
    this.canvas.height = this.displaySize

    this.img = new Image()
    this.img.src = this.sidesPath

    // 初始化列状态
    this.columns = Array.from({ length: column }, () => ({
      currentPos: 0,
      lastIntPos: 0,
      targetPos: 0,
      startPos: 0,
      startTime: 0,
      duration: 0,
      isAnimating: false,
      velocity: 0,
    }))

    this.img.onload = () => {
      this.isReady = true
      // 初始化时只绘制一次静态画面
      this.renderOnce()
    }
  }

  public readonly canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D | null
  public readonly pLeft: HTMLElement
  public readonly pRight: HTMLElement

  protected option

  private columnCount: number
  private sidesPath: string
  private sideNumber: number

  // Web Audio API
  private audioContext: AudioContext
  private audioBuffer: AudioBuffer | null = null

  // 频率限制控制
  private lastTickTime: number = 0
  private minTickInterval: number = 45 // ms

  private sideSize: number = 416 // 源图片中每个面的高度
  private displaySize: number = 220 // 显示在 Canvas 上的高度

  private img: HTMLImageElement
  private isReady: boolean = false
  private columns: ColumnState[]

  // 动画控制
  private animationFrameId: number | null = null
  private resolveAnimation: (() => void) | null = null
}
