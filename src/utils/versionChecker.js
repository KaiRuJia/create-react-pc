let currentVersion = null

export function startVersionCheck() {
  // 从当前页面 meta 或 JS 变量获取构建时版本（也可从 window.__BUILD_INFO__ 注入）
  currentVersion = process.env.REACT_APP_VERSION || 'unknown'

  setInterval(async () => {
    try {
      const res = await fetch('/version.json?t=' + Date.now())
      const { version } = await res.json()
      
      if (version !== currentVersion) {
        console.log('检测到新版本:', version)
        // 可弹窗提示 or 直接刷新
        window.location.reload() // 自动刷新
      }
    } catch (err) {
      console.warn('版本检查失败', err)
    }
  }, 60_000) // 每分钟检查一次
}