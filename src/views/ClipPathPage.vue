<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Clip from '@/components/ClipPath.vue';

@Component({ components: { Clip }})
export default class ClipPathPage extends Vue {}
</script>

<template>
  <div class="clip-path-page">
    <clip :msg="'I AM SVG ANIMATION'"/>
  </div>
</template>