import ReactSlider from 'react-slider';
import "./style.scss";

interface RangeSliderProps {
    minLevel: number | string,
    maxLevel: number | string,
    value: Array<number>,
    onChange?: Function,
    id?: string,
}

function RangeSlider ({minLevel, maxLevel, value, onChange, id} : RangeSliderProps) {

    return (
        <div className='range-slider-block'>
            <div className='range-slider-level-indicators'>
                {minLevel}
            </div>
            <ReactSlider
                className="range-slider"
                thumbClassName="range-slider-handle"
                trackClassName="range-slider-track"
                markClassName="range-slider-track-mark"
                value={value}
                min={0}
                max={210}
                defaultValue={[0,210]}
                ariaLabel={['Lower thumb', 'Upper thumb']}
                ariaValuetext={state => `Thumb value ${state.valueNow}`}
                renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                pearling
                onAfterChange={(value, index) => onChange && onChange(value, index, id)}
            />
            <div className='range-slider-level-indicators'>
                {maxLevel}
            </div>
        </div>
    )
};

export default RangeSlider;