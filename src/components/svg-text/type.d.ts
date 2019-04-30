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
    skewX: number;
    skewY: number;
    rotate: number;
  };
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
  fullCover: boolean;
}

export interface IActivesDesign {
  textInput: string;
  textBlocks: ITextBlock[];
  template: ITemplate;
}

export interface IFrameConfig {
  color: string;
  strokeWidth: number;
  padding: number;
  radius: number;
}
