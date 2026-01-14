// import axios from 'axios'

// DeepSeek API 配置
const DEEPSEEK_API_KEY = 'sk-676648b275784f42aa068ad8506d3d9a'
// const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

/**
 * 调用 DeepSeek API 进行流式响应
 * @param {Array<{role: 'user' | 'assistant', content: string}>} messages - 聊天消息数组
 * @param {Function} onChunk - 接收流式数据的回调函数
 * @param {Function} onComplete - 完成时的回调函数
 * @param {Function} onError - 错误时的回调函数
 */
export const streamDeepSeekResponse = async (
  messages,
  onChunk,
  onComplete,
  onError
) => {
  try {
    const response = await fetch(
      'https://api.deepseek.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: messages,
          stream: true,
          temperature: 0.7, 
        })
      }
    )
    if (!response.ok || !response.body) { 
      throw new Error('DeepSeek API 调用失败')
    }
    // 创建一个解码器，用于将二进制数据转换为文本
    const decoder = new TextDecoder()
    // 设置流的读取器
    const reader = response.body.getReader()
    let fullResponse = ''
    
    // 循环读取流数据
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      // 将二进制数据解码为文本
      const chunk = decoder.decode(value, { stream: true })
      // 分割数据块，处理每一行
      const lines = chunk.split('\n').filter(line => line.trim() !== '')
      
      for (const line of lines) {
        // 移除 'data: ' 前缀
        const data = line.replace(/^data: /, '')
        
        // 检查是否到达流的末尾
        if (data === '[DONE]') {
          onComplete(fullResponse)
          return
        }
        
        try {
          // 解析 JSON 数据
          const json = JSON.parse(data)
          const content = json.choices[0]?.delta?.content || ''
          fullResponse += content
          
          // 调用回调函数，传递新的内容
          onChunk(content, fullResponse)
        } catch (error) {
          console.error('解析 DeepSeek 响应失败:', error)
        }
      }
    }

    onComplete(fullResponse)
  } catch (error) {
    console.error('DeepSeek API 调用失败:', error)
    onError(error)
  }
}
