import './styles.css';

interface IGlitchSvg {
  Svg: React.FC<React.HTMLAttributes<HTMLOrSVGElement>>;
  dimensions: [number, number];
}

export const GlitchSvg: React.FC<IGlitchSvg> = ({ Svg, dimensions }) => (
  <div
    style={{
      position: 'relative',
      width: `${dimensions[0]}px`,
      height: `${dimensions[1]}px`,
    }}
  >
    <Svg className={'svgGlitch'} />
    <Svg className={'svgGlitch'} />
    <Svg className={'svgGlitch'} />
  </div>
);
