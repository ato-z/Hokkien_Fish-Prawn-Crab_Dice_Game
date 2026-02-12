/**
 * 游戏通用背景
 */
export const BackgroundCommon = () => (
  <div className="fixed inset-0 z-0 overflow-hidden bg-body">
    {/* 噪点纹理: 增加胶片质感 */}
    <div
      className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }}
    />

    {/* 动态光斑 - 使用配置的 brand 颜色 */}
    <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-brand/40 rounded-full blur-[120px] animate-pulse-slow" />
    <div className="absolute top-[40%] -right-[10%] w-[60vw] h-[60vw] bg-brand-strong/10 rounded-full blur-[100px]" />
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-75 bg-linear-to-t from-black via-body/80 to-transparent" />
  </div>
)
