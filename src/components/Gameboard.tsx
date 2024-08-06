import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, Modal, Paper, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react';
import DoneIcon from '@mui/icons-material/Done';
import { scoreType, SetIsRunningProps } from '../type';
import Loading from './Loading';

function Gameboard({ setIsRunning, timer }: SetIsRunningProps) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [renderedPicWidth, setRenderedPicWidth] = useState(0)
    const [oriPicWidth, setOriPicWidth] = useState(0)
    const [findMiniOne, setFindMiniOne] = useState(false)
    const [findMiniTwo, setFindMiniTwo] = useState(false)
    const [findMiniThree, setFindMiniThree] = useState(false)
    const [isGameOver, setIsGameOver] = useState(false)
    const [showScoreboard, setShowScoreboard] = useState(false)
    const [scores, setScores] = useState<scoreType[]>([])
    const [loading, setLoading] = useState(true)
    const minutes = Math.floor((timer % 360000) / 6000);
    const seconds = Math.floor((timer % 6000) / 100);
    const milliSeconds = timer % 100
    const sortedScores = [...scores].sort((a, b) => a.score - b.score);
    const bestScore = sortedScores[0]?.score || Infinity;

    // const URL = 'http://localhost:3000'
    const apiUrl = import.meta.env.VITE_API_URL

    // Create a new image object to get the original width of the image
    const img = new Image()
    img.onload = function () {
        setOriPicWidth(img.width)
    }
    img.src = `/waldo.jpg`;


    useEffect(() => {
        fetch(`${apiUrl}/scoreboard`)
            .then(response => response.json())
            .then(data => {
                setScores(data);
                // console.log('Fetched data:', data)
                setLoading(false)
                setIsRunning(true)
            })
    }, [])


    // Effect hook to handle window resize and image rendering
    useEffect(() => {
        const renderedWidth = document.getElementById("waldoPic")?.clientWidth
        if (!renderedWidth || renderedWidth == 0) {
            location.reload(); // Reload the page if the rendered width is not available or zero
        }
        if (!renderedWidth) return
        setRenderedPicWidth(renderedWidth)

        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [windowWidth])

    const ratio = oriPicWidth / renderedPicWidth

    const minute = minutes.toString().padStart(2, "0")
    const second = seconds.toString().padStart(2, "0")
    const milliSecond = milliSeconds.toString().padStart(2, "0")

    const formatTime = (milliseconds: number) => {
        const minutes = Math.floor((milliseconds % 360000) / 6000);
        const seconds = Math.floor((milliseconds % 6000) / 100);
        const millis = milliseconds % 100;

        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${millis.toString().padStart(2, '0')}`;
    };


    const handleClick = async (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        const target = e.currentTarget;
        const rect = target.getBoundingClientRect()
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        // console.log(`X: ${x} Y: ${y}`)
        const renderedX = x * ratio
        const renderedY = y * ratio


        const body = {
            renderedX,
            renderedY
        }
        const bodyString = JSON.stringify(body)
        const headers = {
            "Content-Type": "application/json",
        }

        const options = {
            body: bodyString,
            method: "POST",
            headers,
        }
        const response = await fetch(`${apiUrl}/checkPosition`, options)
        const responsePayload = await response.json();
        // console.log('responsePayload', responsePayload)
        // console.log(responsePayload.picture, 'responsePayload.picture')

        if (responsePayload.picture == 'miniOne') {
            // console.log('MiniOne has been found')
            setFindMiniOne(true)
        } else if (responsePayload.picture == 'miniTwo') {
            // console.log('MiniTwo has been found')
            setFindMiniTwo(true)
        } else if (responsePayload.picture == 'miniThree') {
            // console.log(findMiniThree, 'Mini Three has been found')
            setFindMiniThree(true)
        }

    }
    // Use an effect to update the isRunning state based on the mini character states to prevent the bad setState() call
    useEffect(() => {
        if (findMiniOne && findMiniTwo && findMiniThree) {
            setIsRunning(false);
            setIsGameOver(true);
        }
    }, [findMiniOne, findMiniTwo, findMiniThree, setIsRunning]);

    // update the scoreboard
    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget)
        const name = data.get('name')
        if (typeof name === 'string') {
            const lowercaseName = name.toLowerCase()
            const body = {
                name: lowercaseName,
                time: timer
            }
            const bodyString = JSON.stringify(body)
            const response = await fetch(`${apiUrl}/gameboard`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: bodyString
            })

            // console.log(`${bodyString}`)

            const result = await response.json()
            console.log('result', result.message)
            setIsGameOver(false)
            setShowScoreboard(true)

            fetch(`${apiUrl}/scoreboard`)
                .then(response => response.json())
                .then(data => {
                    setScores(data);
                    // console.log('Fetched data:', data)
                })
        }
    }



    return (
        <>
            {loading && (<Loading />)}
            {showScoreboard && (
                <>
                    <Modal open={showScoreboard} aria-labelledby="scoreboard-modal-title" aria-describedby="scoreboard-modal-description">
                        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '30%', bgcolor: 'background.paper', borderRadius: 1, boxShadow: 24, p: 4, }}
                        >
                            <DialogTitle sx={{ marginBottom: 3, display: { xs: 'none', sm: 'block' }, fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', bgcolor: 'primary.main', color: 'primary.contrastText', borderBottom: 1, borderColor: 'divider' }}>
                                Scores
                            </DialogTitle>
                            <Grid container spacing={2}>
                                {sortedScores.map(score => (
                                    <Grid item xs={12} key={score.id}>
                                        <Paper elevation={3} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: score.score === bestScore ? 'gold' : 'white', borderRadius: 1, }} >
                                            <Typography variant="body1">
                                                {score.name.charAt(0).toUpperCase() + score.name.slice(1)}
                                            </Typography>
                                            <Typography variant="body1" fontWeight='bold'>
                                                {formatTime(score.score)}
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', width: '100%' }}>
                                <Button sx={{ mt: '10px' }} variant="contained" color="primary" onClick={() => window.location.reload()} >
                                    Refresh
                                </Button>
                            </Box>
                        </Box>
                    </Modal>

                </>
            )}
            {isGameOver && (
                <>
                    <Dialog open={isGameOver} maxWidth="sm" fullWidth PaperProps={{
                        component: 'form',
                        onSubmit: handleFormSubmit,
                        sx: { bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3, }
                    }}>
                        <DialogTitle sx={{ display: { xs: 'none', sm: 'block' }, fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', bgcolor: 'primary.main', color: 'primary.contrastText', borderBottom: 1, borderColor: 'divider' }}>
                            Congratulations!
                        </DialogTitle>
                        <DialogContent sx={{ textAlign: 'center', paddingY: 3 }}>
                            <Typography sx={{ typography: { xs: 'body1', sm: 'h4' }, fontWeight: 'bold', mb: 2 }} >
                                You Won!
                            </Typography>
                            <Typography sx={{ typography: { xs: 'body1', sm: 'h3' }, color: 'text.secondary' }}>
                                Your Time is:
                            </Typography>
                            <Typography sx={{ typography: { xs: 'body1', sm: 'h3' }, fontWeight: 'bold', color: 'primary.main', mt: 1 }}
                            >
                                {minute}:
                                {second}:
                                {milliSecond}
                            </Typography>
                            <Typography sx={{ typography: { xs: 'body1', sm: 'h4' }, mt: 3, mb: 2 }}>
                                Enter your name for scoreboard
                            </Typography>
                            <Box component='div' display='flex' flexDirection='column' alignItems='center'>
                                <TextField autoFocus required margin='dense' id='name' label='Your Name' name='name' />
                                <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2, maxWidth: '30%' }}> Submit</Button>
                            </Box>
                        </DialogContent>
                    </Dialog>
                </>
            )}
            windowWidth: {windowWidth} <br />
            renderedPicWidth: {renderedPicWidth}<br />
            oriPicWidth: {oriPicWidth}<br />
            <Box width='auto' display='flex' flexDirection='row' maxWidth='100%'>
                <Box component='img' alt="Waldo Gameboard" id='waldoPic' src='/waldo.jpg' height='100%' maxWidth='90%' onClick={handleClick} />
                <Box
                    display='flex'
                    flexDirection='column'
                    justifyContent='center'
                    alignItems='center'
                    gap={1}
                    sx={{ flex: '1 1 auto', maxWidth: '100%' }}
                >
                    <Box sx={{ position: 'relative', display: 'inline-block', maxWidth: '200px', width: '100%' }}>
                        <Box
                            component='img'
                            alt="Overlay Image 1"
                            src='/mini1.jpg'
                            sx={{ objectFit: 'contain', width: '100%', border: '1px solid black' }}
                        />
                        {findMiniOne && (
                            <>
                                <Box sx={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', zIndex: 1, }} />
                                <DoneIcon sx={{ fontSize: { xs: '150%', sm: '55px', md: '90px', lg: '130px' }, position: 'absolute', top: '8px', right: '8px', color: 'red', zIndex: 2 }} />
                            </>
                        )}
                    </Box>


                    <Box sx={{ position: 'relative', display: 'inline-block', maxWidth: '200px', width: '100%' }}>
                        <Box component='img' alt="Overlay Image 2" src='/mini2.jpg' sx={{ objectFit: 'contain', width: '100%', border: '1px solid black' }} />
                        {findMiniTwo && (
                            <>
                                <Box sx={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', zIndex: 1, }} />
                                <DoneIcon sx={{ fontSize: { xs: '150%', sm: '55px', md: '90px', lg: '130px' }, position: 'absolute', top: '8px', right: '8px', color: 'red', zIndex: 2 }} />
                            </>
                        )}
                    </Box>



                    <Box sx={{ position: 'relative', display: 'inline-block', maxWidth: '200px', width: '100%' }}>
                        <Box component='img' alt="Overlay Image 3" src='/mini3.jpg' sx={{ objectFit: 'contain', width: '100%', border: '1px solid black' }} />
                        {findMiniThree && (
                            <>
                                <Box sx={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', zIndex: 1, }} />
                                <DoneIcon sx={{ fontSize: { xs: '150%', sm: '55px', md: '90px', lg: '130px' }, position: 'absolute', top: '8px', right: '8px', color: 'red', zIndex: 2 }} />
                            </>
                        )}
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default Gameboard
