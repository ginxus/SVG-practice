export interface ITextBlock {
  id: string;
  index: number;
  content: string | null;
  size: string | null;
  color: string | null;
  rotate: number;
  position: {
    cx: number;
    cy: number;
  };
}

export interface ITemplate {
  fontSize: number;
  fontWeight: number;
  fontFamily: string;
  leading: number;
  fill: string;
  anchor: string;
  background?: IBackgroundConfig;
  frame?: IFrameConfig;
  rotate?: number;
  monospaced: boolean;
  decoration: {
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
