import { Card } from './Card';
import './FitExplanationBlock.css';

interface FitExplanationBlockProps {
  explanation: string;
}

export const FitExplanationBlock = ({ explanation }: FitExplanationBlockProps) => {
  return (
    <Card className="fit-explanation-block">
      <h3 className="fit-explanation-block__title">Why this fits you</h3>
      <p className="fit-explanation-block__text">{explanation}</p>
    </Card>
  );
};

