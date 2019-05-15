<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { colors } from '@/configs/general';
import { ITextDesignV2 } from '@/components/svg-text/type';
import templateConfig from '@/configs/template';
import ColorBrick from '@/components/svg-text/ColorBrick.vue';

@Component({ components: { ColorBrick } })
export default class ColorPicker extends Vue {

  @Prop({ required: true }) public design!: ITextDesignV2;

  public availableColors: string[] = [];
  public currentColor: string = '';

  @Watch('design', { deep: true })
  public onDesignChange() {
    const c = Array.from(colors);
    if (this.design.template.background) { c.push('transparent'); }
    this.availableColors = c;

    this.currentColor = this.design.customProps.fill
      ? this.design.customProps.fill as string
      : this.currentColor = this.design.template.fill;
  }

  public change(color: string) {

    if (color === 'transparent') {
      this.$emit('update', { index: null, property: 'masked', value: true });
    } else {
      if (this.design.template.background) {
        this.$emit('update', { index: null, property: 'masked', value: false });
      }
      this.$emit('update', { index: null, property: 'fill', value: color });
    }
  }
}
</script>

<template>
  <div class="color-picker">

    <div class="color-picker__current-color">
      <label v-text="'Current : '"/>
      <span
        :style="{'background-color': currentColor }"
        :class="[
          'brick',
        ]"
      />
    </div>

    <div class="color-picker__options">
      <color-brick
        v-for="(color, index) in availableColors"
        :key="index"
        :color="color"
        @change-color="change"
      />
    </div>

  </div>
</template>

<style lang="scss">
  .color-picker {
    display: flex;
    padding: 10px 0px;
    justify-content: center;
    align-items: center;
    background-color: #aaa;

    &__current-color, &__options { flex: 50%; }

    &__current-color {
      label {
        color: #fff;
        font-weight: 600;
      }
      .brick {
        width: 16px;
        height: 16px;
        display: inline-block;
        vertical-align: middle;
        margin-left: 12px;
        border-radius: 3px;
        cursor: pointer;
        background-color: #ccc;
      }
    }
  }
</style>


