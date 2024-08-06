import { AppBar, Box, Toolbar, Typography } from '@mui/material'
import Timer from './Timer'
import { IsRunningProps } from '../type'


function Navbar({ isRunning, timer, setTimer }: IsRunningProps) {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position='sticky' sx={{ backgroundColor: '#AC1211', margin: 0 }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box component="img" sx={{ display: { xs: 'none', md: 'block' }, maxHeight: '100px', width: 'auto' }} alt="Waldo Logo" src='/wheres-waldo-logo.png' />
                    <Typography variant='h4' sx={{
                        width: '191px', flexGrow: { xs: 1, md: 0 }, textAlign: { xs: 'center', md: 'center' },
                    }}>
                        <Timer isRunning={isRunning} timer={timer} setTimer={setTimer} />
                    </Typography>
                    <Typography sx={{ width: '191px', display: { xs: 'none', md: 'block' } }}></Typography>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default Navbar
