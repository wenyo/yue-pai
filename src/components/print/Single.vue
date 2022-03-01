<template>
  <div class="contest" :style="cssVars">
    <template v-for="(roundInfo, roundIdx) in contestInfo.WIN" :key="roundIdx">
      <ul
        class="round"
        :id="`${roundIdx === contestInfo.WIN.length - 2 ? 'final-round' : ''}${
          roundIdx === contestInfo.WIN.length - 1 ? 'final-round-add' : ''
        }`"
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
  components: { Match },
  computed: {
    ...mapState(["contestInfo", "type"]),
    cssVars() {
      return {
        "--win-padding": `${
          90 * Math.pow(2, this.contestInfo.WIN.length - 4) - 45
        }px `,
      };
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
  height: fit-content;
  display: flex;
}

.round {
  padding: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  height: fit-content;

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

  .game:not(:last-child) {
    margin-bottom: 20px;
  }
}

.line {
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
      border-top: 1px solid $dark-100;
      border-right: 1px solid $dark-100;
    }

    &:nth-child(4n-2) {
      border-bottom: 1px solid $dark-100;
      border-right: 1px solid $dark-100;
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

.single {
  & :last-child > .game:first-child {
    margin-left: 150px;

    .front-line {
      width: 170px;
      left: -170px;
    }
  }
}

.contest.win {
  & .round:nth-last-child(3),
  & .line:nth-last-child(2),
  & .round:nth-last-child(1) {
    padding: var(--win-padding) 0;
  }
}
</style>

<style lang="scss">
.win {
  #final-round {
    margin-left: 440px;

    .front-line {
      width: 480px;
      left: -480px;
    }
  }
}
</style>
