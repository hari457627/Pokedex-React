import Button from "../../atoms/Button";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import MobileFilterItem from "../../molecules/MobileFilterItem";
import "./style.scss";

interface MobileFilterProps {
    typesMasterData: any,
    genderMasterData: any,
    selectedGenders: any,
    selectedTypes: any
    statsData: any,
    onChange: Function,
    onStatsChange: Function,
    onClose: Function,
    onReset: Function,
    onApply: Function
}

const arr = ['Type', 'Gender', 'Stats'];

function MobileFilter({ typesMasterData, genderMasterData, selectedGenders, selectedTypes, statsData, onChange, onClose, onReset, onApply, onStatsChange }: MobileFilterProps) {
    return (
        <div style={{position: 'relative', minHeight: '100svh'}}>
            <div className="mobile-filter-block">
                <div className="mobile-filter-header-block">
                    <div className="mobile-filter-header">
                        Filters
                    </div>
                    <Button className="range-filter-header-actions" onClick={onClose}>
                        <HighlightOffIcon />
                    </Button>
                </div>
                <div className="mobile-filter-content-block">
                    {
                        arr.map((item: string) => {
                            const data = (item === 'Type') ? typesMasterData : (item === 'Gender') ? genderMasterData : statsData;
                            const selected = (item === 'Type') ? selectedTypes : (item === 'Gender') ? selectedGenders : null;
                            const isStats = (item === 'Stats');
                            return (
                                <MobileFilterItem renderSlider={isStats} label={item} onChange={isStats ? onStatsChange : onChange} data={data} selected={selected} />
                            );
                        })
                    }
                </div>
            </div>
            <div className="range-filter-footer-actions mobile-filter-footer-block">
                <Button ariaLabel="click to reset filters" onClick={onReset} className="range-filter-footer-actions-reset">
                    Reset
                </Button>
                <Button ariaLabel="click to apply filters" onClick={onApply} className="range-filter-footer-actions-apply">
                    Apply
                </Button>
            </div>
        </div>
    )
}

export default MobileFilter;