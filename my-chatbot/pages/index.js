// pages/index.js
import React, { useState } from 'react';
import styles from '../styles/Home.module.css'; // Import component-level styles

export default function NewsletterBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showQuickResponses, setShowQuickResponses] = useState(true);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage(input);
      e.preventDefault();
    }
  };

  const sendMessage = async (message) => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    setShowQuickResponses(false);

    const newMessage = { id: Date.now(), text: trimmedMessage, sender: 'user' };
    setMessages(messages => [...messages, newMessage]);
    setInput('');

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: trimmedMessage }),
    });
    const { reply } = await response.json();
    const formattedReply = formatText(reply);

    setMessages(messages => [...messages, { id: Date.now() + 1, text: formattedReply, sender: 'bot' }]);
  };

  const formatText = (text) => {
    if (typeof text !== 'string') {
      return ''; // Return an empty string if text is not a string
    }

    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formattedText = formattedText.split('\n').map(line => {
      if (line.trim().startsWith('* ')) {
        return `<li>${line.trim().substring(2)}</li>`;
      }
      return line;
    }).join('\n');

    if (formattedText.includes('<li>')) {
      formattedText = `<ul>${formattedText}</ul>`;
    }

    return formattedText;
  };

  const renderMessage = (msg) => {
    if (msg.sender === 'bot') {
      return <p key={msg.id} className={styles.botMessage} dangerouslySetInnerHTML={{ __html: msg.text }}></p>;
    } else {
      return <p key={msg.id} className={styles.userMessage}>{msg.text}</p>;
    }
  };

  return (
    <div className={styles.container}>
      <header>
        <h1>Newsletter Bot</h1>
      </header>
      <main>
        <div className={styles.chatArea}>
          {messages.map(msg => renderMessage(msg))}
          {/* Remove or comment out the quick responses section */}
          {/* {showQuickResponses && (
            <div className={styles.quickResponses}>
              <button onClick={() => quickResponse('Hello!')}>Hello</button>
              <button onClick={() => quickResponse('Give a quick tip for a developer')}>Quick Tip</button>
              <button onClick={() => quickResponse('Tell me a joke!')}>Tell a Joke</button>
            </div>
          )} */}
        </div>
        <div className={styles.controls}>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className={styles.input}
          />
          <button onClick={() => sendMessage(input)} className={styles.sendButton}>Send</button>
        </div>
      </main>
    </div>
  );
}
