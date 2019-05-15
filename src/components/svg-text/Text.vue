
<script lang="ts">
import AppStorage from '@/libs/storage';
import { Component, Prop, Vue, Watch  } from 'vue-property-decorator';
import {
  IActives,
  IBackgroundConfig,
  IFrameConfig,
  ITemplate,
  ITextBlock,
  ITextDesignV2,
  ITextQueryData,
} from '@/components/svg-text/type';
import SVG, { Element } from 'svg.js';
import 'svg.draggable.js';
import 'svg.panzoom.js';
import templateConfig from '@/configs/template';
import { viewboxConfig } from '@/configs/control';
import { customize } from '@/configs/general';
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
    textDesignV2: {},
  };
  public downloadTime: number = 0;

  public mounted() {
    this.init();
  }

  @Watch('actives.textInput')
  public onTextInputChange() {
    this.reRender();
  }

  public init() {
    this.draw = SVG('svg-displayer');
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
          index: null,
          property: 'move',
          value: { x, y },
        };
        this.updateDesignV3(param);
      })
      .addTo(this.elementGroupShell);
    this.actives.textDesignV2 = this.createDesignV2('group');
    this.reRender();
  }

  public reRender() {

    if (this.draw) {
      if (this.elementGroup) { this.elementGroup.clear(); }
      this.insertTextBlock();
      this.applyTemplate(false);
      this.applyCustomDesignV2();
      AppStorage.setItem('svg-design', this.actives.textDesignV2);
    }
  }

  public insertTextBlock() {
    const textInputArray = this.actives.textInput.split('\n');
    textInputArray.forEach((text, index) => {
      if (this.draw && this.elementGroup) {
        const textBlock = this.draw.text(text).addClass('svg-textblock');
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

    this.actives.textDesignV2.template = this.actives.template;

    this.reRender();
  }

  public updateDesignV3(
    param: {
      index: number | null;
      property: string;
      value: any;
    },
  ) {
    const { index, property, value } = param;
    if (index) {
      if (this.actives.textDesignV2.customProps[property]) {
        const existed = this.actives.textDesignV2.customProps[property].find((block: any) => block.index === index);
        if (existed) {
          existed.value = value;
        } else {
          this.actives.textDesignV2.customProps[property].push({ index, property });
        }
      } else {
        this.actives.textDesignV2.customProps[property] = [ { index, property } ];
      }
    } else {
      this.actives.textDesignV2.customProps[property] = value;
    }
    this.applyCustomDesignV2();
  }

  public createDesignV2(mode: string) {
    let masked: boolean;
    const { template, textInput } = this.actives;

    if (this.actives.template.background) {
      masked = this.actives.template.background.needMask ? true : false;
    } else {
      masked = false;
    }

    const textDesign: ITextDesignV2 = {
      mode,
      customProps: {
        masked,
      },
      template,
      textContent: textInput,
    };
    return textDesign;
  }

  public monospaced(textblock: SVG.Element, fontSize: number) {

    let currentWidth: number;
    // @ts-ignore
    const widthArray = this.selectElement('svg-textblock').map((el) => el.bbox().width);
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

  public applyTemplate(isExport: boolean) {
    const {
      monospaced,
      background,
      frame,
      rotate,
      skew,
      leading,
      decoration,
      fontSize,
      fill,
      anchor,
      fontFamily,
    } = this.actives.template;

    if (this.elementGroup) {

      if (!isExport) {

        this.selectElement('svg-textblock')
          .forEach((el, index) => {
            el.style({
              // 'font-family': fontFamily,
              'font-family': 'Roboto-Bold',
              'font-size': fontSize,
              'text-anchor': anchor,
              'cursor': 'pointer',
              fill,
            });
          });

        if (monospaced) {
          this.selectElement('svg-textblock')
            .forEach((el, index) => { this.monospaced(el, fontSize); });
        }
        this.fixLineHeightV2(leading);
        if (background) { this.addBackgroundV2(background); }
        if (frame) { this.addFrame(frame); }
      }
      if (rotate) { this.rotateV2(rotate); }
      if (skew) { this.skewV2(skew); }
    }
  }

  public rotateV2(rotate: number) {
    (this.elementGroupShell as SVG.G).transform({rotation: rotate}, false);
  }

  public skewV2(skew: { x: number; y: number; }) {
    this.selectElement('svg-textblock')
      .forEach((el) => {
        el.skew(skew.x, skew.y);
      });
  }

  public addBackgroundV2(backgroundSetting: IBackgroundConfig) {

    const { fullCover, needMask } = backgroundSetting;

    if (fullCover) {
      this.addFullCoverBackground(backgroundSetting);
    } else {
      this.selectElement('svg-textblock')
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
      .center(cx, cy)
      .addClass('svg-text-background')
      .addTo(this.elementGroup as SVG.G);

    if (needMask) {
      this.applyOrUndoMaskV2(background, textBlock);
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
      this.selectElement('svg-textblock')
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

  public applyCustomDesignV2() {
    this.actives.textDesignV2.mode === 'group'
      ? this.applyCustomGroupDesign()
      : this.applyCustomBlockDesign();
  }

  public applyCustomBlockDesign() {
    const textblocks = this.selectElement('svg-textblock');
    Object.keys(this.actives.textDesignV2.customProps).forEach((prop) => {
      switch (prop) {
        case 'fill':
          if (this.isMaskExisted(this.elementGroup as SVG.G)) {
            this.selectElement('svg-text-background').forEach((bg) => { this.applyOrUndoMaskV2(bg); });
          }
          const value = this.actives.textDesignV2.customProps[prop];
          this.fillTextBlocks(value);
          break;
      }
    });
  }

  public applyCustomGroupDesign() {
    Object.keys(this.actives.textDesignV2.customProps).forEach((prop) => {
      const value = this.actives.textDesignV2.customProps[prop];
      switch (prop) {
        case 'scale':
          (this.elementGroupShell as SVG.G).scale(value);
          break;
        case 'rotate':
          this.rotateV2(value);
          break;
        case 'move':
          (this.elementGroup as SVG.G).move(value.x, value.y);
          break;
        case 'fill':
          this.fillTextBlocks(value);
          break;
      }
    });
  }

  public fillTextBlocks(arg: Array<{index: number, value: any}> | string) {

    if (this.isMaskExisted(this.elementGroup as SVG.G)) {
      this.selectElement('svg-text-background').forEach((bg) => { this.applyOrUndoMaskV2(bg); });
    }

    this.selectElement('svg-textblock')
      .forEach((text, index) => {
        const value = Array.isArray(arg)
          ? arg.find((val) => val.index === index)
          : arg;
        if (this.actives.template.background) {
          if (!this.actives.textDesignV2.customProps.masked) {
            text.style('fill', value);
          } else {
            const textBackground = this.selectElement('svg-text-background')[index];
            this.applyOrUndoMaskV2(textBackground, text);
          }
        } else {
          text.style('fill', value);
        }
      });
  }

  // TODO: refactor to make 'anchor' dynamic
  public applyOrUndoMaskV2(target: SVG.Element, material?: SVG.Element) {

    if (target.masker) {
      const originTextMask = target.masker.children().find((childEl) => childEl.type === 'text');
      const replacement = material ? material : (originTextMask as SVG.Element).clone();
      if (material) { this.setPosition('middle', replacement, originTextMask as SVG.Element); }
      target.masker.remove();
      target.after(replacement);
    } else {
      const mask = (this.draw as SVG.Doc).mask().addClass('svg-mask');
      const maskClip = target.clone().fill('#fff').addTo(mask);
      const targetParent = target.parent();
      mask.add((material as SVG.Element).style('fill', '#000'));
      target.maskWith(mask);
      (targetParent as SVG.G).add(mask);
    }
    return target;
  }

  public exportDesign() {

    const textblocks = this.isMaskExisted(this.elementGroup as SVG.G)
      // @ts-ignore
      ? this.selectElement('svg-mask').map((mask) => mask.children().find((el) => el.type === 'text'))
      : this.selectElement('svg-textblock');

    const paths = textblocks.map((textblock, index) => {
      return new Promise((resolve) => {
        const requestData: ITextQueryData = {
          text: this.actives.textInput.split('\n')[index],
          fontname: 'Roboto-Bold', // TODO: refactor to dynamic value
          // @ts-ignore
          fontsize: parseInt(textblock.style('font-size'), 10),
        };
        this.textToPath(requestData).then((d) => {
          resolve({ d, textblock });
        });
      });
    });

    Promise.all(paths).then((val) => {
      const svg = this.generateSvg(val as Array<{ d: string; textblock: SVG.Element }>);
      this.createFile(svg);
    });
  }

  public async textToPath(textblockData: ITextQueryData) {

    const url = 'https://zkjgntnwdd.execute-api.us-west-2.amazonaws.com/dev/wordtopath';
    const header = new Headers({'Content-Type': 'text/json'});
    const request = new Request(url, {
      method: 'POST',
      headers: header,
      body: JSON.stringify(textblockData),
    });

    const response = await fetch(request)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        } else {
          return res.json();
        }
      })
      .catch((err) => {
        throw new Error(err);
      });

    return response.path;
  }

  public generateSvg(arg: Array<{ d: string; textblock: SVG.Element }>) {

    const isExport = true;
    const isMaskExisted = (this.elementGroup as SVG.G).children().some((el) => el.type === 'mask');
    const filteredElement = (this.elementGroup as SVG.G).children()
      .filter((el) => el.type === (isMaskExisted ? 'mask' : 'text'));

    filteredElement.forEach((el, index) => {

      const { textblock, d  } = arg[index];

      if (isMaskExisted) {
        const textBackgrounds = this.selectElement('svg-text-background');
        const textReplacement = (this.draw as SVG.Doc).path(d).fill('#fff').addClass('svg-textblock');
        this.applyOrUndoMaskV2(textBackgrounds[index], textReplacement);
      } else {
        const fill = textblock.style('fill');
        const anchor = this.actives.template.anchor;
        const newText = (this.draw as SVG.Doc).path(d).fill(fill).addClass('svg-textblock');
        this.setPosition(anchor, newText, el);
        el.remove();
        newText.addTo((this.elementGroup as SVG.G));
        this.applyTemplate(isExport);
        this.applyCustomDesignV2();
      }
    });

    return (this.draw as SVG.Doc).svg();
  }

  public createFile(svgString: string) {
    const currentDownloadTime = this.downloadTime + 1;
    const svgFile = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const svgFileUrl = URL.createObjectURL(svgFile);
    const fakeDownloadBtn = document.createElement('a');
    fakeDownloadBtn.href = svgFileUrl;
    fakeDownloadBtn.download = `svgTextTestFile-${currentDownloadTime}`;

    document.body.appendChild(fakeDownloadBtn);
    fakeDownloadBtn.click();
    document.body.removeChild(fakeDownloadBtn);
    this.downloadTime = currentDownloadTime;
  }

  public isMaskExisted(elementGroup: SVG.G) {
    return elementGroup.children().some((el) => el.type === 'mask');
  }

  public selectElement(name: string) {
    return (this.elementGroup as SVG.G).children().filter((el) => el.hasClass(name));
  }

  public setPosition(
    anchor: string,
    el: SVG.Element,
    referenceElement: SVG.Element,
  ) {
    const { x, x2, cx, cy } = referenceElement.bbox();
    switch (anchor) {
      case 'start':
        el.x(x);
        el.cy(cy);
        break;
      case 'middle':
        el.center(cx, cy);
        break;
      case 'end':
        el.x(x2);
        el.cy(cy);
        el.translate((0 - el.bbox().width), 0);
        break;
    }
    return el;
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
            @update="updateDesignV3"
          />
          <bar-controller
            :controller-name="'Rotation-controller'"
            :name="'rotate'"
            :min="0"
            :max="360"
            :value="0"
            :step="1"
            @update="updateDesignV3"
          />
          <button
            type="button"
            class="template-control"
            v-text="'Change template'"
            @click="updateTemplate"
          />
          <color-picker
            :design="actives.textDesignV2"
            @update="updateDesignV3"
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


