<template>
  <div class="contest" :style="cssVars">
    <ul
      class="round"
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
  margin-right: 40px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  $max: 6;
  @for $i from 2 through $max {
    &:nth-child(#{$i}) {
      @if $i==2 {
        padding: 45px 0;
      } @else {
        padding: #{90 * pow(2, $i - 2) - 45}px 0;
      }
    }
  }
}

.round > li {
  position: relative;
}

.round > li::after {
  content: "";
  width: 20px;
  border-right: 1px solid #000;
  position: absolute;
  right: -20px;
}

.round:not(:first-child) > li::before {
  content: "";
  width: 20px;
  height: 1px;
  background-color: #000;
  position: absolute;
  left: -20px;
  top: 50%;
}

// fix:長度是錯ㄉQQ
.round:first-child > li:nth-child(odd)::after {
  border-right: 2px solid pink;
  height: 100%;
  border-top: 1px solid #000;
  top: 50%;
}

.round:first-child > li:nth-child(even)::after {
  height: 45px;
  border-bottom: 1px solid #000;
  bottom: calc(50% - 1px);
}

.round:nth-child(2) > li:nth-child(odd)::after {
  border-right: 1px solid pink;
  height: 110px;
  border-top: 1px solid #000;
  top: 50%;
}

.round:nth-child(2) > li:nth-child(even)::after {
  height: 110px;
  border-bottom: 1px solid #000;
  bottom: calc(50% - 1px);
}

.round:nth-child(3) > li:nth-child(odd)::after {
  border-right: 1px solid pink;
  height: 290px;
  border-top: 1px solid #000;
  top: 50%;
}

.round:nth-child(3) > li:nth-child(even)::after {
  height: 290px;
  border-bottom: 1px solid #000;
  bottom: calc(50% - 1px);
}

.round:nth-child(4) > li:nth-child(odd)::after {
  border-right: 1px solid pink;
  height: 650px;
  border-top: 1px solid #000;
  top: 50%;
}

.round:nth-child(4) > li:nth-child(even)::after {
  height: 650px;
  border-bottom: 1px solid #000;
  bottom: calc(50% - 1px);
}

.round:nth-child(5) > li:nth-child(odd)::after {
  border-right: 1px solid pink;
  height: 1370px;
  border-top: 1px solid #000;
  top: 50%;
}

.round:nth-child(5) > li:nth-child(even)::after {
  height: 1370px;
  border-bottom: 1px solid #000;
  bottom: calc(50% - 1px);
}

.round:last-child > li::after {
  content: unset;
}
</style>
