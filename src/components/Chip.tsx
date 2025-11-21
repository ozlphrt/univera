import './Chip.css';

interface ChipProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
  className?: string;
}

export const Chip = ({ label, selected, onToggle, className = '' }: ChipProps) => {
  const classes = [
    'chip',
    selected && 'chip--selected',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  
  return (
    <button onClick={onToggle} className={classes} type="button">
      {label}
    </button>
  );
};
