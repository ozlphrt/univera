import { ReactNode } from 'react';
import './Card.css';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  onClick?: () => void;
  footer?: ReactNode;
  interactive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Card = ({
  title,
  subtitle,
  children,
  onClick,
  footer,
  interactive = false,
  className = '',
  style,
}: CardProps) => {
  const classes = [
    'card',
    interactive && 'card--interactive',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  
  const Component = onClick ? 'button' : 'div';
  
  const combinedStyle = {
    textAlign: 'left' as const,
    width: '100%',
    ...style,
  };
  
  const buttonProps = onClick ? {
    type: 'button' as const,
  } : {};
  
  return (
    <Component className={classes} onClick={onClick} style={combinedStyle} {...buttonProps}>
      {title && (
        <div className="card__header">
          <h3 className="card__title">{title}</h3>
          {subtitle && <p className="card__subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="card__content">{children}</div>
      {footer && <div className="card__footer">{footer}</div>}
    </Component>
  );
};
