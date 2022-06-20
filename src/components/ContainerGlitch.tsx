interface IGlitchContainer {
  dataText: string;
  children: React.ReactNode;
}
export const ContainerGlitch: React.FC<IGlitchContainer> = ({
  dataText,
  children,
}) => (
  <div data-text={dataText} className={'layers glitch'}>
    <span>{children}</span>
  </div>
);
