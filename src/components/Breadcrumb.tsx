import { Breadcrumb } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const BreadcrumbComponent = () => {
  const location = useLocation()
  const { t } = useTranslation()
  
  const pathSnippets = location.pathname.split('/').filter((i: any) => i)
  
  const breadcrumbItems = [
    {
      title: <Link to='/'>{t('menu.home')}</Link>
    },
    ...pathSnippets.map((_: any, index: number) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`
      const key = pathSnippets[index]
      return {
        title: <Link to={url}>{t(`menu.${key}`)}</Link>
      }
    })
  ]

  return <Breadcrumb items={breadcrumbItems} />
}

export default BreadcrumbComponent