import { FC } from 'react';
import { cn } from '@/shared/lib/utils';
import { isValidSvg } from '@/shared/lib/utils/svg-validation';

export interface SvgPreviewProps {
  svgCode: string;
  className?: string;
  size?: number;
  emojiSize?: number;
}

export const SvgPreview: FC<SvgPreviewProps> = ({
                                                  svgCode,
                                                  className,
                                                  size = 48,
                                                  emojiSize,
                                                }) => {
  const isValid = isValidSvg(svgCode);

  if (!isValid) {
    return (
      <div
        className={cn(
          'flex items-center justify-center border-gray-300 rounded bg-[#ebf7ff] select-none overflow-hidden',
          className,
        )}
        style={{
          width: size,
          height: size,
          flexShrink: 0
        }}
      >
        <span
          style={{
            fontSize: emojiSize ? `${emojiSize}px` : `${size * 0.7}px`,
            lineHeight: 1,
            display: 'block'
          }}
        >
          {svgCode}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn('flex items-center justify-center', className)}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svgCode }}
    />
  );
};