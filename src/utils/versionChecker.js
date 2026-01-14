export async function startVersionCheck() {
  // currentVersion = process.env.REACT_APP_VERSION || 'unknown'

  // setInterval(async () => {
  //   try {
  //     const res = await fetch('/version.json')
  //     const { version } = await res.json()
      
  //     if (version !== currentVersion) {
  //       console.log('检测到新版本:', version)
  //       // 可弹窗提示 or 直接刷新
  //       window.location.reload() // 自动刷新
  //     }
  //   } catch (err) {
  //     console.warn('版本检查失败', err)
  //   }
  // }, 60_000) // 每分钟检查一次
  try {
    const res = await fetch('version.json')
    const info = await res.json()
    console.log('Build info:', info)
  } catch (e) {
    console.error('Failed to load version.json')
  }
}