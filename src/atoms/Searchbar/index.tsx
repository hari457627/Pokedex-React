import React from "react";
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import SearchIcon from '@mui/icons-material/Search';
import "./style.scss";
import "../../mixins.scss";

interface TextfieldProps {
    label: string,
    value: string | number,
    type: string,
    disabled?: boolean,
    className?: string,
    style?: object,
    onChange?: Function,
    id?: string,
    placeholder?: string,
}

function Searchbar({ label, value, type, onChange, id, className, ...rest }: TextfieldProps) {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange && onChange(e);
    };

    return (
        <div className="action-block-item">
            <label className="action-label" htmlFor={label}>{label}</label>
            <FormControl variant="outlined">
                <OutlinedInput
                    id={id}
                    type={type}
                    value={value}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton disabled color="primary">
                                {<SearchIcon/>}
                            </IconButton>
                        </InputAdornment>
                    }
                    label={''}
                    className={`${className} searchbar`}
                    onChange={handleChange}
                    {...rest}
                />
            </FormControl>
        </div>
    );
}

export default React.memo(Searchbar);