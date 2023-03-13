import StatsRange from "../StatsRange";
import Button from "../../atoms/Button";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import "./style.scss";

interface RangeFilterProps {
    statsData: any,
    onChange: Function,
    onReset: Function,
    onApply: Function,
    onClose: Function,
}

function RangeFilter({ statsData, onChange, onReset, onApply, onClose }: RangeFilterProps) {
    return (
        <div className="range-filter-block">
            <div className="range-filter-header-block">
                <div className="range-filter-header">
                    Select Stats
                </div>
                <Button ariaLabel="close stats filter" className="range-filter-header-actions" onClick={onClose}>
                    <HighlightOffIcon />
                </Button>
            </div>
            <div>
                <StatsRange statsData={statsData} onChange={onChange}/>
            </div>
            <div className="range-filter-footer-actions">
                <Button ariaLabel="click to reset filters" onClick={onReset} className="range-filter-footer-actions-reset">
                    Reset
                </Button>
                <Button ariaLabel="click to apply filters" onClick={onApply} className="range-filter-footer-actions-apply">
                    Apply
                </Button>
            </div>
        </div>
    )
};

export default RangeFilter;