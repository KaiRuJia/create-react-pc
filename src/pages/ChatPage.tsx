import React, { useState, useRef, useEffect } from 'react'
import { Input, Button, List, Avatar, Space, Typography, Spin } from 'antd'
import { SendOutlined, LoadingOutlined } from '@ant-design/icons'
import { streamDeepSeekResponse } from 'src/utils/openaiService'
import './ChatPage.module.less'

const { TextArea } = Input
const { Text } = Typography

// 消息类型定义
interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '你好！我是AI助手，有什么可以帮助你的吗？',
      role: 'assistant',
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentAssistantMessage, setCurrentAssistantMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, currentAssistantMessage])

  // 处理发送消息
  const handleSendMessage = async () => {
    if (!inputValue.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
    }

    // 添加用户消息
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setLoading(true)

    // 准备发送给OpenAI的消息格式
    const openAIMessages = [...messages, userMessage].map(({ role, content }) => ({
      role,
      content,
    }))

    // 生成助手消息ID
    const assistantMessageId = (Date.now() + 1).toString()

    try {
      // 调用流式API
      await streamDeepSeekResponse(
        openAIMessages,
        (chunk: string, fullResponse: string) => {
          // 更新当前助手消息
          setCurrentAssistantMessage(fullResponse)
        },
        (fullResponse: string) => {
          // 完成时，将当前消息添加到消息列表
          setMessages(prev => [
            ...prev,
            {
              id: assistantMessageId,
              content: fullResponse,
              role: 'assistant',
            },
          ])
          setCurrentAssistantMessage('')
          setLoading(false)
        },
        (error: Error) => {
          console.error('API调用失败:', error)
          setMessages(prev => [
            ...prev,
            {
              id: assistantMessageId,
              content: '抱歉，我暂时无法为您提供帮助。请稍后再试。',
              role: 'assistant',
            },
          ])
          setCurrentAssistantMessage('')
          setLoading(false)
        }
      )
    } catch (error) {
      console.error('发送消息失败:', error)
      setLoading(false)
    }
  }

  // 处理回车键发送
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className='chat-container'>
      <div className='chat-header'>
        <Text strong>AI 助手</Text>
      </div>
      
      <div className='chat-messages'>
        <List
          dataSource={messages}
          renderItem={(message) => (
            <List.Item className={`message-item ${message.role}`}>
              <List.Item.Meta
                avatar={
                  <Avatar>
                    {message.role === 'user' ? '我' : 'AI'}
                  </Avatar>
                }
                title={<Text>{message.role === 'user' ? '我' : 'AI助手'}</Text>}
                description={message.content}
              />
            </List.Item>
          )}
        />
        
        {/* 当前正在生成的助手消息 */}
        {currentAssistantMessage && (
          <List>
            <List.Item className='message-item assistant'>
              <List.Item.Meta
                avatar={<Avatar>AI</Avatar>}
                title={<Text>AI助手</Text>}
                description={currentAssistantMessage}
              />
            </List.Item>
          </List>
        )}
        
        {/* 加载动画 */}
        {loading && !currentAssistantMessage && (
          <div className='loading-container'>
            <Spin indicator={<LoadingOutlined spin />} />
            <Text>AI正在思考...</Text>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className='chat-input-container'>
        <TextArea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder='输入您的问题...'
          rows={4}
          disabled={loading}
        />
        <Space className='chat-actions'>
          <Button
            type='primary'
            icon={<SendOutlined />}
            onClick={handleSendMessage}
            loading={loading}
            disabled={!inputValue.trim()}
          >
            发送
          </Button>
        </Space>
      </div>
    </div>
  )
}

export default ChatPage
