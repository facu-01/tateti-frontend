import { GlitchWriter } from 'components/GlitchWriter';

interface IButtonGlitch extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: string;
}

export const ButtonGlitch: React.FC<IButtonGlitch> = (props) => (
  <button
    className={'btn btn-default btn-ghost layersHover glitchHover'}
    data-text={props.children}
    {...props}
  >
    <GlitchWriter text={props.children} />
  </button>
);
