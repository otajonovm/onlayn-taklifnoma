import React from 'react';
import { Invitation, ThemeConfig } from '@/types';
import { BRAND } from '@/config/themes';
import {
  WEDDING_TEMPLATES,
  type WeddingTemplateContent,
  type WeddingTemplateConfig,
} from '@/config/weddingTemplates';
import {
  mergeStyleOverrides,
  type TemplateStyleOverrides,
} from '@/types/styleTokens';
import { invitationToWeddingData } from './types';
import { WD101Layout } from './layouts/WD101Layout';
import { WD102Layout } from './layouts/WD102Layout';
import { WD103Layout } from './layouts/WD103Layout';
import { DynamicStyleWrapper } from './DynamicStyleWrapper';

type WeddingTemplateContentOverrides = Partial<WeddingTemplateContent>;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function deepMergeContent<T>(base: T, override: Partial<T>): T {
  if (!override) return base;

  const output: any = Array.isArray(base) ? [...base] : { ...(base as any) };

  for (const key of Object.keys(override) as Array<keyof T>) {
    const o = (override as any)[key];
    if (o === undefined) continue;

    const b = (base as any)[key];
    if (Array.isArray(b) && Array.isArray(o)) {
      output[key] = o;
      continue;
    }

    if (isPlainObject(b) && isPlainObject(o)) {
      output[key] = deepMergeContent(b, o);
      continue;
    }

    output[key] = o;
  }

  return output as T;
}

function mapFontFamily(fontHeader: string): ThemeConfig['fontFamily'] {
  const v = (fontHeader || '').toLowerCase();
  if (v.includes('cormorant')) return 'cormorant';
  if (v.includes('playfair') || v.includes('cinzel') || v.includes('vibes')) return 'serif';
  if (v.includes('serif')) return 'serif';
  return 'sans';
}

export function resolveWeddingTemplate(input: {
  templateId: string;
  customData?: { contentOverrides?: WeddingTemplateContentOverrides };
  customStyles?: Partial<TemplateStyleOverrides> | null;
}): {
  template: WeddingTemplateConfig;
  resolvedStyles: TemplateStyleOverrides;
  resolvedContent: WeddingTemplateContent;
  resolvedMedia: WeddingTemplateConfig['media'];
  resolvedEnvelope: WeddingTemplateConfig['envelope'];
  theme: ThemeConfig;
} {
  const template =
    WEDDING_TEMPLATES[input.templateId] ||
    WEDDING_TEMPLATES[Object.keys(WEDDING_TEMPLATES)[0]];

  const resolvedStyles = mergeStyleOverrides(template.styles, input.customStyles);
  const resolvedContent = deepMergeContent<WeddingTemplateContent>(
    template.content,
    input.customData?.contentOverrides ?? {}
  );

  const resolvedMedia = template.media;
  const resolvedEnvelope = template.envelope;

  const theme: ThemeConfig = {
    primaryColor: BRAND.white,
    accentColor: resolvedStyles.colorAccent,
    backgroundColor: resolvedStyles.colorBg,
    cardBgColor: resolvedStyles.colorCardBg,
    textColor: resolvedStyles.colorTextPrimary,
    fontFamily: mapFontFamily(resolvedStyles.fontHeader),
    envelopeColor: resolvedEnvelope.envelopeColor,
    waxSealSymbol: resolvedEnvelope.waxSealSymbol,
  };

  return {
    template,
    resolvedStyles,
    resolvedContent,
    resolvedMedia,
    resolvedEnvelope,
    theme,
  };
}

export interface WeddingRendererProps {
  templateId: string;
  invitation: Invitation;
  customData?: { contentOverrides?: WeddingTemplateContentOverrides };
  customStyles?: Partial<TemplateStyleOverrides> | null;
  onRsvpSuccess?: () => void;
}

/**
 * Resolves shared WeddingData once, merges style overrides, then mounts
 * the layout architecture for templateId inside DynamicStyleWrapper.
 */
export const WeddingRenderer: React.FC<WeddingRendererProps> = ({
  templateId,
  invitation,
  customData,
  customStyles,
  onRsvpSuccess,
}) => {
  const mergedCustomStyles = {
    ...(invitation.customStyles || {}),
    ...(customStyles || {}),
  };

  const { resolvedContent, resolvedStyles, theme, template } = resolveWeddingTemplate({
    templateId,
    customData,
    customStyles: mergedCustomStyles,
  });

  const data = invitationToWeddingData({
    invitation,
    styles: resolvedStyles,
    content: resolvedContent,
    theme,
    onRsvpSuccess,
  });

  const id = template.id;
  let layout: React.ReactNode;
  if (id === 'WD-102') {
    layout = <WD102Layout key="WD-102" data={data} />;
  } else if (id === 'WD-103') {
    layout = <WD103Layout key="WD-103" data={data} />;
  } else {
    layout = <WD101Layout key="WD-101" data={data} />;
  }

  return (
    <DynamicStyleWrapper styles={resolvedStyles} className="w-full">
      {layout}
    </DynamicStyleWrapper>
  );
};
