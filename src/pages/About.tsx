import CountDownS from 'src/components/CountDownS'
import CountDownHMS from 'src/components/CountDownHMS'

const About = () => {
  return (
    <div>
     <CountDownS />
     <CountDownHMS endTime='2025-12-16 21:50:00'/>
    </div>
  )
}

export default About