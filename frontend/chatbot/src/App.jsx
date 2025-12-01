import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Function to render markdown text to HTML
const renderMarkdown = (text) => {
  if (!text) return '';

  // Split by lines to handle lists properly
  const lines = text.split('\n');
  const processedLines = [];
  let inList = false;
  let listType = null; // 'ol' or 'ul'
  let listItems = [];

  const closeList = () => {
    if (listItems.length > 0) {
      const listTag = listType === 'ol' ? 'ol' : 'ul';
      processedLines.push(`<${listTag}>${listItems.join('')}</${listTag}>`);
      listItems = [];
    }
    inList = false;
    listType = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check for numbered list (1. 2. 3. etc.)
    const numberedMatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (numberedMatch) {
      if (!inList || listType !== 'ol') {
        closeList();
        inList = true;
        listType = 'ol';
      }
      listItems.push(`<li>${processInlineMarkdown(numberedMatch[2])}</li>`);
      continue;
    }
    
    // Check for bullet list (- or *)
    const bulletMatch = line.match(/^[-*]\s+(.+)$/);
    if (bulletMatch) {
      if (!inList || listType !== 'ul') {
        closeList();
        inList = true;
        listType = 'ul';
      }
      listItems.push(`<li>${processInlineMarkdown(bulletMatch[1])}</li>`);
      continue;
    }
    
    // Not a list item - close any open list
    if (inList) {
      closeList();
    }
    
    // Process regular line
    if (line) {
      processedLines.push(processInlineMarkdown(line));
    } else {
      processedLines.push('<br />');
    }
  }
  
  // Close any remaining list
  closeList();

  return processedLines.join('\n');
};

// Process inline markdown (bold, italic, etc.)
const processInlineMarkdown = (text) => {
  return text
    // Escape HTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Convert **bold** to <strong> (greedy to handle multiple in one line)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Convert *italic* to <em> (only single asterisks, not part of **)
    .replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>')
    // Convert `code` to <code>
    .replace(/`([^`]+)`/g, '<code>$1</code>');
};

const App = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isChatActive, setIsChatActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    if (!conversationId) {
      setConversationId(Date.now().toString());
    }
  }, [conversationId]);

  const sendMessage = async (event) => {
    event.preventDefault();

    if (message.trim() === '') return;

    setLoading(true);
    const userMessage = message;
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { sender: 'user', text: userMessage },
    ]);
    setMessage('');

    try {
      const response = await fetch(`http://localhost:8000/chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversation_id: conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error('Error with API request');
      }

      const data = await response.json();
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { sender: 'ai', text: data.response },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { sender: 'ai', text: 'Sorry, I encountered an error. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-wrapper">
        {/* Header */}
        <div className="chatbot-header">
          <div className="header-content">
            <div className="header-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
                <path d="M8 9H16V11H8V9ZM8 13H16V15H8V13Z" fill="currentColor" opacity="0.3"/>
              </svg>
            </div>
            <div>
              <h1 className="header-title">InsightX</h1>
              <p className="header-subtitle">Powered by Groq</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div
          ref={chatContainerRef}
          className="chat-messages"
        >
          {chatHistory.length === 0 && (
            <div className="welcome-message">
              <div className="welcome-icon">👋</div>
              <h2>Welcome to InsightX</h2>
              <p>Start a conversation by typing a message below</p>
            </div>
          )}

          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`message-wrapper ${msg.sender === 'user' ? 'user-message' : 'ai-message'}`}
            >
              <div className={`message-bubble ${msg.sender === 'user' ? 'user-bubble' : 'ai-bubble'}`}>
                <div 
                  className="message-text"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }}
                />
              </div>
            </div>
          ))}

          {loading && (
            <div className="message-wrapper ai-message">
              <div className="message-bubble ai-bubble">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        {isChatActive && (
          <form onSubmit={sendMessage} className="chat-input-form">
            <div className="input-wrapper">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="chat-input"
                placeholder="Type your message here..."
                disabled={loading}
              />
              <button
                type="submit"
                className="send-button"
                disabled={loading || !message.trim()}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default App;