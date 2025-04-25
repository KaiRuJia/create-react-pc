import React from 'react'
import { useNavigate } from 'react-router-dom'
import request from '../utils/request'
import { Form, Input, Button, Checkbox } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import styles from './LoginPage.module.less'

const LoginPage = () => {
  const navigate = useNavigate()

  const onFinish = async (values: any) => {
    navigate('/home')
    localStorage.setItem('token', 'asdfasdfasdfasdfqreqwerqwrq3233245')
    try {
      const response: any = await request.post('/api/login', values)
      localStorage.setItem('token', response.token)
      navigate('/home')
    } catch (error) {
      console.error('登录失败:', error)
    }
  }

  return (
    <div className={styles['login-container']}>
      <div className={styles['left-section']}>
        <div className={styles['devices-image']}>
          {/* 这里可以添加设备图片 */}
          <img src='/devices.png' alt='devices' />
        </div>
        <h2>XXXXXXXX</h2>
        <p>XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</p>
        <p>XXXXXXXXXXX</p>
      </div>
      <div className={styles['right-section']}>
        <h1 className={styles.title}>欢迎登录</h1>
        <Form
          name='login'
          onFinish={onFinish}
          autoComplete='off'
          className={styles['styled-form']}
        >
          <Form.Item
            name='username'
            rules={[{ required: true, message: '请输入账号!' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder='请输入账号'
              size='large'
            />
          </Form.Item>
          <Form.Item
            name='password'
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder='请输入密码'
              size='large'
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name='remember' valuePropName='checked' noStyle>
              <Checkbox>记住密码</Checkbox>
            </Form.Item>
            <a style={{ float: 'right' }} href='/forgot-password'>
              忘记密码
            </a>
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit' size='large'>
              登 录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default LoginPage