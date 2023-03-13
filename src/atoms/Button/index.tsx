import Button from '@mui/material/Button';
import { ReactNode } from 'react';
import "./style.scss";

interface ButtonProps {
    children?: string | ReactNode,
    disabled?: boolean,
    id?: string,
    className?: string,
    style?: object,
    onClick?: Function,
    endIcon?: ReactNode,
    ariaLabel?: string,
    ariaHaspopup?: string,
    ariaExpanded?: boolean | string,
    ariaDescribedby?: string,
    ariaControls?: string,
};

function ButtonComp({children, className, id, onClick, disabled, style, endIcon, ariaLabel, ...rest}: ButtonProps) {

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick && onClick(e);
    };

    return (
        <Button 
            id={id}
            className={`${className} global-button`}
            onClick={handleClick}
            style={style}
            disabled={disabled}
            endIcon={endIcon}
            disableFocusRipple
            aria-label={ariaLabel}
            {...rest}
        >
            { children }
        </Button>
    )
}

export default ButtonComp;
