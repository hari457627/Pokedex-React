import Checkbox from "../../atoms/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import "./style.scss";

interface MultiSelectProps {
    label: string,
    disabled?: boolean,
    className?: string,
    style?: object,
    onChange?: Function,
    id?: string,
    options: Array<{label: string, value: string }>,
    selected: Array<string>,
    labelId?: string,
}

function MultiSelect({options, label, disabled, onChange, className, id, labelId, selected, ...rest}: MultiSelectProps) {

  const handleChange = (event: any) => {
    onChange && onChange(event);
  };

  const renderValue = (arr: Array<string>) => {
    if(!arr.length) return '';
    return (
      <span className="label-2">{arr[0]} <strong>{(arr.length > 1) ? `+ ${arr.length - 1} more` : ''}</strong></span>
    )
  }

  return (
    <div className="action-block-item">
      <label className="action-label" id={labelId}>{label}</label>
      <Select
        id={id}
        name={id}
        multiple
        value={selected}
        onChange={handleChange}
        renderValue={(selected) => renderValue(selected)}
        className={`${className} action-multi-select-item`}
        {...rest}
      >
        {options.map((option) => {
            const { label, value } = option;
            return (
                <MenuItem className="action-multi-select-menu-item-block" key={value} value={value}>
                    <div className="action-multi-select-menu-item">
                      <div className="action-multi-select-menu">
                        <ListItemIcon className="action-multi-select-menu-item-icon">
                          <Checkbox checked={selected.indexOf(value) > -1} label={''}/>
                        </ListItemIcon>
                        <ListItemText primary={label} />
                      </div>
                      <hr/>
                    </div>
                </MenuItem>
              )
        })}
      </Select>
    </div>
  );
}

export default MultiSelect;