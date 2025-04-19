import { Layout, Menu, Select } from 'antd'
import { Outlet, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import BreadcrumbComponent from '../components/Breadcrumb'

const { Header, Content, Sider } = Layout

const BasicLayout = () => {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value)
  }

  const menuItems = [
    {
      key: '/',
      label: t('menu.home')
    },
    {
      key: '/about',
      label: t('menu.about')
    }
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
        <Menu
          theme='dark'
          mode='inline'
          defaultSelectedKeys={['/']}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ 
          padding: '0 16px', 
          display: 'flex', 
          justifyContent: 'flex-end',
          alignItems: 'center' 
        }}>
          <Select
            defaultValue={i18n.language}
            style={{ width: 120 }}
            onChange={handleLanguageChange}
            options={[
              { value: 'zh', label: '中文' },
              { value: 'en', label: 'English' }
            ]}
          />
        </Header>
        <div 
            style={{ 
            padding: '8px 16px', 
            display: 'flex', 
            justifyContent: 'flex-start',
            alignItems: 'center' 
            }}
        ><BreadcrumbComponent /></div>
        <Content style={{ margin: '0px 16px 24px 16px', padding: 24, background: '#fff' }}>
          <div style={{ marginTop: 16 }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default BasicLayout