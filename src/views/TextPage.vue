<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TextPersonalize from '@/components/svg-text/Text.vue';

@Component({
  components: {
    TextPersonalize,
  },
})
export default class TextPage extends Vue {

  //  dashBoard:
    // 1. enable user to type the text
    // 2. enalbe user to select the template
    // 3. enable user to adjust the position ...etc
    // 4. emit change event when theres' any changed occurred

  //  displayer:
    // receive the object passed from '' and render it

}
</script>

<template>
  <div class="text-page">
    <text-personalize :msg="'THIS IS TEXT PAGE'"/>
  </div>
</template>



