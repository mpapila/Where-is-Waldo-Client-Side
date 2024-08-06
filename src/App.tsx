import { Container } from '@mui/material'
import './App.css'
import Navbar from './components/Navbar'
import Gameboard from './components/Gameboard'
import { useState } from 'react'

function App() {
  const [isRunning, setIsRunning] = useState(false)
  const [timer, setTimer] = useState(0)



  return (
    <Container>
      <Navbar isRunning={isRunning} timer={timer} setTimer={setTimer} />
      <Gameboard setIsRunning={setIsRunning} timer={timer} />
    </Container>
  )
}

export default App
