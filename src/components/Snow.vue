
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import SVG from 'svg.js';

@Component
export default class Snow extends Vue {
  @Prop({ required: true }) private msg!: string;

  public isSvgSupport(): boolean {
    return SVG.supported;
  }

  public mounted() {
    this.init();
  }

  public init() {
    const draw = SVG('svg-container__area');
    const gradient = draw.gradient('linear', (stop) => {
      stop.at(0, '#fff');
      stop.at(1, '#09f');
    });

    const snowFlakeStemGroup = draw.group();

    const snowFlakeStem = draw
      .line(0, 0, 0, 250)
      .stroke({ color: '#09f', width: 12, linecap: 'round' })
      .attr({fill: gradient})
      .move(380, 100);

    const snowFlakeLeaf1 = draw
      .polyline('0,0 40,50 80,0')
      .fill('none')
      .stroke({ color: '#09f', width: 12, linecap: 'round' })
      .attr({stroke: gradient})
      .move(340, 110);

    const snowFlakeLeaf2 = draw
      .polyline('0,0 60,60 120,0')
      .fill('none')
      .stroke({ color: '#09f', width: 12, linecap: 'round' })
      .attr({stroke: gradient})
      .move(320, 160);

    const snowFlakeLeaf3 = draw
      .polyline('0,0 80,70 160,0')
      .fill('none')
      .stroke({ color: '#09f', width: 12, linecap: 'round' })
      .attr({stroke: gradient})
      .move(300, 210);

    snowFlakeStemGroup
      .add(snowFlakeStem)
      .add(snowFlakeLeaf1)
      .add(snowFlakeLeaf2)
      .add(snowFlakeLeaf3);

    snowFlakeStemGroup
      .clone()
      .rotate(60, 380, 350)
      .clone()
      .rotate(120, 380, 350)
      .clone()
      .rotate(180, 380, 350)
      .clone()
      .rotate(240, 380, 350)
      .clone()
      .rotate(300, 380, 350);
  }
}
</script>

<template>
  <div class="container">
    <h1 v-text="msg"/>
    <div id="svg-container__area"/>
  </div>
</template>


