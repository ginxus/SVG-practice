export interface ITextBlock {
  id: string;
  index: number;
  content: string | null;
  fontSize: string | null;
  fill: string | null;
  fontWeight: string | null;
  appliedTemplateName: string;
  position: {
    cx: number;
    cy: number;
    dx?: number;
    dy?: number;
  };
  transform: {
    scaleX: number;
    scaleY: number;
    rotate: number;
  };
}

export interface ITextBlockData {
  text: string;
  x: number;
  y: number;
  fontname: string;
  fontnameTC?: string;
  fontnameEN?: string;
  linepad: number;
  wordpad?: number;
  align: string;
}

export interface ITemplate {
  templateName: string;
  fontSize: number;
  fontWeight: number;
  fontFamily: string;
  leading: number;
  fill: string;
  anchor: string;
  background?: IBackgroundConfig;
  frame?: IFrameConfig;
  rotate?: number;
  skew?: {
    x: number;
    y: number;
  };
  monospaced: boolean;
  decoration?: {
    path: string,
    position: {
      x: number,
      y: number,
    },
  };
}

export interface IBackgroundConfig {
  fill: string;
  stroke: {
    color: string;
    width: number;
  };
  padding: number;
  radius: number;
  needMask: boolean;
  fullCover: boolean;
}

interface ICustomStylingV2 {
  group: {
    [property: string]: any;
  };
  block: {
    [property: string]: Array<{ index: number; value: any; }>;
  };
}

export interface IActives {
  textInput: string;
  template: ITemplate;
  textBlocks: ITextBlock[];
  customStylingV2: ICustomStylingV2;
}

export interface IFrameConfig {
  color: string;
  strokeWidth: number;
  padding: number;
  radius: number;
}
