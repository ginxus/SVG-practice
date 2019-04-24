
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import Cat from '@/components/Cat.vue';

  @Component({ components: { Cat } })
  export default class Home extends Vue {}
</script>

<template>
  <div class="home">
    <cat :msg="'I AM CAT'"/>
  </div>
</template>