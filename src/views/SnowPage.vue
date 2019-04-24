<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import Snow from '@/components/Snow.vue';

  @Component({ components: { Snow } })
  export default class SnowPage extends Vue {}
</script>

<template>
  <div class="snow-page">
    <snow :msg="'I AM SNOWFLAKE'"/>
  </div>
</template>
