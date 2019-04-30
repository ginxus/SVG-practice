<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

const colors = [ '#f00', '#0f0', '#00f', '#000', '#fff' ];

@Component
export default class ColorSelector extends Vue {
  public colors: string[] = colors;

  public changeColor(para: { [name: string]: any }) {
    this.$emit('change-color', para);
  }
}
</script>

<template>
  <div class="color-selector">
    <span
      class="color-selector__bricks"
      v-for="(color, index) in colors"
      :key="index"
      :style="{ backgroundColor: color }"
      @click="changeColor({ type: 'color', arg: color })"
    />
  </div>
</template>

<style lang="scss">
  .color-selector {

    background-color: 'brown';
    padding: 10px;

    &__bricks {
      width: 16px;
      height: 16px;
      display: inline-block;
      vertical-align: middle;
      margin-left: 12px;
      border-radius: 3px;
      border: 1px solid #aaa;
    }
  }
</style>


