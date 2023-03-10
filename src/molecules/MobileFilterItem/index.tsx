import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Checkbox from "../../atoms/Checkbox";
import StatsRange from "../../components/StatsRange";
import { useState } from 'react';
import './style.scss';

interface MobileFilterItemProps {
    id?: string,
    className?: string,
    label: string,
    data: any,
    selected?: any,
    onChange: Function,
    renderSlider: boolean,
}

function MobileFilterItem({ id, className, label : labelId, data, selected, onChange, renderSlider }: MobileFilterItemProps){
    const [open, setOpen] = useState(false);

    const onChangeAccordion = (e:any, isOpen:boolean) => {
        setOpen(isOpen); 
    };

    const handleChange = (event: any) => {
        onChange && onChange(event);
    };

    const renderValue = (arr: any) => {
        arr = Array.isArray(arr) ? arr : Object.keys(arr);
        if(!arr.length) return '';
        return (
          <span className="label-2">({arr[0].label || arr[0]} <strong>{(arr.length > 1) ? `+ ${arr.length - 1} more` : ''}</strong>)</span>
        )
    }

    return (
        <div className='mobile-filter-item-block'>
            <Accordion className='accordion-block' onChange={onChangeAccordion}>
                <AccordionSummary
                    expandIcon={<div></div>}
                    aria-controls="id"
                    id={id}
                    className={className}
                >
                    <div className='accordion-header'>
                        <div className='accordion-header-title'>
                            {labelId}
                        </div>
                        <div className='accordion-header-value'>
                            {renderValue(data)}
                        </div>
                        <div className='accordion-header-icon'>
                            { open ? <RemoveCircleOutlineIcon /> : <AddCircleOutlineIcon /> }
                        </div>
                    </div>
                </AccordionSummary>
                <AccordionDetails>
                    <div className='accordion-content-fields'>
                        {
                            !renderSlider ? data.map((option:any) => {
                                const { label, value } = option;
                                return (
                                    <Checkbox className='accordion-content-checkbox-field' name={labelId} checked={selected.indexOf(value) > -1} label={label} value={value} onChange={handleChange}/>
                                )
                            })
                            :
                            <StatsRange statsData={data} onChange={onChange}/>
                        }
                    </div>
                </AccordionDetails>
            </Accordion>
        </div>
    )
}

export default MobileFilterItem;