import {FC} from "react";
import {cn} from "@/shared/lib/utils";

export interface SvgPreviewProps {
  svgCode: string;
  className?: string;
  size?: number;
}

export const SvgPreview: FC<SvgPreviewProps> = ({
                                                  svgCode,
                                                  className,
                                                  size = 48,
                                                }) => {
  const isRealSvg = svgCode.trim().startsWith('<svg');

  if (isRealSvg) {
    // Режим для реальных SVG (оставляем без изменений)
    return (
      <div
        className={cn(
          'relative flex items-center justify-center overflow-hidden',
          '[&_svg]:!w-full [&_svg]:!h-full [&_svg]:block',
          className
        )}
        style={{ width: size, height: size }}
        dangerouslySetInnerHTML={{ __html: svgCode }}
      />
    );
  }

  // Режим для Эмодзи (Добавляем рамку здесь)
  return (
    <div
      className={cn(
        'flex items-center justify-center leading-none select-none',
        // --- ДОБАВЛЕННЫЕ КЛАССЫ ДЛЯ РАМКИ ---
        'border-2 border-dashed border-gray-300 rounded bg-gray-50 text-gray-400',
        // -----------------------------------
        className
      )}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${size * 0.7}px`, // Немного уменьшили коэф., чтобы эмодзи влез в рамку
        flexShrink: 0 // Чтобы в таблице контейнер не сжимался
      }}
    >
      {svgCode}
    </div>
  );
};