import { ChangeEvent, memo, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateEmail } from 'services/validations';

type TField = 'email' | 'name' | 'password';

type TForm = {
  [key in TField]: string;
};

type TFormValidations = {
  [key in TField]: boolean;
};

export const Register: React.FC = () => {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState<TForm>({
    email: '',
    name: '',
    password: '',
  });

  //Prevent re-renders
  const handleInputChange = useCallback(
    (field: string, event: ChangeEvent<HTMLInputElement>) =>
      setFormValues((prev) => ({
        ...prev,
        [field]: event.target.value,
      })),
    []
  );

  const validFormValues: TFormValidations = {
    email: formValues.email.length ? validateEmail(formValues.email) : true,
    name: formValues.name.length ? formValues.name.length > 2 : true,
    password: formValues.password.length
      ? formValues.password.length > 6
      : true,
  };

  const [helperTexts, setHelperText] = useState<TForm>();

  // const validateForm = (): boolean => {
  //   if (!validFormValues) setErrorMsgs((prev) => []);
  // };

  // const handleAccept = (): void => {};

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <form
        onSubmit={(e): void => e.preventDefault()}
        style={{
          width: '50%',
          height: '50%',
          display: 'grid',
        }}
      >
        <fieldset>
          <legend
            className={'aesthetic-effect-text-glitch'}
            data-glitch={'Register!'}
          >
            Register!
          </legend>
          {Object.entries(formValues).map(([key, value]) => (
            <CustomInput
              key={key}
              valid={validFormValues[key as TField]}
              value={value}
              field={key}
              onChange={handleInputChange}
            />
          ))}
          <div
            className={'form-group'}
            style={{
              display: 'grid',
              gridTemplateRows: '1fr 1fr 1fr',
              alignItems: 'center',
              justifyItems: 'center',
            }}
          >
            <button
              className={'btn btn-default'}
              onClick={(): void => console.log({ formValues })}
            >
              Complete!
            </button>
            <span>or</span>
            <button
              className={'btn btn-default'}
              onClick={(): void => navigate('/')}
            >
              Login
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

interface ICustomInput {
  value: string;
  field: string;
  onChange: (field: string, event: ChangeEvent<HTMLInputElement>) => void;
  valid: boolean;
}

const CustomInput: React.FC<ICustomInput> = memo(
  ({ value, field, onChange, valid }) => {
    console.log('input render ' + field);

    return (
      <div
        className={'form-group'}
        style={{
          display: 'grid',
          gridTemplateRows: '21px 38px 14px',
          overflow: 'hidden',
        }}
      >
        <label>{field}</label>
        <input
          style={{
            borderColor: valid ? 'var(--font-color)' : 'var(--error-color)',
          }}
          spellCheck="false"
          value={value}
          onChange={(e): void => onChange(field, e)}
          type={field === 'password' ? 'password' : 'text'}
        />
      </div>
    );
  }
);
