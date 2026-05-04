import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  loading = false,
  disabled,
  ...props
}) => (
  <button
    {...props}
    disabled={disabled ?? loading}
    data-variant={variant}
  >
    {loading ? 'Cargando...' : children}
  </button>
);

export default Button;
