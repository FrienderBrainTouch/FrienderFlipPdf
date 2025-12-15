import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { ChatbotProvider } from './hooks/useChatbot'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ChatbotProvider>
        <App />
      </ChatbotProvider>
    </BrowserRouter>
  </StrictMode>,
)
