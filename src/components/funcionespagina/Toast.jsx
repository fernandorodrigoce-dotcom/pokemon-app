import { useEffect } from 'react'

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const colors = {
    success: '#4ade80',
    error: '#cc0000',
    warning: '#ffdd00',
  }

  const textColors = {
    success: '#000',
    error: '#fff',
    warning: '#000',
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      background: colors[type],
      color: textColors[type],
      fontFamily: "'Press Start 2P', cursive",
      fontSize: '8px',
      padding: '12px 16px',
      border: '4px solid #000',
      boxShadow: '4px 4px 0 #000',
      zIndex: 9999,
      maxWidth: '280px',
      lineHeight: '1.6',
    }}>
      {message}
    </div>
  )
}

export default Toast