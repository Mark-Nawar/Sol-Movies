
import { useEffect, useState } from 'react'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import './styles/confirmed.css';

function Confirmed() {
  const [percentage, setPercentage] = useState(0)
  const [text, setText] = useState('🍪')

  useEffect(() => {
    const t1 = setTimeout(() => setPercentage(100), 100)
    const t2 = setTimeout(() => setText('✅'), 600)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  return (
    <CircularProgressbar
      value={percentage}
      text={text}
      styles={buildStyles({
        pathColor: '#00BA00',
      })}
    />
  )
}

export default function ConfirmedPage() {
  return (
    <div className="confirmed">
      <a href="/">Movies</a>

      <div className='thank-you'>
        Thank you for booking with us
      </div>

      <div className="h-80 w-80">
        <Confirmed />
      </div>
    </div>
  )
}
