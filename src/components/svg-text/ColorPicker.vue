<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { availableColor } from '@/configs/general';
import ColorBrick from '@/components/svg-text/ColorBrick.vue';

@Component({ components: { ColorBrick } })
export default class ColorPicker extends Vue {

  public availableColors: string[] = availableColor;

  public change(
    param: {
      property: string;
      value: any;
    },
  ) {
    this.$emit('change', param);
  }
}
</script>

<template>
  <div class="color-picker">
    <color-brick
      :available-colors="availableColors"
      @change-color="change"
    />
  </div>
</template>

<style lang="scss">
  .color-picker {
    background-color: #aaa;
  }
</style>


