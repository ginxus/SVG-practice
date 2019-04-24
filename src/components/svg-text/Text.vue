
<script lang="ts">
import { Component, Prop, Vue, Watch  } from 'vue-property-decorator';
import { ITextBlock, ITemplate, IActivesDesign } from '@/components/svg-text/type';
import SVG, { FontData, Element } from 'svg.js';
import templateConfig from '@/configs/template.ts';
import TextController from './TextController.vue';

@Component({
  components: { TextController },
})
export default class TextPersonalize extends Vue {

  @Prop({ required: true }) public msg!: string;
  public draw: SVG.Doc | null = null;
  public textGroup: SVG.Text | null = null;
  public actives: IActivesDesign = {
    textInput: 'EDIT TEXT HERE',
    template: templateConfig[1],
    textBlocks: [],
  };

  public mounted() {
    this.init();
    this.getCenterPoint();
  }

  @Watch('actives.textInput')
  public onTextInputChange() {
    this.updateTextContent(this.actives.textInput);
  }

  public init() {
    // @ts-ignore
    this.draw = SVG('svg-displayer');
    this.updateTextContent(this.actives.textInput);
    this.updateTemplate();
  }

  public updateTextContent(value: string) {

    if (this.draw !== null) {

      if (this.textGroup) {
        this.actives.textBlocks = [];
        this.draw.clear();
      }

      const textInputArray = this.actives.textInput.split('\n');

      this.textGroup = this.draw.text((add) => {
        textInputArray.forEach((text) => {
          const textBlock = add.tspan(text).newLine();
          this.applyTextBlockStyle(textBlock);
        });
      });

      this.createTextBlockDesign(this.textGroup);
    }
  }

  public updateTemplate() {

    const backgroundSet = SVG.select('.svg-text-background');
    const currentIndex = templateConfig.indexOf(this.actives.template);
    const maxIndex = templateConfig.length - 1;

    if (backgroundSet) {
      backgroundSet.each((index: any, backgroundEls: any) => {
        backgroundEls.map((background: any) => {
          background.remove();
        });
      });
    }

    this.actives.template = currentIndex === maxIndex
    ? templateConfig[0]
    : templateConfig[currentIndex + 1];

    if (this.textGroup) {
      const leading = this.actives.template.leading;
      const tspans: SVG.Set = this.textGroup.lines();
      this.textGroup.attr({ leading });
      // @ts-ignore
      (tspans.members).forEach((member) => {
        this.applyTextBlockStyle(member);
      });
    }
    this.createTextBlockDesign(this.textGroup as SVG.Text);
  }

  public countFontSizeLevel(textblock: SVG.Element) {
    const textContent = this.getTextContent(textblock);
    const textLengthArray = this.actives.textInput
      .split('\n')
      .map((text) => text.length);
    const MaxLength = Math.max(...textLengthArray);
    return MaxLength / textContent.length;
  }

  public getTextContent(textblock: SVG.Element) {
    return textblock.node.innerHTML;
  }

  public applyTextBlockStyle(textblock: SVG.Element) {
    const { fontFamily, fill, leading, background, fontSize, fontWeight } = this.actives.template;
    const centerPosition = this.getCenterPoint();

    if (this.textGroup !== null) {

      const sizeLevel = this.countFontSizeLevel(textblock);
      textblock
        .style({
          'font-family': fontFamily,
          'font-size': fontSize * sizeLevel,
          'font-weight': fontWeight,
          'text-anchor': 'middle', // use for text-align the svg-text
          'enable-background': true,
          'background': '#f00',
          leading,
          fill,
        })
        .addClass('svg-textblock')
        .dx(centerPosition.cx)
        .scale(sizeLevel);

      if (background !== 'none') {
        // this.addTextBackground(textblock, background);
      }
    }
  }

  public getCenterPoint() {
    if (this.draw) {
      const cx = this.draw.node.clientWidth / 2;
      const cy = this.draw.node.clientHeight / 2;
      return {cx, cy};
    } else {
      return {cx: 0, cy: 0};
    }
  }

  public addTextBackground(textBlock: SVG.Element, color: string) {

    const cx = textBlock.cx();
    const cy = textBlock.cy();

    const centerPosition = this.getCenterPoint();

    const id = textBlock.attr('id');
    const domElement = document.querySelector('#' + id);
    const clitentRect = (domElement as HTMLElement).getClientRects();
    const width = clitentRect[0].width;
    const height = clitentRect[0].height;

    const background = (this.draw as SVG.Doc)
      .rect(width, height)
      .fill(color)
      .addClass('svg-text-background')
      .backward()
      .translate(-190, 10)
      .x(centerPosition.cx);
  }

  public createTextBlockDesign(textGroup: SVG.Text) {
    const tspans: SVG.Set = textGroup.lines();
    this.actives.textBlocks = [];
    // @ts-ignore
    tspans.members.forEach((member, index) => {
      const textblock: ITextBlock = {
        id: member.node.id,
        index,
        content: member.node.textContent,
        size: member.node.style.fontSize,
        color: member.node.style.fill,
        rotate: 0,
        position: {
          x: '',
          y: '',
        },
      };
      this.actives.textBlocks.push(textblock);
    });
  }

  public moveTextLeft(textGroup: SVG.Text) {
    textGroup.dx(-1);
  }

  public moveTextRight(textGroup: SVG.Text) {
    textGroup.dx(1);
  }

  public moveTextUp(textGroup: SVG.Text) {
    textGroup.dy(-1);
  }

  public moveTextDown(textGroup: SVG.Text) {
    textGroup.dy(1);
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
          <button
            type="button"
            class="function-btn"
            v-text="'Add text background'"
            @click="addTextBackground(textGroup, '#f00')"
          />
          <button
            type="button"
            class="function-btn"
            v-text="'Move left'"
            @click="moveTextLeft(textGroup)"
          />
          <button
            type="button"
            class="function-btn"
            v-text="'Move right'"
            @click="moveTextRight(textGroup)"
          />
          <button
            type="button"
            class="function-btn"
            v-text="'Move up'"
            @click="moveTextUp(textGroup)"
          />
          <button
            type="button"
            class="function-btn"
            v-text="'Move down'"
            @click="moveTextDown(textGroup)"
          />
        </div>
        <div class="text__dashboard__text-block">
          <text-controller
            v-for="block in actives.textBlocks"
            :key="block.id"
            :textBlock="block"
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


