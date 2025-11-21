import { InputHTMLAttributes } from 'react';
import './TextField.css';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const TextField = ({
  label,
  error,
  helperText,
  className = '',
  id,
  onKeyDown,
  ...props
}: TextFieldProps) => {
  const fieldId = id || `field-${label.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <div className="text-field">
      <label htmlFor={fieldId} className="text-field__label">
        {label}
      </label>
      <input
        id={fieldId}
        className={`text-field__input ${error ? 'text-field__input--error' : ''} ${className}`}
        onKeyDown={onKeyDown}
        {...props}
      />
      {error && <p className="text-field__error">{error}</p>}
      {helperText && !error && <p className="text-field__helper">{helperText}</p>}
    </div>
  );
};
