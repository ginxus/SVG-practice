<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class ColorSelector extends Vue {
  @Prop({ required: true }) public availableColors!: string[];

  public changeColor(para: { [name: string]: any }) {
    this.$emit('change-color', para);
  }
}
</script>

<template>
  <div class="color-selector">
    <span
      class="color-selector__bricks"
      v-for="(color, index) in availableColors"
      :key="index"
      :style="{ backgroundColor: color }"
      @click="changeColor({ property: 'fill', value: color })"
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
      cursor: pointer;
    }
  }
</style>


