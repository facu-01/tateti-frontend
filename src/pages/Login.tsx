import { ChangeEvent, useEffect, useState } from 'react';
import { validateEmail } from 'services/validations';

interface IFormValues {
  email: string;
  password: string;
}

export const Login: React.FC = () => {
  const [{ email, password }, setFormValues] = useState<IFormValues>({
    email: '',
    password: '',
  });

  const handleInputChange =
    (field: 'email' | 'password') => (event: ChangeEvent<HTMLInputElement>) =>
      setFormValues((prev) => ({ ...prev, [field]: event.target.value }));

  const validEmail = email.length ? validateEmail(email) : true;

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
            data-glitch={'Welcome!'}
          >
            Welcome!
          </legend>
          <div className={'form-group'}>
            <label>email</label>
            <input
              style={{
                borderColor: validEmail ? 'black' : 'var(--error-color)',
              }}
              value={email}
              onChange={handleInputChange('email')}
              type={'email'}
            />
          </div>
          <div className={'form-group'}>
            <label>Password</label>
            <input
              value={password}
              onChange={handleInputChange('password')}
              type={'password'}
            />
          </div>
          <div
            className={'form-group'}
            style={{
              display: 'grid',
              gridTemplateRows: '1fr 1fr 1fr',
              alignItems: 'center',
              justifyItems: 'center',
            }}
          >
            <button className={'btn btn-default'}>Login</button>
            <span>or</span>
            <button className={'btn btn-default'}>Register</button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};
