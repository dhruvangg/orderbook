import * as React from 'react';
import { cn } from '@/lib/utils';

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, style, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(className)}
      style={{
        display: 'flex',
        height: '40px',
        width: '100%',
        borderRadius: '8px',
        border: '1px solid #d4d4d8',
        backgroundColor: '#ffffff',
        padding: '8px 12px',
        fontSize: '14px',
        color: '#18181b',
        outline: 'none',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        ...style,
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = '#16a34a';
        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(22,163,74,0.2)';
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = '#d4d4d8';
        e.currentTarget.style.boxShadow = 'none';
        props.onBlur?.(e);
      }}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };
