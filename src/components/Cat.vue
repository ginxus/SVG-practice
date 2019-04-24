
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import SVG from 'svg.js';

@Component
export default class CAT extends Vue {
  @Prop({ required: true }) private msg!: string;

  public isSvgSupport(): boolean {
    return SVG.supported;
  }

  public mounted() {
    this.init();
  }

  public init() {
    const draw = SVG('svg-container__area');

    const eyebowGroup = draw.group();
    const eyebowLeft = draw.ellipse(50, 100)
      .attr({ fill: '#333' });
    const eyebowRight = draw.ellipse(50, 100)
      .attr({ fill: '#333' })
      .move(200, 0);
    eyebowGroup.add(eyebowLeft);
    eyebowGroup.add(eyebowRight);
    eyebowGroup.move(250, 100);

    const star = draw
      .polyline('50,0 60,40 100,50 60,60 50,100 40,60 0,50 40,40 50,0')
      .fill({ color: '#ff0' })
      .stroke('none')
      .move(180, 100);

    const eyebrow = draw
      .line(0, 0, 100, 50)
      .stroke({ color: '#333', width: 12, linecap: 'round' })
      .fill('none')
      .move(230, 30);
    const eyebrow2 = eyebrow
      .clone()
      .move(430, 30)
      .flip('y');

    const monthShadowLeft = draw
      .path('M-30 0 A80 -80, 0 0 0 120 30')
      .fill('none')
      .stroke({ color: '#ccc', width: 12, linecap: 'round' })
      .scale(.8)
      .move(270, 455);
    const monthShadowRight = monthShadowLeft
      .clone()
      .move(390, 355)
      .flip('x');

    const mouth2 = draw
      .path('M-30 -30 A80 -120, 0 0 0 140 60 A80 -120, 0 0 0 310 -30 Z')
      .stroke({ color: '#333', width: 12, linecap: 'miter', miterlimit: 0 })
      .fill('none')
      .move(200, 260);

    const nose = draw
      .rect(100, 60)
      .stroke({ color: '#333', width: 8})
      .fill({ color: '#3C1900' })
      .radius(30)
      .move(330, 250);

    const mustacheLeft1 = draw
      .path('M-40 -30 Q50 -50, 100 0')
      .stroke({ color: '#333', width: 8, linecap: 'round' })
      .fill('none')
      .move(90, 270)
      .rotate(10);
    const mustacheRight1 = mustacheLeft1
      .clone()
      .move(520, 270)
      .flip('x')
      .transform({ rotation: 10 });

    const mustacheLeft2 = draw
      .path('M-80 -30 Q50 -50, 100 0')
      .stroke({ color: '#333', width: 8, linecap: 'round' })
      .fill('none')
      .move(50, 320)
      .rotate(-5);
    const mustacheRight2 = mustacheLeft2
      .clone()
      .move(520, 320)
      .flip('x')
      .transform({ rotation: -5 });

    const mustacheLeft3 = draw
      .path('M-60 -30 Q50 -50, 100 0')
      .stroke({ color: '#333', width: 8, linecap: 'round' })
      .fill('none')
      .move(70, 370)
      .rotate(-20);
    const mustacheRight3 = mustacheLeft3
      .clone()
      .move(520, 370)
      .flip('x')
      .transform({ rotation: -20 });
  }
}
</script>

<template>
  <div class="container">
    <h1 v-text="msg"/>
    <div id="svg-container__area"/>
  </div>
</template>
