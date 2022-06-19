import { ChangeEvent, memo, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateEmail } from 'services/validations';
import { CustomInput } from 'components/CustomInput';
import { useMutation } from 'react-query';
import axios from 'axios';
import { toast } from 'react-toastify';

interface IRegisterErrors {
  email?: string[];
  name?: string[];
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useRegisterUser = () => {
  const navigate = useNavigate();
  return useMutation(
    (userData: { email: string; name: string; password: string }) =>
      toast.promise(
        axios({
          method: 'post',
          url: 'players',
          data: userData,
          headers: { Authorization: '' },
        }),
        {
          pending: 'Registering... ⌛',
          success: {
            render: ({ data }) =>
              `Welcome ${data?.data.name}, you can login! 🎊`,
          },
          error: {
            render: ({ data }) => {
              const errors: IRegisterErrors = data.response.data.errors;
              const emailError = errors.email
                ? `Email: ${errors.email[0]}`
                : '';
              const nameError = errors.name ? `Name: ${errors.name[0]}` : '';
              return `${emailError} ${nameError}`;
            },
          },
        }
      ),
    {
      onSuccess: () => navigate('/'),
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

export const Register: React.FC = () => {
  // services
  const navigate = useNavigate();
  const { mutate, isLoading, isSuccess } = useRegisterUser();
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
      id: 'name',
      label: 'name',
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
    {
      id: 'confirmPassword',
      label: 'confirm password',
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

      if (id === 'name' && value.length < 2) {
        setErrorMsg(id)('name must have at least 2 characters');
        return false;
      }
      if (id === 'email' && !validateEmail(value)) {
        setErrorMsg(id)('invalid email');
        return false;
      }
      if (id === 'password' && value.length < 6) {
        setErrorMsg(id)('password must have at least 6 characters');
        return false;
      }
      if (id === 'confirmPassword') {
        const passwordField = formValues.find((f) => f.id === 'password');
        if (passwordField?.value !== value) {
          setErrorMsg(id)('passwords do not match!');
          return false;
        }
      }
      return prev;
    }, true);

  const handleConfirm = (): void => {
    const validForm = validateForm();
    if (!validForm) return;
    const FEmail = formValues.find((f) => f.id === 'email');
    const FName = formValues.find((f) => f.id === 'name');
    const FPassword = formValues.find((f) => f.id === 'password');
    if (FEmail && FName && FPassword) {
      mutate({
        email: FEmail.value,
        name: FName.value,
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
          <legend className={'layers glitch'} data-text={'Register!'}>
            <span>Register!</span>
          </legend>
          <div className={'form-group'}>
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
            <button
              disabled={isLoading || isSuccess}
              className={'btn btn-default btn-ghost layersHover glitchHover'}
              onClick={handleConfirm}
              data-text="Complete!"
            >
              <span>Complete!</span>
            </button>
            <span>or</span>
            <button
              disabled={isLoading || isSuccess}
              className={'btn btn-default btn-ghost layersHover glitchHover'}
              data-text="Login"
              onClick={(): void => navigate('/')}
            >
              <span>Login</span>
            </button>
          </div>
        </fieldset>
      </div>
    </div>
  );
};
