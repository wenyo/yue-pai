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
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.contest {
  display: flex;
  align-items: center;
}
ul {
  margin-right: 60px;
  position: relative;
  color: var(--bg-color);

  $max: 20;
  @for $i from 2 through $max {
    @if $i==2 {
      &:nth-child(#{$i}) {
        li:first-child {
          margin-top: 45px;
        }

        li:nth-child(2) {
          margin-top: 100px;
        }

        @for $j from 3 through $max {
          li:nth-child(#{$j}) {
            margin-top: 110px;
          }
        }
      }
    }
  }
}
</style>
