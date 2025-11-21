import { ReactNode } from 'react';
import './ScreenContainer.css';

interface ScreenContainerProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
  'data-page'?: string;
}

export const ScreenContainer = ({
  children,
  className = '',
  padding = true,
  'data-page': dataPage,
}: ScreenContainerProps) => {
  const classes = [
    'screen-container',
    padding && 'screen-container--padded',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  
  return <div className={classes} data-page={dataPage}>{children}</div>;
};
