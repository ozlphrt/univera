import './Slider.css';

interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  label?: string;
  showValue?: boolean;
}

export const Slider = ({
  value,
  min,
  max,
  step = 1,
  onChange,
  label,
  showValue = true,
}: SliderProps) => {
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <div className="slider">
      {label && (
        <div className="slider__header">
          <label className="slider__label">{label}</label>
          {showValue && <span className="slider__value">{value}</span>}
        </div>
      )}
      <div className="slider__container">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="slider__input"
          style={{
            background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
          }}
        />
        <div className="slider__labels">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  );
};
