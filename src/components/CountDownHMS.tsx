import { useEffect, useRef, useState } from 'react'
import _ from 'lodash'

const CountDownHMS = ({ endTime }: { endTime: string }) => {
  const [count, setCount] = useState<number>(() => {
    const _endTime: Date = new Date(endTime)
    const nowTime: Date = new Date()
    const diffMs: number = _endTime.getTime() - nowTime.getTime()
    if (diffMs <=0 ) return 0
    return Math.floor(diffMs/1000) // ms 转为s
  })
  const timerRef = useRef<number | null>(null)


  useEffect(() => {
    timerRef.current && window.clearInterval(timerRef.current)
    timerRef.current = window.setInterval(() => {
      setCount(pre => {
        if (pre <= 0) {
          timerRef.current && window.clearInterval(timerRef.current)
          return pre
        }
        return pre - 1
      })
    }, 1000)
    return () => {
      timerRef.current && window.clearInterval(timerRef.current)
    }
  }, [])

  const formatTime = (count: number) => {
    const h = Math.floor(count/3600)
    const m = Math.floor((count % 3600)/60)
    const s = Math.floor(count %60)
    return [h, m, s].map((v) => v.toString().padStart(2, '0')).join(':')
  }
  return (
    <>
      <h1>倒计时：{formatTime(count)}</h1>
    </>
  )
}

export default CountDownHMS