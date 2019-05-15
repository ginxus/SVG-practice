<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { ITextBlock, ITemplate, IActives } from '@/components/svg-text/type';

@Component
export default class BarController extends Vue {
  @Prop({required: true}) public controllerName!: string;
  @Prop({required: true}) public name!: string;
  @Prop({required: true}) public min!: number;
  @Prop({required: true}) public max!: number;
  @Prop({required: true}) public value!: number;
  @Prop({required: true}) public step!: number;

  public currentValue: number = 0;

  public mounted() {
    this.currentValue = this.value;
  }

  public update() {
    const input: HTMLInputElement | null = document.querySelector('#' + this.name);
    if (input) {

      const updatedValue = input.value;
      this.currentValue = Number(updatedValue);

      const param = {
        index: null,
        property: this.name,
        value: updatedValue,
      };
      this.$emit('update', param);
    }
  }
}
</script>

<template>
  <div class="controller">
    <div class="controller__name">
      <span v-text="controllerName"/>
    </div>
    <div class="controller__dashboard">
      <input
        type="range"
        :id="name"
        :min="min"
        :max="max"
        :value="value"
        :step="step"
        @input="update"
      >
    </div>
  </div>
</template>

<style lang="scss">

  .controller {

    padding: 5px;
    background-color: #aaa;
    display: flex;
    justify-content: center;
    align-items: center;

    &__name, &__dashboard {
      flex: 50%;
    }

    &__name {
      color: #fff;
      font-size: 16px;
      font-weight: 600;
    }

    &__dashboard {
      padding: 5px;
      margin: 5px 0px;
      position: relative;
    }
  }
</style>


