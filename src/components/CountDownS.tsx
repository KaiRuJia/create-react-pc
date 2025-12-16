import { useEffect, useRef, useState } from 'react'
import { Button, Space } from 'antd'
import _ from 'lodash'

const initCount = 60
const CountDownS = () => {
  const [count, setCount] = useState<number>(initCount)
  const [isRun, setIsRun] = useState<boolean>(false)
  const timerRef = useRef<number | null>(null)


  useEffect(() => {
    if (isRun) {
      timerRef.current = window.setInterval(() => {
        setCount(pre => {
          if (pre === 0) {
            timerRef.current && window.clearInterval(timerRef.current)
            return pre
          }
          return pre - 1
        })
      }, 1000)
    }
    return () => {
      timerRef.current && window.clearInterval(timerRef.current)
    }
  }, [isRun])

  const onStart = _.debounce(() => {
    setIsRun(true)
  }, 500)

  const onReset = () => {
    setIsRun(false)
    setCount(initCount)
    timerRef.current && window.clearInterval(timerRef.current)
  }
  return (
    <>
      <h1>倒计时：{count} s</h1>
      <Space>
        <Button type='primary' onClick={() => onStart()} disabled={isRun}>开始</Button>
        <Button onClick={() => onReset()}>重置</Button>
      </Space>
    </>
  )
}

export default CountDownS