<template>
  <div class="game-type">勝部</div>
  <Single class="win" />
  <div class="game-type">敗部</div>
  <div class="contest lose">
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
      <ul class="line" v-if="roundIdx !== contestInfo.LOSE.length - 1">
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
export default {
  components: { Match, Single },
  computed: {
    ...mapState(["contestInfo", "type"]),
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
}

.lose .round:nth-child(4n-1) > .game::before {
  width: 40px;
  left: -40px;
}

.round {
  .game:not(:last-child) {
    margin-bottom: 90px;
  }

  $max: 19;
  @for $i from 5 through $max {
    @if $i % 2 ==1 {
      &:nth-child(#{$i}) {
        padding: #{pow(2, floor($i/4))-1} px;
        padding: #{80 * (pow(2, floor($i/4))-1)}px 0;
        .game {
          margin-bottom: #{160 * pow(2, (floor($i / 4))) - 70}px;
        }
      }
    }
  }
}

.line {
  li {
    display: block;
    box-sizing: border-box;

    &:nth-child(4n-3) {
      border-top: unset;
      border-right: unset;
    }

    &:nth-child(4n-2) {
      box-shadow: unset;
      border-right: unset;
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
