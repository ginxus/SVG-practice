<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import ColorSelector from '@/components/svg-text/ColorBricks.vue';
import { ITextBlock, ITemplate, IActivesDesign } from '@/components/svg-text/type';

@Component({
  components: {
    ColorSelector,
  },
})
export default class TextController extends Vue {
  @Prop({ required: true }) public textBlock!: ITextBlock;
  public showColorSelector: boolean = false;

  get serialNumber(): number {
    return this.textBlock.index + 1;
  }

  public change(para: { [name: string]: any }) {
    const { type, arg } = para;
    this.$emit('change', {
      type,
      arg,
      target: this.textBlock,
    });
  }
}
</script>

<template>
  <div class="text-block">
    <span
      class="text-block__serial"
      v-text="`${serialNumber}.`"
    />
    <span 
      class="text-block__content"
      v-text="textBlock.content"
    />
    <span
      class="text-block__color"
      :style="{ backgroundColor: textBlock.fill }"
      @click="showColorSelector = !showColorSelector"
    />
    <color-selector
      v-if="showColorSelector"
      @change-color="change"
    />
  </div>
</template>

<style lang="scss">
  .text-block {
    border: 1px solid #ccc;
    padding: 5px;
    margin-bottom: 3px;

    &__serial,&__content,&__color {
      display: inline-block;
      vertical-align: middle;
    }

    &__serial {
      font-weight: 600;
      margin-right: 6px;
    }

    &__color {
      width: 16px;
      height: 16px;
      margin-left: 12px;
      border-radius: 3px;
      border: 1px solid #aaa;
      cursor: pointer;
    }
  }
</style>


