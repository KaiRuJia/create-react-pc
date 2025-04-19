import { Button } from 'antd'
import { useTranslation } from 'react-i18next'

const Home = () => {
  const { t } = useTranslation()
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <Button type='primary'>{t('buttons.primary')}</Button>
    </div>
  )
}

export default Home