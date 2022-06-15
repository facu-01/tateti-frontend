import { ChangeEvent, useState } from 'react';
import { validateEmail } from 'services/validations';
import { useNavigate } from 'react-router-dom';

interface IFormValuesLogin {
  email: string;
  password: string;
}

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [{ email, password }, setFormValues] = useState<IFormValuesLogin>({
    email: '',
    password: '',
  });

  const handleInputChange =
    (field: 'email' | 'password') => (event: ChangeEvent<HTMLInputElement>) =>
      setFormValues((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));

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
              // style={{
              //   borderColor: email.valid
              //     ? 'var(--font-color)'
              //     : 'var(--error-color)',
              // }}
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
              // style={{
              //   borderColor: password.valid
              //     ? 'var(--font-color)'
              //     : 'var(--error-color)',
              // }}
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
            <button
              className={'btn btn-default'}
              onClick={(): void => navigate('/register')}
            >
              Register
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};
