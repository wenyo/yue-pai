<template>
  <div class="contest" :style="cssVars">
    <ul
      v-for="(roundInfo, roundIdx) in contestInfo.WIN"
      :key="roundIdx"
      :style="`height:${90 * contestInfo.WIN[0].length}px`"
    >
      <Match
        v-for="(game, idx) in roundInfo"
        :key="idx"
        :game="game"
        :idx="idx"
        :roundIdx="roundIdx"
        :contestType="type"
      />
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Match from "./Match.vue";
export default {
  mounted() {
    // window.print();
  },
  components: { Match },
  computed: {
    ...mapState(["contestInfo", "type"]),
    cssVars() {
      return {
        "--bg-color": "pink",
        "--const-len": this.contestInfo.WIN.length,
        "--round-one-len": this.contestInfo.WIN[0].length,
        "--test": [0, 0, 0],
      };
    },
    methods: {
      paddingTopGet(n) {
        const liHeight = 70;
        const liMargin = 20;
        const multiplier = Math.pow(2, n);
        const prevRoundHeight = liHeight * multiplier + liMargin * multiplier;

        console.log(prevRoundHeight);

        return prevRoundHeight / 2 - liHeight / 2;
      },
    },
  },
};
</script>

<style lang="scss" scoped>
@function pow($number, $exponent) {
  $value: 1;

  @if $exponent > 0 {
    @for $i from 1 through $exponent {
      $value: $value * $number;
    }
  }

  @return $value;
}
.contest {
  display: flex;
  align-items: center;
}
ul {
  margin-right: 60px;
  position: relative;
  color: var(--bg-color);
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  $max: 6;
  @for $i from 2 through $max {
    &:nth-child(#{$i}) {
      @if $i==2 {
        padding: 45px 0;
      } @else {
        padding: #{(70 * pow(2, $i - 1) + 20 * (pow(2, $i - 1)-1)) / 2-35}px 0;
      }
    }
  }
}
</style>
