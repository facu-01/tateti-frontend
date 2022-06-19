import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { validateEmail } from 'services/validations';
import { useNavigate } from 'react-router-dom';
import { CustomInput } from 'components/CustomInput';
import { useMutation, UseMutationResult } from 'react-query';
import { toast } from 'react-toastify';
import axios, { AxiosResponse } from 'axios';
import { updateSessionUser } from 'store/user';
import 'styles/glitch.css';
import GlitchedWriter, { wait } from 'glitched-writer';

const Test: React.FC<{ text: string }> = ({ text }) => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const loadWriter = async () => {
      const Writer = new GlitchedWriter('#glitch_this', { letterize: true });

      await Writer.write(text);
    };
    loadWriter();
  }, []);

  return <div id="glitch_this"></div>;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useLogin = () => {
  const navigate = useNavigate();
  return useMutation(
    (userData: { email: string; password: string }) =>
      toast.promise(
        axios({
          method: 'post',
          url: 'auth/login',
          data: userData,
          headers: { Authorization: '' },
        }),
        {
          pending: {
            render: () => <Test text="Loading..." />,
          },
          success: {
            render: () => <Test text="Welcome back!" />,
          },
          error: {
            render: ({ data }) => <Test text="Email or password incorrect!" />,
          },
        }
      ),
    {
      onSuccess: async (response) => {
        await updateSessionUser(response.data.token);
        navigate('/home');
      },
    }
  );
};

interface IField {
  id: string;
  label: string;
  value: string;
  valid: boolean;
  errorMsg: string;
  inputType?: React.HTMLInputTypeAttribute | undefined;
}

export const Login: React.FC = () => {
  // services
  const navigate = useNavigate();
  const { mutate, isLoading, isSuccess } = useLogin();

  // form
  const [formValues, setFormValues] = useState<IField[]>([
    {
      id: 'email',
      label: 'email',
      value: '',
      errorMsg: '',
      valid: true,
    },
    {
      id: 'password',
      label: 'password',
      value: '',
      errorMsg: '',
      valid: true,
      inputType: 'password',
    },
  ]);

  // prevents re-renders
  const changeEventsHandlers = useMemo(
    () =>
      formValues.map(
        (_, i) => (event: ChangeEvent<HTMLInputElement>) =>
          setFormValues((prev) =>
            prev.map((prevF, prevI) => {
              if (prevI === i) {
                return {
                  ...prevF,
                  value: event.target.value,
                  valid: true,
                  errorMsg: '',
                };
              }
              return prevF;
            })
          )
      ),
    []
  );

  const setErrorMsg = (fieldId: string) => (message: string) =>
    setFormValues((prev) =>
      prev.map((prevF) => {
        if (prevF.id === fieldId) {
          return { ...prevF, valid: false, errorMsg: message };
        }
        return prevF;
      })
    );

  const validateForm = (): boolean =>
    formValues.reduce((prev, current) => {
      const { id, value } = current;

      if (id === 'email' && !validateEmail(value)) {
        setErrorMsg(id)('invalid email');
        return false;
      }
      if (id === 'password' && value.length < 6) {
        setErrorMsg(id)('password must have at least 6 characters');
        return false;
      }
      return prev;
    }, true);

  const handleLogin = (): void => {
    const validForm = validateForm();
    if (!validForm) return;
    const FEmail = formValues.find((f) => f.id === 'email');
    const FPassword = formValues.find((f) => f.id === 'password');
    if (FEmail && FPassword) {
      mutate({
        email: FEmail.value,
        password: FPassword.value,
      });
    }
  };

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <div
        style={{
          width: '50%',
          display: 'grid',
        }}
      >
        <fieldset>
          <legend className={'layers glitch'} data-text={'Welcome!'}>
            <span>Welcome!</span>
          </legend>
          {formValues.map((f, index) => (
            <CustomInput
              disabled={isLoading || isSuccess}
              key={f.label}
              label={f.label}
              value={f.value}
              onChange={changeEventsHandlers[index]}
              valid={f.valid}
              helperText={f.errorMsg}
              inputType={f.inputType}
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
              disabled={isLoading || isSuccess}
              className={'btn btn-default btn-ghost layersHover glitchHover'}
              onClick={handleLogin}
              data-text="Login"
            >
              <span>Login</span>
            </button>
            <span>or</span>
            <button
              disabled={isLoading || isSuccess}
              className={'btn btn-default btn-ghost layersHover glitchHover'}
              data-text="Register"
              onClick={(): void => navigate('/register')}
            >
              <span>Register</span>
            </button>
          </div>
        </fieldset>
      </div>
    </div>
  );
};
