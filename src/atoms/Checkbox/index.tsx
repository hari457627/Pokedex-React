import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

interface CheckboxProps {
    checked: boolean,
    label: string,
    disabled?: boolean,
    className?: string,
    style?: object,
    id?: string,
    value?: string,
    onChange?: (event: any) => void,
    name?: string,
}

function CheckboxComponent({checked, id, ...rest}: CheckboxProps) {
    return (
        <FormGroup>
            <FormControlLabel control={<Checkbox checked={checked} name={id}/>} {...rest}/>
        </FormGroup>
    );
}

export default CheckboxComponent;