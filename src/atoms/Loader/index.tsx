import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

interface LoaderProps {
    className?: string;
    style?: object;
    id?: string;
}

export default function Loader({ className, id, style}: LoaderProps) {
    return (
        <Box sx={{ display: 'flex' }}>
            <CircularProgress  className={className} id={id} style={style}/>
        </Box>
    );
}