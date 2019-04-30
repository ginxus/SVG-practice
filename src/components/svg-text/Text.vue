
<script lang="ts">
import AppStorage from '@/libs/storage';
import { Component, Prop, Vue, Watch  } from 'vue-property-decorator';
import {
  ITextBlock,
  ITemplate,
  IActivesDesign,
  IBackgroundConfig,
  IFrameConfig,
} from '@/components/svg-text/type';
import SVG, { FontData, Element } from 'svg.js';
import 'svg.draggable.js';
import templateConfig from '@/configs/template.ts';
import TextController from './TextController.vue';

@Component({ components: { TextController } })
export default class TextPersonalize extends Vue {

  @Prop({ required: true }) public msg!: string;
  public draw: SVG.Doc | null = null;
  public textGroup: SVG.Set | null = null;
  public actives: IActivesDesign = {
    textInput: 'GET\nEVERYBODY\nMOVE',
    template: templateConfig[0],
    textBlocks: [],
  };

  public mounted() {
    this.init();
    this.getCenterPoint();
  }

  @Watch('actives.textInput')
  public onTextInputChange() {
    this.refreshDisplayer();
  }

  public init() {
    const centerPosition = this.getCenterPoint();
    // @ts-ignore
    this.draw = SVG('svg-displayer');
    this.draw.viewbox({ x: 0, y: -200, width: 500, height: 500 });
    this.textGroup = this.draw.set();
    this.refreshDisplayer();
  }

  public refreshDisplayer() {

    if (this.draw) {

      const centerPosition = this.getCenterPoint();
      const textInputArray = this.actives.textInput.split('\n');
      const { background, leading } = this.actives.template;

      if (this.textGroup) {
        this.draw.clear(); // clear all the rendered element
        this.textGroup.clear(); // clear all the element in set
      }

      this.insertTextBlock();
      this.applyTextBlockStyleV2();
      this.applyTemplateFormateV2();
      this.applyCustomStyle();
      this.createTextBlockDesign(this.textGroup as SVG.Set);

      AppStorage.setItem('svg-design', this.actives.textBlocks);
    }
  }

  public insertTextBlock() {
    const textInputArray = this.actives.textInput.split('\n');
    textInputArray.forEach((text, index) => {
      if (this.draw && this.textGroup) {
        const textBlock = this.draw.text(text);
        const para = {
          type: 'position',
          target: index,
          arg: {
            x: textBlock.bbox().x,
            y: textBlock.bbox().y,
          },
        };
        // @ts-ignore
        textBlock.draggable();
        textBlock.on('dragend', () => { this.updateTextBlockDesign(para); });
        textBlock.animate({ ease: '>', duration: 200, delay: 100 * index }).scale(2.5, 2.5).reverse();
        this.textGroup.add(textBlock);
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
    const widthArray = this.textGroup.members.map((member, index) => member.bbox().width);
    const maxWidth = Math.max(...widthArray);
    const allowance = 1;
    currentWidth = textblock.bbox().width;

    if (currentWidth < ( maxWidth - allowance )) {
      textblock.style('font-size', fontSize);
      this.monospaced(textblock, fontSize + 1);
    }
  }

  public applyTemplateFormateV2() {

    const { monospaced, background, frame, rotate, skew, leading, decoration, fontSize } = this.actives.template;
    const centerPosition = this.getCenterPoint();

    if (this.textGroup) {

      if (monospaced) {
        // @ts-ignore
        this.textGroup.members.forEach((member, index) => {
          this.monospaced(member, fontSize);
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

  public rotateV2(rotate: number) {
    const { anchor } = this.actives.template;
    const textGroupBBox = (this.textGroup as SVG.Set).bbox();
    switch (anchor) {
      case 'start':
        // @ts-ignore
        (this.textGroup as SVG.Set).rotate(rotate, textGroupBBox.x, textGroupBBox.y);
        break;
      case 'middle':
        // @ts-ignore
        (this.textGroup as SVG.Set).rotate(rotate, textGroupBBox.cx, textGroupBBox.cy);
        break;
      case 'end':
        // @ts-ignore
        (this.textGroup as SVG.Set).rotate(rotate, textGroupBBox.x2, textGroupBBox.y2);
        break;
    }
  }

  public skewV2(skew: { x: number; y: number; }) {
    // @ts-ignore
    this.textGroup.skew(skew.x, skew.y);
  }

  public applyTextBlockStyleV2() {

    const { fill, anchor, fontSize, fontFamily, fontWeight } = this.actives.template;

    if (this.textGroup) {
      // @ts-ignore
      this.textGroup.members.forEach((member, index) => {

        member.style({
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

  public applyCustomStyle() {
    if (this.textGroup) {

      this.actives.textBlocks
        .filter((textblock) => {
          const currentTemplate = templateConfig.find((template) => {
            return template.templateName === textblock.appliedTemplateName;
          });
          return textblock.fill !== (currentTemplate as ITemplate).fill;
        })
        .forEach((textblock) => {
          const index = this.actives.textBlocks.indexOf(textblock);
          // @ts-ignore
          const targetBlock = this.textGroup.get(index);
          if (targetBlock) { targetBlock.style('fill', textblock.fill); }
        });
    }
  }

  public fixLineHeightV2(leading: number) {

    let distance: number;
    let cy: number;
    const background: IBackgroundConfig | undefined = this.actives.template.background;
    const centerPosition = this.getCenterPoint();

    if (this.textGroup) {
      // @ts-ignore
      this.textGroup.members.forEach((currentBlock, index) => {

        if (index > 0) {
          // @ts-ignore
          const formerBlock = (this.textGroup as SVG.Set).members[index - 1];

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

  public getCenterPoint() {
    if (this.draw) {
      const cx = this.draw.node.clientWidth / 2;
      const cy = this.draw.node.clientHeight / 2;
      return {cx, cy};
    } else {
      return { cx: 0, cy: 0 };
    }
  }

  public addBackgroundV2(backgroundSetting: IBackgroundConfig) {

    const { fullCover } = backgroundSetting;

    if (fullCover) {
      this.addFullCoverBackground(backgroundSetting);
    } else {
      // @ts-ignore
      this.textGroup.members.forEach((member, index) => {
        this.addTextBackground(member, backgroundSetting);
      });
    }
  }

  public addTextBackground( textBlock: SVG.Element, backgroundSetting: IBackgroundConfig ) {

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
      .back();

    (this.textGroup as SVG.Set).add(background);
  }

  public addFullCoverBackground(backgroundSetting: IBackgroundConfig) {

    const { fill, stroke, padding, radius } = backgroundSetting;
    const { cx, cy, width, height } = (this.textGroup as SVG.Set).bbox();

    const backgroundWidth = width + padding * 2;
    const backgroundHeight = height + padding * 2;

    const background = (this.draw as SVG.Doc)
      .addClass('svg-full-background')
      .rect(backgroundWidth, backgroundHeight)
      .fill(fill)
      .stroke(stroke)
      .radius(radius)
      .center(cx, cy)
      .back();

    (this.textGroup as SVG.Set).add(background);
  }

  public addFrame(frameSetting: IFrameConfig) {
    const { color, strokeWidth, padding, radius } = frameSetting;
    const { cx, cy, width, height } = (this.textGroup as SVG.Set).bbox();

    const frameWidth = width + padding * 2;
    const frameHeight = height + padding * 2;

    const background = (this.draw as SVG.Doc)
      .addClass('svg-frame')
      .rect(frameWidth, frameHeight)
      .fill('none')
      .stroke({ color, width: strokeWidth })
      .radius(radius)
      .center(cx, cy)
      .back();
  }

  public createTextBlockDesign(textGroup: SVG.Set) {

    this.actives.textBlocks = [];
    AppStorage.removeItem('svg-design');
    // @ts-ignore
    textGroup.members
      .filter((member: SVG.Text) => member.node.id.includes('Text'))
      .forEach((member: SVG.Text, index: number) => {
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
          transform: { scaleX, scaleY, skewX, skewY, rotate },
        };
        this.actives.textBlocks.push(textBlock);
      });
  }

  public updateTextBlockDesign(para: any) {
    const { type, target, arg } = para;
    switch (type) {
        case 'color':
          // @ts-ignore
          const textblock = this.textGroup.members.find((member) => member.node.id === target.id);
          textblock.style('fill', arg);
          target.fill = arg;
          break;
      }
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
        <div class="text__dashboard__btn-group">
          <button
            type="button"
            class="function-btn"
            v-text="'Change template'"
            @click="updateTemplate"
          />
        </div>
        <div class="text__dashboard__text-block">
          <text-controller
            v-for="block in actives.textBlocks"
            :key="block.id"
            :textBlock="block"
            @change="updateTextBlockDesign"
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
      // height: 50vh; 
      box-sizing: border-box;
      background: #666;
      padding: 10px;
    }
    &__displayer {
      background-color: #ff9922;
    }
    &__dashboard {
      background-color: #666;
      &__text-block {
        background: #fff;
        padding: 10px;
        margin-top: 10px;
        text-align: left;
        font-size: 18px;
      }
    }
    &__input {
      font-size: 30px;
      text-align: center;
      display: block;
      width: 100%;
      height: 200px;
      border: none;
      padding: 5px;
      box-sizing: border-box;
    }

    .function-btn {
      font-size: 16px;
      border: none;
      border-radius: 5px;
      padding: 10px;
      background-color: #fff;
      margin: 3px;
    }
    #svg-displayer {
      height: 50vh;
    }
  }
</style>


