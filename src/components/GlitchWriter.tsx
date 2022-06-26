import { useEffect, useRef, useState } from 'react';
import GlitchedWriter, { presets } from 'glitched-writer';

interface IGlitchWriter extends React.HTMLAttributes<HTMLDivElement> {
  text: string | null;
  endLess?: boolean;
  onEnd?: () => void;
}

export const GlitchWriter: React.FC<IGlitchWriter> = ({
  text,
  endLess = false,
  onEnd,
  ...rest
}) => {
  const [writer, setWriter] = useState<GlitchedWriter | undefined>(undefined);

  const glitchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const writer = new GlitchedWriter(glitchRef.current, {
      ...presets.neo,
      steps: [3, 8],
      fillSpace: false,
      html: true,
    });
    if (onEnd) writer.addCallback('finish', onEnd);

    setWriter(writer);
    return () => {
      if (onEnd) writer.removeCallback('finish', onEnd);
      setWriter(undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!writer) return;
    writer.write(text ? text : '');
  }, [writer, text]);

  useEffect(() => {
    if (!writer) return;
    writer.endless(endLess);
  }, [writer, endLess]);

  return <div ref={glitchRef} {...rest}></div>;
};
