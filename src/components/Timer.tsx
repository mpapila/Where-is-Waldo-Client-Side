import { useEffect } from 'react'
import { IsRunningProps } from '../type';

function Timer({ isRunning, timer, setTimer }: IsRunningProps) {

    useEffect(() => {
        let internalId: ReturnType<typeof setTimeout>;
        if (isRunning) {
            internalId = setInterval(() => setTimer(prevTimer => prevTimer + 1), 10)
        }
        return () => clearInterval(internalId)
    }, [isRunning])

    const minutes = Math.floor((timer % 360000) / 6000);
    const seconds = Math.floor((timer % 6000) / 100);
    const milliSeconds = timer % 100

    return (
        <>
            {minutes.toString().padStart(2, "0")}:
            {seconds.toString().padStart(2, "0")}:
            {milliSeconds.toString().padStart(2, "0")}

        </>
    )
}

export default Timer
