import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import "./style.scss";

interface LinearProgressProps2 {
    id?: string,
    className?: string,
    value: number,
}

function LinearProgressWithLabel(props: LinearProgressProps2 & { value: number }) {
    const { className, value } = props;
    return (
        <Box className="lineasr-progress-block" sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" className={`${className} linear-progres`} {...props} value={Math.round((100 / 210) * value)}/>
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography className='linear-progress-value' variant="body2" color="text.secondary">{value}</Typography>
            </Box>
        </Box>
    );
}

function LinearProgressComponent({ value, id, className }: LinearProgressProps2) {
    return (
        <Box sx={{ width: '100%' }}>
            <LinearProgressWithLabel value={value} id={id} className={className}/>
        </Box>
    )
}

export default LinearProgressComponent;