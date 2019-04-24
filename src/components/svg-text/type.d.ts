export interface ITextBlock {
  id: string;
  index: number;
  content: string | null;
  size: string | null;
  color: string | null;
  rotate: number;
  position: {
    cx: string;
    cy: string;
  };
}

export interface ITemplate {
  fontSize: number;
  fontWeight: number;
  fontFamily: string;
  leading: number;
  fill: string;
  background: string;
  frame: string;
  monospaced: boolean;
  decoration: {
    path: string,
    position: {
      x: number,
      y: number,
    },
  };
}

export interface IActivesDesign {
  textInput: string;
  textBlocks: ITextBlock[];
  template: ITemplate;
}
