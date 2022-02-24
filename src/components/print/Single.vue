<template>
  <div class="contest" :style="cssVars">
    <ul
      class="round"
      v-for="(roundInfo, roundIdx) in contestInfo.WIN"
      :key="roundIdx"
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
        "--ul-height": `${90 * this.contestInfo.WIN[0].length}px`,
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

<style lang="scss">
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
.round {
  height: var(--ul-height);
  padding: 0 0;
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

.game {
  position: relative;
}

.game::after {
  content: "";
  width: 20px;
  border-right: 1px solid #000;
  position: absolute;
  right: -20px;
}

.round:not(:first-child) > .game::before {
  content: "";
  width: 20px;
  height: 1px;
  background-color: #000;
  position: absolute;
  left: -20px;
  top: 50%;
}

// fix:長度是錯ㄉQQ
.round:first-child > .game:nth-child(odd)::after {
  border-right: 2px solid pink;
  height: 20px;
  border-top: 1px solid #000;
  top: 50%;
}

.round:first-child > .game:nth-child(even)::after {
  // height: 100%;
  border-bottom: 1px solid #000;
  bottom: calc(50% - 1px);
}

.round:nth-child(2) > .game:nth-child(odd)::after {
  border-right: 1px solid pink;
  height: 100%;
  border-top: 1px solid #000;
  top: 50%;
}

.round:nth-child(2) > .game:nth-child(even)::after {
  height: 110px;
  border-bottom: 1px solid #000;
  bottom: calc(50% - 1px);
}

.round:nth-child(3) > .game:nth-child(odd)::after {
  border-right: 1px solid pink;
  height: 290px;
  border-top: 1px solid #000;
  top: 50%;
}

.round:nth-child(3) > .game:nth-child(even)::after {
  height: 290px;
  border-bottom: 1px solid #000;
  bottom: calc(50% - 1px);
}

.round:nth-child(4) > .game:nth-child(odd)::after {
  border-right: 1px solid pink;
  height: 650px;
  border-top: 1px solid #000;
  top: 50%;
}

.round:nth-child(4) > .game:nth-child(even)::after {
  height: 650px;
  border-bottom: 1px solid #000;
  bottom: calc(50% - 1px);
}

.round:nth-child(5) > .game:nth-child(odd)::after {
  border-right: 1px solid pink;
  height: 1370px;
  border-top: 1px solid #000;
  top: 50%;
}

.round:nth-child(5) > .game:nth-child(even)::after {
  height: 1370px;
  border-bottom: 1px solid #000;
  bottom: calc(50% - 1px);
}

.round:last-child > .game::after {
  content: unset;
}
</style>
