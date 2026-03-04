import { useState, useEffect } from 'react'

const SIZE = 3

const createBoard = () => {
  const nums = [...Array(SIZE * SIZE).keys()]
  for (let i = nums.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nums[i], nums[j]] = [nums[j], nums[i]]
  }
  return nums
}

const isSolved = (board) => board.every((val, idx) => val === idx)

const SlidingPuzzle = ({ imageUrl, onSolved }) => {
  const [board, setBoard] = useState(createBoard)
  const [solved, setSolved] = useState(false)

  useEffect(() => {
    if (isSolved(board)) {
      setSolved(true)
      onSolved()
    }
  }, [board])

  const move = (idx) => {
    const emptyIdx = board.indexOf(0)
    const row = Math.floor(idx / SIZE)
    const col = idx % SIZE
    const emptyRow = Math.floor(emptyIdx / SIZE)
    const emptyCol = emptyIdx % SIZE

    const sameRow = row === emptyRow
    const sameCol = col === emptyCol

    if (!sameRow && !sameCol) return

    const newBoard = [...board]

    if (sameRow) {
      const step = col < emptyCol ? 1 : -1
      for (let c = emptyCol; c !== col; c -= step) {
        const from = row * SIZE + (c - step)
        const to = row * SIZE + c
        newBoard[to] = newBoard[from]
      }
      newBoard[idx] = 0
    } else {
      const step = row < emptyRow ? 1 : -1
      for (let r = emptyRow; r !== row; r -= step) {
        const from = (r - step) * SIZE + col
        const to = r * SIZE + col
        newBoard[to] = newBoard[from]
      }
      newBoard[idx] = 0
    }

    setBoard(newBoard)
  }

  const pieceSize = 100

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '7px', color: '#aaa', textAlign: 'center' }}>
        HAZ CLIC PARA MOVER PIEZAS
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${SIZE}, ${pieceSize}px)`,
        gap: '3px',
        border: '4px solid #000',
        boxShadow: '4px 4px 0 #000',
        padding: '3px',
        background: '#000',
      }}>
        {board.map((val, idx) => {
          const isBlank = val === 0
          const srcRow = Math.floor(val / SIZE)
          const srcCol = val % SIZE

          return (
            <div
              key={idx}
              onClick={() => move(idx)}
              style={{
                width: pieceSize,
                height: pieceSize,
                backgroundImage: isBlank ? 'none' : `url(${imageUrl})`,
                backgroundSize: `${SIZE * pieceSize}px ${SIZE * pieceSize}px`,
                backgroundPosition: `-${srcCol * pieceSize}px -${srcRow * pieceSize}px`,
                backgroundColor: isBlank ? '#1a1a2e' : '#fff',
                cursor: isBlank ? 'default' : 'pointer',
                imageRendering: 'pixelated',
                border: isBlank ? '2px dashed #333' : 'none',
                transition: 'all 0.1s',
              }}
            />
          )
        })}
      </div>

      {solved && (
        <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '8px', color: '#4ade80' }}>
          PUZZLE RESUELTO
        </p>
      )}

      <button
        onClick={() => { setBoard(createBoard()); setSolved(false) }}
        style={{
          fontFamily: "'Press Start 2P', cursive",
          fontSize: '6px',
          color: '#fff',
          background: '#444',
          border: '3px solid #000',
          boxShadow: '3px 3px 0 #000',
          padding: '6px 12px',
          cursor: 'pointer',
        }}
      >
        REINICIAR
      </button>
    </div>
  )
}

export default SlidingPuzzle