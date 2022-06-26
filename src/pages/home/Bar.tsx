import { cleanSessionUser, useSessionUser } from 'store/user';
import { GlitchWriter } from 'components/GlitchWriter';

export const Bar: React.FC = () => {
  const { user } = useSessionUser();

  if (!user) {
    return null;
  }
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '10px',
        padding: '20px',
      }}
    >
      <h1>
        <GlitchWriter
          className={'terminal-prompt'}
          style={{
            display: 'flex',
            gap: '10px',
          }}
          text={`Welcome <div data-text=${user.name} class='layers glitch'><span>${user.name}</span></div>`}
        />
      </h1>
      <ins
        style={{
          cursor: 'pointer',
        }}
        onClick={cleanSessionUser}
      >
        <GlitchWriter text={'Exit'} />
      </ins>
    </div>
  );
};
