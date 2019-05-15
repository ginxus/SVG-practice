<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class ColorBrick extends Vue {
  @Prop({ required: true }) public color!: string;

  public changeColor(color: string) {
    this.$emit('change-color', color);
  }
}
</script>

<template>
  <div
    :style="{'background-color': color}"
    :class="[
      'color-brick',
      { transparent: color === 'transparent' }
    ]"
    @click="changeColor(color)"
  />
</template>

<style lang="scss">
  .color-brick {
    width: 16px;
    height: 16px;
    display: inline-block;
    vertical-align: middle;
    margin-left: 12px;
    border-radius: 3px;
    cursor: pointer;

    &.transparent {
      box-sizing: border-box;
      background-color: #fff;
      border: 1px solid #333;
      position: relative;

      &:after {
        content: '';
        display: block;
        height: 17px;
        width: 1px;
        background-color: #333;
        position: absolute;
        left: 50%;
        top: 0;
        transform: 
          translate(-50%, 0)
          rotate(45deg);
      }
    }
  }

 
</style>


