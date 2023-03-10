import RangeSlider from "../../molecules/RangeSlider";
import "./style.scss";

interface StatsRangeProps {
    statsData: any,
    onChange: Function
};

function StatsRange({statsData, onChange}: StatsRangeProps) {
    return (
        <div className="stats-range-block">
            {
                Object.keys(statsData).map((item:any) => {
                    return (
                        <div className="stats-range-block-item">
                            <div className="stats-range-block-item-label">
                                {item}
                            </div>
                            <div className="stats-range-block-item-slider">
                                <label className="stats-range-block-item-mobile-label">
                                    {item}
                                </label>
                                <RangeSlider id={item} onChange={onChange} minLevel={0} maxLevel={210} value={statsData[item]} />
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default StatsRange;