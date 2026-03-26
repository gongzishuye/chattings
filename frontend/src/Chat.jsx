import { useState, useRef, useEffect } from 'react'
import './Chat.css'

const PROMPT_SUGGESTIONS = [
  '🚀 SpaceX 的星舰计划进展如何？',
  '⚡ Tesla 的自动驾驶技术',
  '🧠 Neuralink 能实现什么？',
  '🌙 什么时候能登上火星？',
  '🤖 AI 的未来会是怎样？'
]

function Chat({ personId = 'elon-musk', personImage = '/images/elon.jpg', personName = 'Elon Musk' }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    setMessages([])
  }, [personId])

  const handlePromptClick = (prompt) => {
    setInput(prompt)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = { role: 'user', content: input }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setIsLoading(true)

    const last10Messages = updatedMessages.slice(-10).map(m => ({ role: m.role, content: m.content }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: last10Messages, person: personId })
      })

      if (!response.ok) throw new Error('Network response was not ok')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = { role: 'assistant', content: '' }

      setMessages(prev => [...prev, assistantMessage])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.type === 'text') {
                assistantMessage.content += data.content
                setMessages(prev => {
                  const updated = [...prev]
                  updated[updated.length - 1] = { ...assistantMessage }
                  return updated
                })
              } else if (data.type === 'error') {
                console.error('API Error:', data.content)
              }
            } catch (err) {
              // Skip malformed JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = {
        role: 'assistant',
        content: '⚠️ 连接失败。请确保后端服务器正在运行，然后重试。'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="chat">
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="welcome-container">
            <div className="welcome-icon">
              <span className="welcome-icon-rocket">🚀</span>
            </div>
            <h1 className="welcome-title">开始与 {personName.toUpperCase()} 对话</h1>
            <p className="welcome-subtitle">
              询问关于 SpaceX、Tesla、人工智能、火星计划，或者任何你感兴趣的前沿话题
            </p>
            <div className="welcome-prompt">
              {PROMPT_SUGGESTIONS.map((prompt, index) => (
                <button
                  key={index}
                  className="prompt-chip"
                  onClick={() => handlePromptClick(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              <div className="message-avatar">
                {message.role === 'user' ? '👤' : <img src={personImage} alt={personName} />}
              </div>
              <div className="message-content">
                {message.content}
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="message assistant">
            <div className="message-avatar"><img src={personImage} alt={personName} /></div>
            <div className="message-content loading">
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input" onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <span className="input-icon">💬</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入你的问题..."
            disabled={isLoading}
          />
        </div>
        <button type="submit" disabled={!input.trim() || isLoading}>
          发送
        </button>
      </form>
    </div>
  )
}

export default Chat