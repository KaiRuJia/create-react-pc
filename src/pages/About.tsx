import { Button } from 'antd'
import { useState } from 'react'

const About = () => {
  const [count, setCount] = useState(0)
  const onAddOne = () => {
    setCount(count + 1)
  }
  const onSubOne = () => {
    setCount(count - 1)
  }
  return (
    <div>
      <h1>About Page</h1>
        <Button onClick={onAddOne}>add one</Button>
        <Button onClick={onSubOne}>sub one</Button>
      <div>{ count }</div>
    </div>
  )
}

export default About