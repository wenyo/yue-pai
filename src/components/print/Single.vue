<template>
  <div class="contest" :style="cssVars">
    <template v-for="(roundInfo, roundIdx) in contestInfo.WIN" :key="roundIdx">
      <ul class="round">
        <Match
          v-for="(game, idx) in roundInfo"
          :key="idx"
          :game="game"
          :idx="idx"
          :roundIdx="roundIdx"
          :contestType="type"
        />
      </ul>
      <ul class="line" v-if="roundIdx !== contestInfo.WIN.length - 1">
        <template :key="idx" v-for="(game, idx) in roundInfo">
          <template v-if="idx !== roundInfo.length - 1">
            <li></li>
            <li></li>
          </template>
        </template>
      </ul>
    </template>
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
  height: fit-content;
  display: flex;
}

.round {
  padding: 0 0;
  position: relative;
  display: flex;
  flex-direction: column;
  height: fit-content;

  .game {
    position: relative;
    margin-bottom: 20px;
  }

  $max: 6;
  @for $i from 2 through $max {
    &:nth-child(#{$i * 2 - 1}) {
      @if $i==2 {
        padding: 45px 0;
      } @else {
        padding: #{90 * pow(2, $i - 2) - 45}px 0;
      }

      &:not(:last-child) .game:not(:last-child) {
        margin-bottom: #{90 * (pow(2, $i - 1) - 1) + 20}px;
      }
    }
  }
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

.line {
  height: fit-content;
  width: 20px;
  margin-left: -1px;
  margin-right: 20px;
  display: flex;
  flex-direction: column;

  &:nth-child(2) > li {
    height: 45px;
  }

  &:nth-child(4) > li {
    height: 90px;
  }

  &:nth-child(6) > li {
    height: 180px;
  }

  &:nth-child(8) > li {
    height: 360px;
  }

  &:nth-child(10) > li {
    height: 720px;
  }

  li {
    display: block;
    box-sizing: border-box;

    &:nth-child(4n-3) {
      border-top: 1px solid #000;
      border-right: 1px solid #000;
    }

    &:nth-child(4n-2) {
      box-shadow: 0 1px 0 gray;
      border-right: 1px solid #000;
    }
  }

  $max: 6;
  @for $i from 1 through $max {
    &:nth-child(#{$i * 2}) {
      @if $i==1 {
        padding-top: 35px;
      } @else if $i==2 {
        padding: #{45 + 35}px 0;
      } @else {
        padding: #{90 * pow(2, $i - 2) - 10}px 0;
      }
    }
  }
}
</style>
