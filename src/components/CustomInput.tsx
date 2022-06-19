import { ChangeEvent, memo } from 'react';

interface ICustomInput {
  label: string;
  disabled?: boolean;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  valid: boolean;
  helperText?: string;
  inputType?: React.HTMLInputTypeAttribute | undefined;
}

export const CustomInput: React.FC<ICustomInput> = memo(
  ({
    label,
    value,
    onChange,
    valid,
    helperText,
    inputType = 'text',
    disabled = false,
  }) => (
    <div
      style={{
        padding: '10px',
        display: 'grid',
        gridTemplateRows: 'auto auto auto',
      }}
    >
      <label>{label}</label>
      <input
        style={{
          borderColor: valid ? 'var(--font-color)' : 'var(--error-color)',
        }}
        spellCheck="false"
        value={value}
        onChange={onChange}
        type={inputType}
        disabled={disabled}
      />
      <p
        style={{
          margin: 0,
        }}
      >
        <small>
          <sub>{helperText}</sub>
        </small>
      </p>
    </div>
  )
);
