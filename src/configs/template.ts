
import { ITemplate } from '@/components/svg-text/type';

const textTemplate: ITemplate[] = [
  {
    templateName: 'templateA',
    fontFamily: 'Arial Black',
    fontSize: 25,
    fontWeight: 800,
    anchor: 'middle',
    fill: 'rgb(238, 238, 238)',
    leading: 5,
    monospaced: true,
  },
  {
    templateName: 'templateB',
    fontFamily: 'Arial',
    fontSize: 25, // vary the font size by detecting the length of text
    fontWeight: 800,
    fill: 'rgb(255, 153, 34)',
    anchor: 'middle',
    leading: 5,
    background: {
      fill: '#fff',
      stroke: { color: 'none', width: 0 },
      padding: 10,
      radius: 0,
      fullCover: false,
    },
    frame: {
      color: '#fff',
      strokeWidth: 6,
      padding: 10,
      radius: 0,
    },
    monospaced: true,
  },
  {
    templateName: 'templateC',
    fontFamily: 'Phosphate',
    fontSize: 35,
    fontWeight: 800,
    anchor: 'middle',
    fill: 'rgb(51, 51, 51)',
    leading: 0,
    monospaced: true,
    skew: {
      x: 0,
      y: -15,
    },
  },
  {
    templateName: 'templateD',
    fontFamily: 'Impact',
    fontSize: 45,
    fontWeight: 800,
    fill: 'rgb(255, 255, 255)',
    anchor: 'start',
    leading: 10,
    background: {
      fill: '#666',
      stroke: { color: 'none', width: 0 },
      padding: 10,
      radius: 0,
      fullCover: false,
    },
    monospaced: false,
    decoration: {
      path: '',
      position: {
        x: 0,
        y: 0,
      },
    },
  },
];

export default textTemplate;
