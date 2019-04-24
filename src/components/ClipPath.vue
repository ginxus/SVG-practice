<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import SVG from 'svg.js';

@Component
export default class Clip extends Vue {

  @Prop({ required: true }) private msg!: string;

  public mounted() {
    this.init();
  }

  public init() {
    const draw = SVG('svg-container__area');

    const pathString = this.pathCreator({x: 0, y: 0}, 5, 25);
    const path = draw
      .path(pathString)
      .fill('none')
      .stroke({ color: '#333', width: 2 })
      .center(350, 250);
    const length: number = path.length();
    const movingDot = draw
      .circle(15)
      .fill('#09f');

    movingDot
      .animate(10000, '<>')
      .during((pos: any) => {
        const point = path.pointAt(pos * length);
        movingDot.center(point.x, point.y);
      })
      // @ts-ignore
      .loop(100, true);

  }

  public pathCreator(
    startPoint: {x: number, y: number},
    accumlativeR: number,
    cycle: number,
  ): string {

    let r = 0;
    let path = `M${startPoint.x} ${startPoint.x}`;

    for (let i = 0; i < cycle; i++) {

      let artricX, artricY, artricPath, endPointX, endPointY;

      artricX = startPoint.x + r;
      artricY = i % 2 === 0
        ? startPoint.y + r
        : (startPoint.y + r) * -1;
      endPointX = i % 2 === 0
        ? startPoint.x + r * 2
        : startPoint.x + r * -2;
      endPointY = startPoint.y;

      artricPath = ` A${artricX} ${artricY} 0 1 0 ${endPointX} ${endPointY} `;

      path = path.concat(artricPath);

      r += accumlativeR;
    }

    return path;
  }
}
</script>

<template>
  <div class="container">
    <h1 v-text="msg"/>
    <div id="svg-container__area"/>
  </div>
</template>


