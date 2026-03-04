import { useState, useRef, useEffect } from 'react'

const font = "'Press Start 2P', cursive"

let sharedCtx = null

const getCtx = () => {
  if (!sharedCtx) sharedCtx = new (window.AudioContext || window.webkitAudioContext)()
  if (sharedCtx.state === 'suspended') sharedCtx.resume()
  return sharedCtx
}

const playMsgSound = (isMine) => {
  try {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'square'
    osc.frequency.setValueAtTime(isMine ? 880 : 660, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(isMine ? 1100 : 440, ctx.currentTime + 0.08)
    gain.gain.setValueAtTime(0.12, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.15)
  } catch(e) { console.warn('audio error', e) }
}

const BattleChat = ({ messages, onSend, myUid }) => {
  const [text, setText] = useState('')
  const containerRef = useRef(null)
  const isFirstRender = useRef(true)
  const prevLengthRef = useRef(0)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      prevLengthRef.current = messages?.length || 0
      return
    }
    const el = containerRef.current
    if (!el) return
    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60
    if (isAtBottom) el.scrollTop = el.scrollHeight
    // Sound for incoming messages (not sent by me)
    if (messages && messages.length > prevLengthRef.current) {
      const lastMsg = messages[messages.length - 1]
      if (lastMsg?.uid !== myUid) playMsgSound(false)
    }
    prevLengthRef.current = messages?.length || 0
  }, [messages])

  const handleSend = () => {
    if (!text.trim()) return
    playMsgSound(true)
    onSend(text)
    setText('')
    setTimeout(() => { if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight }, 50)
  }

  return (
    <div style={{ width:'100%',display:'flex',flexDirection:'column',gap:'10px' }}>
      <p style={{ fontFamily:font,fontSize:'9px',color:'#ffdd00' }}>★ CHAT ★</p>

      <div ref={containerRef} style={{ background:'rgba(0,0,0,0.4)',border:'3px solid #444',padding:'12px',height:'200px',overflowY:'auto',display:'flex',flexDirection:'column',gap:'12px' }}>
        {!messages || messages.length === 0 ? (
          <p style={{ fontFamily:font,fontSize:'8px',color:'#555' }}>SIN MENSAJES AUN...</p>
        ) : (
          messages.map((msg,i) => (
            <div key={i} style={{ display:'flex',flexDirection:'column',alignItems:msg.uid===myUid?'flex-end':'flex-start',gap:'5px' }}>
              <p style={{ fontFamily:font,fontSize:'8px',color:'#aaa' }}>{msg.uid===myUid?'TU':msg.name?.toUpperCase().slice(0,8)}</p>
              <div style={{ background:msg.uid===myUid?'rgba(68,68,204,0.7)':'rgba(255,255,255,0.08)',border:msg.uid===myUid?'2px solid #4444cc':'2px solid #555',padding:'12px 16px',maxWidth:'75%' }}>
                <p style={{ fontFamily:font,fontSize:'10px',color:'#fff',lineHeight:2 }}>{msg.text}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ display:'flex',gap:'8px' }}>
        <input type='text' value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key==='Enter' && handleSend()}
          placeholder='MENSAJE...' maxLength={100}
          style={{ flex:1,background:'#1a1a2e',color:'#ffdd00',fontFamily:font,fontSize:'8px',padding:'12px',border:'4px solid #000',outline:'none' }}
        />
        <button onClick={handleSend}
          style={{ fontFamily:font,fontSize:'12px',color:'#000',background:'#ffdd00',border:'4px solid #000',boxShadow:'4px 4px 0 #000',padding:'12px 18px',cursor:'pointer' }}
          onMouseDown={e => e.currentTarget.style.boxShadow='1px 1px 0 #000'}
          onMouseUp={e => e.currentTarget.style.boxShadow='4px 4px 0 #000'}
        >&#9654;</button>
      </div>
    </div>
  )
}

export default BattleChat