
<script lang="ts">
import AppStorage from '@/libs/storage';
import { Component, Prop, Vue, Watch  } from 'vue-property-decorator';
import {
  ITextBlock,
  ITextBlockData,
  ITemplate,
  IActives,
  ICustomStylingV2,
  IBackgroundConfig,
  IFrameConfig,
} from '@/components/svg-text/type';
import SVG, { Element } from 'svg.js';
import 'svg.draggable.js';
import 'svg.panzoom.js';
import templateConfig from '@/configs/template.ts';
import { panZoomConfig, viewboxConfig } from '@/configs/control.ts';
import BarController from './BarController.vue';
import ColorPicker from './ColorPicker.vue';

// * elementGroupShell is used for controlling the group and make it work as expected,
// the transform(rotation, scale) won't work correclty when using extended plugin such like svg.draggable.js*

@Component({ components: { BarController, ColorPicker } })
export default class TextPersonalize extends Vue {

  @Prop({ required: true }) public msg!: string;
  public draw: SVG.Doc | null = null;
  public elementGroup: SVG.G | null = null;
  public elementGroupShell: SVG.G | null = null;
  public actives: IActives = {
    textInput: 'GET\nEVERYBODY\nMOVE',
    template: templateConfig[0],
    textBlocks: [],
    customStylingV2: {
      group: {},
      block: {},
    },
  };

  public mounted() {
    this.init();
    this.getCenterPoint();
  }

  @Watch('actives.textInput')
  public onTextInputChange() {
    this.refreshDisplayer();
  }

  public async init() {
    const centerPosition = this.getCenterPoint();
    // @ts-ignore
    this.draw = SVG('svg-displayer');
    // @ts-ignore
    this.draw.viewbox(viewboxConfig);
    this.elementGroupShell = (this.draw as SVG.Doc).group();
    this.elementGroup = (this.draw as SVG.Doc)
      .group()
      .addClass('textblock-container')
      // @ts-ignore
      .draggable()
      .on('dragend', (e: any) => {
        const { x, y } = (this.elementGroup as SVG.G).transform();
        const param = {
          property: 'move',
          value: { x, y },
        };
        this.updateDesign(param);
      })
      .addTo(this.elementGroupShell);

    this.refreshDisplayer();
  }

  public refreshDisplayer() {

    if (this.draw) {

      const centerPosition = this.getCenterPoint();
      const textInputArray = this.actives.textInput.split('\n');
      const { background, leading } = this.actives.template;

      if (this.elementGroup) {
        this.elementGroup.clear();
        this.elementGroup.forget();
      }

      this.insertTextBlock();
      this.applyTextBlockStyleV2();
      this.applyTemplateStyleV2();
      this.applyCustomStyleV2();
      this.createTextBlockDesign(this.elementGroup as SVG.G);

      AppStorage.setItem('svg-design', this.actives.textBlocks);
    }
  }

  public insertTextBlock() {
    const textInputArray = this.actives.textInput.split('\n');
    textInputArray.forEach((text, index) => {
      if (this.draw && this.elementGroup) {
        const textBlock = this.draw.text(text);
        (this.elementGroup as SVG.G).add(textBlock);
        textBlock.animate({ ease: '>', duration: 200, delay: 100 * index }).scale(2.5, 2.5).reverse();
      }
    });
  }

  public updateTemplate() {

    const currentIndex = templateConfig.indexOf(this.actives.template);
    const maxIndex = templateConfig.length - 1;

    this.actives.template = currentIndex === maxIndex
    ? templateConfig[0]
    : templateConfig[currentIndex + 1];

    this.refreshDisplayer();
  }

  public monospaced(textblock: SVG.Element, fontSize: number) {

    let currentWidth: number;
    // @ts-ignore
    const widthArray = this.elementGroup.children()
      .filter((el) => el.type === 'text')
      .map((el) => el.bbox().width);
    const maxWidth = Math.max(...widthArray);
    const allowance = 1;
    currentWidth = textblock.bbox().width;

    if (currentWidth < ( maxWidth - allowance )) {
      textblock.style('font-size', fontSize);
      this.monospaced(textblock, fontSize + 1);
    }
  }

  public getCenterPoint() {
    if (this.draw) {
      const cx = this.draw.node.clientWidth / 2;
      const cy = this.draw.node.clientHeight / 2;
      return {cx, cy};
    } else {
      return { cx: 0, cy: 0 };
    }
  }

  public applyTemplateStyleV2() {

    const { monospaced, background, frame, rotate, skew, leading, decoration, fontSize } = this.actives.template;

    if (this.elementGroup) {
      if (monospaced) {
        // @ts-ignore
        this.elementGroup.children()
          .filter((el) => el.type === 'text')
          .forEach((el, index) => {
            this.monospaced(el, fontSize);
          });
      }
      this.fixLineHeightV2(leading);
      // @ts-ignore
      if (rotate) { this.rotateV2(rotate); }
      if (skew) { this.skewV2(skew); }
      if (background) { this.addBackgroundV2(background); }
      if (frame) { this.addFrame(frame); }
    }
  }

  public applyTextBlockStyleV2() {

    const { fill, anchor, fontSize, fontFamily, fontWeight } = this.actives.template;

    if (this.elementGroup) {
      this.elementGroup.children()
        .filter((el) => el.type === 'text')
        .forEach((el, index) => {
          el.style({
            'font-family': fontFamily,
            'font-weight': fontWeight,
            'font-size': fontSize,
            'text-anchor': anchor,
            'cursor': 'pointer',
            fill,
          });
        });
    }
  }

  public applyCustomStyleV2() {
    const { block, group } = this.actives.customStylingV2;
    const blockCustomProperties = Object.keys(block);
    const groupCustomProperties = Object.keys(group);
    if (blockCustomProperties.length > 0) {
      blockCustomProperties.forEach((prop) => {
        block[prop].forEach((config) => {
          const { index, value } = config;
          const textblocks = (this.elementGroup as SVG.G).children().filter((el) => el.type === 'text');
          textblocks[index].style(prop, value);
        });
      });
    }
    if (groupCustomProperties.length > 0) {
      groupCustomProperties.forEach((prop) => {
        switch (prop) {
          case 'move':
            const { x, y } = this.actives.customStylingV2.group[prop];
            (this.elementGroup as SVG.G).move(x, y);
            break;
          case 'zoom':
            const value = this.actives.customStylingV2.group[prop];
            // @ts-ignore
            this.draw.zoom(value);
            break;
          case 'fill':
            const fill = this.actives.customStylingV2.group[prop];
            // @ts-ignore
            (this.elementGroup as SVG.G).children()
              .filter((el) => el.type === 'text')
              .forEach((el) => el.style('fill', fill));
            break;
          case 'scale':
            const scale = this.actives.customStylingV2.group[prop];
            (this.elementGroupShell as SVG.G).scale(scale);
            break;
          case 'rotate':
            const rotate = this.actives.customStylingV2.group[prop];
            this.rotateV2(rotate);
            break;
        }
      });
    }
  }

  public rotateV2(rotate: number) {
    const elementGroupBBox = (this.elementGroup as SVG.G).bbox();
    // (this.elementGroup as SVG.G).rotate(rotate, elementGroupBBox.cx, elementGroupBBox.cy);
    // (this.elementGroup as SVG.G).rotate(rotate);
    (this.elementGroupShell as SVG.G).transform({rotation: rotate}, false);
  }

  public skewV2(skew: { x: number; y: number; }) {
    // @ts-ignore
    this.elementGroup.children()
      .filter((el) => el.type === 'text')
      .forEach((el) => {
        el.skew(skew.x, skew.y);
      });
  }

  public addBackgroundV2(backgroundSetting: IBackgroundConfig) {

    const { fullCover, needMask } = backgroundSetting;

    if (fullCover) {
      this.addFullCoverBackground(backgroundSetting);
    } else {
      // @ts-ignore
      this.elementGroup.children()
        .filter((el) => el.type === 'text')
        .forEach((member, index) => {
          this.addTextBackground(member, backgroundSetting, needMask);
        });
    }
  }

  public addFullCoverBackground(backgroundSetting: IBackgroundConfig) {

    const { fill, stroke, padding, radius } = backgroundSetting;
    const { cx, cy, width, height } = (this.elementGroup as SVG.G).bbox();

    const backgroundWidth = width + padding * 2;
    const backgroundHeight = height + padding * 2;

    const background = (this.draw as SVG.Doc)
      .addClass('svg-full-background')
      .rect(backgroundWidth, backgroundHeight)
      .fill(fill)
      .stroke(stroke)
      .radius(radius)
      .center(cx, cy);

    (this.elementGroup as SVG.G).add(background);
  }

  public addTextBackground( textBlock: SVG.Element, backgroundSetting: IBackgroundConfig, needMask: boolean ) {

    const { fill, stroke, padding, radius, fullCover } = backgroundSetting;
    const cx = textBlock.bbox().cx;
    const cy = textBlock.bbox().cy;
    const width = textBlock.bbox().width + padding * 2;
    const height = textBlock.bbox().height + padding * 2;

    const background = (this.draw as SVG.Doc)
      .rect(width, height)
      .fill(fill)
      .stroke(stroke)
      .radius(radius)
      .center(cx, cy);

    // * use textToSvg or openType to convert a svg-text to path *

    if (needMask) {
      const mask = (this.draw as SVG.Doc).mask();
      const maskRect = background.clone().fill('#fff');
      mask.add(maskRect);
      mask.add(textBlock);
      background.maskWith(mask);
      (this.elementGroup as SVG.G).add(mask);
      (this.elementGroup as SVG.G).add(background);
    } else {
      textBlock.before(background);
    }
  }

  public addFrame(frameSetting: IFrameConfig) {
    const { color, strokeWidth, padding, radius } = frameSetting;
    const { cx, cy, width, height } = (this.elementGroup as SVG.G).bbox();

    const frameWidth = width + padding * 2;
    const frameHeight = height + padding * 2;

    const frame = (this.draw as SVG.Doc)
      .addClass('svg-frame')
      .rect(frameWidth, frameHeight)
      .fill('none')
      .stroke({ color, width: strokeWidth })
      .radius(radius)
      .center(cx, cy);

    // #before or #after is not the same as #add, so if you wanna add an element into group, you still have to use #add
    (this.elementGroup as SVG.G).before(frame);
    (this.elementGroup as SVG.G).add(frame);
  }

  public fixLineHeightV2(leading: number) {

    let distance: number;
    let cy: number;
    const background: IBackgroundConfig | undefined = this.actives.template.background;
    const centerPosition = this.getCenterPoint();

    if (this.elementGroup) {
      // @ts-ignore
      this.elementGroup.children()
        .filter((el) => el.type === 'text')
        .forEach((currentBlock, index) => {

          if (index > 0) {
            // @ts-ignore
            const formerBlock = (this.elementGroup as SVG.G).get(index - 1);

            if (background) {
              distance = background.fullCover
                ? formerBlock.bbox().height / 2 + currentBlock.bbox().height / 2 + leading
                : formerBlock.bbox().height / 2 + currentBlock.bbox().height / 2 + leading + background.padding * 2;
            } else {
              distance = formerBlock.bbox().height / 2 + currentBlock.bbox().height / 2 + leading;
            }

            cy = formerBlock.bbox().cy;
          } else {
            cy = currentBlock.bbox().cy;
            distance = leading;
          }

          currentBlock
            .x(centerPosition.cx)
            .cy(distance + cy);
        });
    }
  }

  public createTextBlockDesign(textGroup: SVG.G) {

    this.actives.textBlocks = [];
    AppStorage.removeItem('svg-design');

    let textBlockArray: SVG.Text[];
    const maskArray = textGroup.children().filter((el) => el.type === 'mask');

    if (maskArray.length > 0) {
      // @ts-ignore
      textBlockArray = maskArray.map((mask: SVG.Mask) => {
        return mask.children().find((el) => el.type === 'text');
      });
    } else {
      // @ts-ignore
      textBlockArray = textGroup.children().filter((el) => el.type === 'text');
    }

    textBlockArray.forEach((member: SVG.Element, index: number) => {
      const { id, textContent, style } = member.node;
      const { fontSize, fill, fontWeight } = style;
      const { scaleX, scaleY, skewX, skewY, rotation: rotate } = member.transform();
      const textBlock: ITextBlock = {
        id,
        index,
        content: textContent + '\n',
        fontSize,
        fill,
        fontWeight,
        appliedTemplateName: this.actives.template.templateName,
        position: {
          cx: member.bbox().cx,
          cy: member.bbox().cy,
        },
        // @ts-ignore
        transform: { scaleX, scaleY, rotate },
      };
      this.actives.textBlocks.push(textBlock);
    });
  }

  public updateDesign(
    param: {
      index?: number;
      property: string;
      value: any;
    },
  ) {
    const { index, property, value } = param;
    if (index !== undefined) {
      const config = { index, value };
      if (this.actives.customStylingV2.block[property]) {
        const existedBlock = this.actives.customStylingV2.block[property].find((el) => el.index === index);
        if (existedBlock) {
          existedBlock.value = value;
        } else {
          this.actives.customStylingV2.block[property].push(config);
        }
      } else {
        this.actives.customStylingV2.block[property] = [ config ];
      }
    } else {
      this.actives.customStylingV2.group[property] = value;
    }
    this.applyCustomStyleV2();
  }

  public wordToPath() {
    const url = 'https://zkjgntnwdd.execute-api.us-west-2.amazonaws.com/dev/wordtopath';
    const header = new Headers({'Content-Type': 'text/json'});
    const body = {
      text: 'test',
      x: 0,
      y: 50,
      fontname: 'NotoSans-Bold',
      fontsize: 36,
      linepad: 1,
      align: 'center',
    };
    const request = new Request(url, {
      method: 'POST',
      headers: header,
      body: JSON.stringify(body),
    });

    fetch(request)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        } else {
          res.json();
        }
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  public exportDesign(textBlockData: ITextBlockData[]) {
    // convert SVG text to path
    // export SVG
    this.wordToPath();
    const exportedSVG = (this.draw as SVG.Doc).svg();
    window.console.log(exportedSVG);
  }
}
</script>

<template>
  <div class="text">

    <h1 v-text="msg"/>

    <section class="content">
      <div class="text__displayer">
        <h2 v-text="'Preview'"/>
        <div id="svg-displayer"/>
      </div>
      <div class="text__dashboard">
        <h2 v-text="'Text-editor'"/>
        <textarea
          class="text__input"
          v-model.trim.lazy="actives.textInput"
        />
        <div class="text__dashboard__group-control">
          <bar-controller
            :controller-name="'Scale-controller'"
            :name="'scale'"
            :min="0.5"
            :max="3"
            :value="1"
            :step="0.5"
            @update="updateDesign"
          />
          <bar-controller
            :controller-name="'Rotation-controller'"
            :name="'rotate'"
            :min="0"
            :max="360"
            :value="0"
            :step="1"
            @update="updateDesign"
          />
          <button
            type="button"
            class="template-control"
            v-text="'Change template'"
            @click="updateTemplate"
          />
          <color-picker
            @change="updateDesign"
          />
          <button
            v-text="'Export SVG'"
            @click.prevent="exportDesign"
          />
        </div>
      </div>
    </section>

  </div>
</template>

<style lang="scss">
  .text {
    h2 {
      color: #fff;
    }
    .content {
      display: flex;
      justify-content: space-between;
    }
    &__displayer, &__dashboard {
      width: 49%;
      box-sizing: border-box;
      background: #666;
      padding: 10px;
    }
    &__displayer {
      background-color: #ff9922;
    }
    &__dashboard {
      background-color: #666;
    
      &__group-control {
        margin: 6px 0px;
        button {
          display: block;
          width: 100%;
          color: #fff;
          font-weight: 800;
          font-size: 18px;
          border: none;
          padding: 10px;
          background-color: #aaa;
          margin: 6px 0px;
          cursor: pointer;
        }
      }
    }
    &__input {
      font-size: 25px;
      text-align: center;
      display: block;
      width: 100%;
      height: 150px;
      border: none;
      padding: 5px;
      box-sizing: border-box;
    }

    #svg-displayer {
      height: 50vh;
    }
  }
</style>


