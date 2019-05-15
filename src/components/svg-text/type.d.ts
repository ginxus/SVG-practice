export interface ITextBlock {
  index: number;
  content: string | null;
  fontSize: string | null;
  fill: string | null;
  textAnchor: string | null;
  isMasked: boolean;
  position?: {
    x: number;
    y: number;
    cx: number;
    cy: number;
  };
  transform?: {
    scaleX: number;
    scaleY: number;
    rotate: number;
  };
  [name: string]: any;
}

export interface ITextQueryData {
  text: string;
  x?: number;
  y?: number;
  fontname: string;
  fontsize: number;
  fontnameTC?: string;
  fontnameEN?: string;
  linepad?: number;
  wordpad?: number;
  align?: string;
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
  [name: string]: any;
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

export interface IActives {
  textInput: string;
  template: ITemplate;
  textDesignV2: ITextDesignV2 | { [name: string]: any };
}

export interface IFrameConfig {
  color: string;
  strokeWidth: number;
  padding: number;
  radius: number;
}

export type ITextDesignMode = 'group' | 'block';

interface IPosition {
  x: number;
  y: number;
}

export interface ITextDesignV2 {
  mode: string;
  customProps: {
    masked: boolean;
    fill?: string | Array<{index: number, value: string}>;
    rotate?: number | Array<{index: number, value: number}>;
    scale?: number | Array<{index: number, value: number}>;
    move?: IPosition | IPosition[];
    [name: string]: any;
  };
  template: ITemplate;
  textContent: string;
}
