
import { ITemplate } from '@/components/svg-text/type';

const textTemplate: ITemplate[] = [
  {
    fontFamily: 'Arial black',
    fontSize: 25, // vary the font size by detecting the length of text
    fontWeight: 800,
    fill: '#ff9922',
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
    decoration: {
      path: '',
      position: {
        x: 0,
        y: 0,
      },
    },
  },
  {
    fontFamily: 'Impact',
    fontSize: 35,
    fontWeight: 800,
    fill: '#666',
    anchor: 'start',
    leading: 0,
    monospaced: false,
    rotate: 20,
    decoration: {
      path: '',
      position: {
        x: 0,
        y: 0,
      },
    },
  },
  {
    fontFamily: 'Didot',
    fontSize: 25,
    fontWeight: 800,
    anchor: 'middle',
    fill: '#333',
    leading: 0,
    monospaced: true,
    decoration: {
      path: '',
      position: {
        x: 0,
        y: 0,
      },
    },
  },
  {
    fontFamily: 'Arial Black',
    fontSize: 25,
    fontWeight: 800,
    anchor: 'middle',
    fill: '#eee',
    leading: 0,
    monospaced: true,
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
