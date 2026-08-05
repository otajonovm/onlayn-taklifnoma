import React, { useEffect } from 'react';
import type { TemplateStyleOverrides } from '@/types/styleTokens';
import { RADIUS_MAP } from '@/types/styleTokens';
import { ensureFontsLoaded } from '@/utils/loadGoogleFonts';

export interface DynamicStyleWrapperProps {
  styles: TemplateStyleOverrides;
  className?: string;
  children: React.ReactNode;
}

/**
 * Injects CSS variables + frame modifier class around a template layout.
 * Layout architecture stays the same; only visual tokens change.
 */
export const DynamicStyleWrapper: React.FC<DynamicStyleWrapperProps> = ({
  styles,
  className = '',
  children,
}) => {
  useEffect(() => {
    ensureFontsLoaded(styles.fontHeader, styles.fontBody);
  }, [styles.fontHeader, styles.fontBody]);

  const cssVars = {
    ['--bg-color' as string]: styles.colorBg,
    ['--card-bg' as string]: styles.colorCardBg,
    ['--text-primary' as string]: styles.colorTextPrimary,
    ['--text-secondary' as string]: styles.colorTextSecondary,
    ['--accent-color' as string]: styles.colorAccent,
    ['--border-color' as string]: styles.colorBorder,
    ['--font-header' as string]: `'${styles.fontHeader}', serif`,
    ['--font-body' as string]: `'${styles.fontBody}', sans-serif`,
    ['--border-radius' as string]: RADIUS_MAP[styles.borderRadius] || RADIUS_MAP.md,
  } as React.CSSProperties;

  const frameClass = `ds-frame ds-frame--${styles.borderStyle}`;

  return (
    <div
      className={`ds-root ${frameClass} ${className}`.trim()}
      style={{
        ...cssVars,
        backgroundColor: 'var(--bg-color)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-body)',
        borderRadius: 'var(--border-radius)',
      }}
    >
      <div className="ds-frame-inner">{children}</div>
    </div>
  );
};

export default DynamicStyleWrapper;
