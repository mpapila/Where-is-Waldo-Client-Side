import { Box, CircularProgress, Typography } from '@mui/material'

function Loading() {
    return (
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', }}>
            <CircularProgress />
            <Typography sx={{ mt: 2, color: 'white' }}>Please wait while the game is loading</Typography>
        </Box>
    )
}

export default Loading