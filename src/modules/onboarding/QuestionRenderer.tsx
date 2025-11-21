import { QuestionConfig } from './types';
import { Chip } from '@/components/Chip';
import { Slider } from '@/components/Slider';
import './QuestionRenderer.css';

interface QuestionRendererProps {
  question: QuestionConfig;
  value: any;
  onChange: (value: any) => void;
}

export const QuestionRenderer = ({ question, value, onChange }: QuestionRendererProps) => {
  const optionCount = question.options?.length || 0;
  const hasManyOptions = optionCount > 8;
  const chipsClassName = `question-renderer question-renderer--chips ${
    hasManyOptions ? 'question-renderer--chips-many' : ''
  }`;

  switch (question.type) {
    case 'single-choice':
      return (
        <div className={chipsClassName}>
          {question.options?.map((option) => (
            <Chip
              key={option.value}
              label={option.label}
              selected={value === option.value}
              onToggle={() => onChange(option.value)}
            />
          ))}
        </div>
      );

    case 'multi-choice':
      const selectedValues = Array.isArray(value) ? value : [];
      return (
        <div className={chipsClassName}>
          {question.options?.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            return (
              <Chip
                key={option.value}
                label={option.label}
                selected={isSelected}
                onToggle={() => {
                  if (isSelected) {
                    onChange(selectedValues.filter((v) => v !== option.value));
                  } else {
                    onChange([...selectedValues, option.value]);
                  }
                }}
              />
            );
          })}
        </div>
      );

    case 'slider':
      return (
        <div className="question-renderer question-renderer--slider">
          <Slider
            value={value ?? question.min ?? 1}
            min={question.min ?? 1}
            max={question.max ?? 5}
            step={question.step ?? 1}
            onChange={onChange}
            showValue={true}
          />
        </div>
      );

    default:
      return null;
  }
};

