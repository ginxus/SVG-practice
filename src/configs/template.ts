
import { ITemplate } from '@/components/svg-text/type';

const textTemplate: ITemplate[] = [
  {
    templateName: 'templateA',
    fontFamily: 'RobotoMono-Bold',
    fontSize: 25,
    fontWeight: 800,
    anchor: 'middle',
    fill: 'rgb(238, 238, 238)',
    leading: 5,
    monospaced: true,
  },
  {
    templateName: 'templateB',
    fontFamily: 'RobotoMono-Bold',
    fontSize: 25, // vary the font size by detecting the length of text
    fontWeight: 800,
    fill: 'rgb(0, 0, 0)',
    anchor: 'middle',
    leading: 5,
    background: {
      fill: '#333',
      stroke: { color: 'none', width: 0 },
      padding: 10,
      radius: 0,
      needMask: true,
      fullCover: false,
    },
    frame: {
      color: '#333',
      strokeWidth: 6,
      padding: 10,
      radius: 0,
    },
    monospaced: true,
  },
  {
    templateName: 'templateC',
    fontFamily: 'RobotoMono-Bold',
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
    fontFamily: 'RobotoMono-Bold',
    fontSize: 45,
    fontWeight: 800,
    fill: 'rgb(255, 255, 255)',
    anchor: 'end',
    leading: 10,
    background: {
      fill: '#666',
      stroke: { color: 'none', width: 0 },
      padding: 10,
      radius: 0,
      needMask: true,
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
