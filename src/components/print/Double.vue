<template>
  <div class="game-type">勝部</div>
  <Single class="win" />
  <div v-if="page_break" style="page-break-after: always">1</div>
  <div class="game-type">敗部</div>
  <div
    class="contest lose"
    :class="{
      'count-pow': teamCountPowCheck,
      'count-not-pow': !teamCountPowCheck,
    }"
    :style="cssVars"
  >
    <template v-for="(roundInfo, roundIdx) in contestInfo.LOSE" :key="roundIdx">
      <ul class="round">
        <Match
          v-for="(game, idx) in roundInfo"
          :key="idx"
          :game="game"
          :idx="idx"
          :round-idx="roundIdx"
          :contest-type="type"
        />
      </ul>
      <ul class="line">
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
import Single from "./Single.vue";
import Match from "./Match.vue";
import { CONTEST_TYPE } from "../../utils/Enum";
export default {
  components: { Match, Single },
  data() {
    return {
      CONTEST_TYPE,
    };
  },
  computed: {
    ...mapState(["contestInfo", "type", "teamCountPowCheck"]),
    cssVars() {
      return {
        "--defeat-even": false,
        "--defeat-last-line-height": `${this.lastLineHeight()}px`,
        "--defeat-last-line-height-print": `${this.lastLineHeightInPrint()}px`,
        "--defeat-last-line-pos": `${this.lastLinePosition()}px`,
      };
    },
    page_break() {
      return (
        this.type === this.CONTEST_TYPE.DOUBLE.id &&
        this.contestInfo.WIN[0].length >= 16
      );
    },
  },
  methods: {
    lastLineHeight() {
      const maxWinInOneRound = this.contestInfo.WIN[0].length;
      const maxLoseInOneRound = this.contestInfo.LOSE[0].length;
      const winHeight = maxWinInOneRound * 70 + (maxWinInOneRound - 1) * 20;
      const loseHeight = maxLoseInOneRound * 70 + (maxLoseInOneRound - 1) * 90;
      const addHeight = this.page_break ? 50 : 70;
      return (winHeight + loseHeight) / 2 + addHeight;
    },
    lastLineHeightInPrint() {
      const pageHeight = 1122;
      const maxWinInOneRound = this.contestInfo.WIN[0].length;
      const maxLoseInOneRound = this.contestInfo.LOSE[0].length;
      const winHeight = maxWinInOneRound * 70 + (maxWinInOneRound - 1) * 20;
      const loseHeight = maxLoseInOneRound * 70 + (maxLoseInOneRound - 1) * 90;
      // 16
      switch (maxWinInOneRound) {
        case 4:
          return this.lastLineHeight();
        case 8:
          return this.lastLineHeight();
        case 16:
          return pageHeight * 2 - winHeight / 2 - 146 + loseHeight / 2 + 150;
        default:
          break;
      }
    },
    lastLinePosition() {
      const maxLoseInOneRound = this.contestInfo.LOSE[0].length;
      const loseHeight = maxLoseInOneRound * 70 + (maxLoseInOneRound - 1) * 90;
      return loseHeight / 2;
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

$defeat-even: bool(--defeat-even);
$max: 19;
$even-start: 5;
$odd-start: 3;

.contest {
  display: flex;
}

.game-type {
  border: 1px solid $dark-200;
  width: 500px;
  height: 30px;
  margin: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.round {
  .game:not(:last-child) {
    margin-bottom: 90px;
  }
}

.line {
  $max: 19;
  $even-start: 4;
  $odd-start: 1;
}

.count-pow {
  .round {
    &:nth-child(4n - 1) > .game.no-bye > .front-line {
      width: 40px;
      left: -40px;
    }

    $max: 19;
    $even-start: 5;
    $odd-start: 3;

    @for $i from $even-start through $max {
      @if $i % 2 ==1 {
        &:nth-child(#{$i}) {
          padding: #{80 * (pow(2, floor($i/4))-1)}px 0;

          .game:not(:last-child) {
            margin-bottom: #{160 * pow(2, (floor($i / 4))) - 70}px;
          }
        }
      }
    }
  }

  .line {
    $max: 19;
    $even-start: 4;
    $odd-start: 1;
    @for $i from $even-start through $max {
      @if $i % 4 == 0 {
        $rule1: $i / pow(2, 2);
        $rule2: pow(2, $rule1 - 1);
        &:nth-child(#{$i}) {
          padding-top: #{35 + 80 * ($rule2 - 1)}px;

          li {
            display: block;
            box-sizing: border-box;
            height: #{80 * $rule2}px;

            &:nth-child(4n-3) {
              border-top: 1px solid $dark-100;
              border-right: 1px solid $dark-100;
            }

            &:nth-child(4n-2) {
              border-bottom: 1px solid $dark-100;
              border-right: 1px solid $dark-100;
            }
          }
        }
      }
    }
  }
}

.count-not-pow {
  $max: 19;
  $even-start: 5;
  $odd-start: 3;
  .round {
    &:nth-child(4n + 1) > .game.no-bye .front-line {
      width: 40px;
      left: -40px;
    }

    .game:not(:last-child) {
      margin-bottom: 90px;
    }

    @for $i from $odd-start through $max {
      @if $i % 2 == 1 {
        &:nth-child(#{$i}) {
          padding: #{80 * (pow(2, floor(($i + 2)/4))-1)}px 0;

          .game:not(:last-child) {
            margin-bottom: #{160 * pow(2, (floor(($i + 2) / 4))) - 70}px;
          }
        }
      }
    }
  }

  .line {
    $max: 19;
    $even-start: 4;
    $odd-start: 1;

    @for $i from $odd-start through $max {
      @if ($i - 2) % 4 == 0 {
        $rule1: ($i + 2) / pow(2, 2);
        $rule2: pow(2, $rule1 - 1);
        &:nth-child(#{$i}) {
          padding-top: #{35 + 80 * ($rule2 - 1)}px;

          li {
            display: block;
            box-sizing: border-box;
            height: #{80 * $rule2}px;

            &:nth-child(4n-3) {
              border-top: 1px solid $dark-100;
              border-right: 1px solid $dark-100;
            }

            &:nth-child(4n-2) {
              border-bottom: 1px solid $dark-100;
              border-right: 1px solid $dark-100;
            }
          }
        }
      }
    }
  }
}

.lose {
  position: absolute;

  .line:last-child {
    border-bottom: 1px solid $dark-100;
    border-right: 1px solid $dark-100;
    padding-top: var(--defeat-last-line-height);
    position: absolute;
    right: -19px;
    bottom: var(--defeat-last-line-pos);
    margin: 0;

    @media print {
      padding-top: var(--defeat-last-line-height-print);
    }
  }
}
</style>
