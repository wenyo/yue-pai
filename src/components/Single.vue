<template>
  <div>
    <ul v-for="(roundInfo, roundIdx) in contestInfo.WIN" :key="roundIdx">
      <Match
        v-for="(game, idx) in roundInfo"
        :key="idx"
        :game="game"
        :idx="idx + 1"
        :roundIdx="roundIdx"
        :team-name-change="teamNameChange"
        :game-date-change="gameDateChange"
        :game-place-change="gamePlaceChange"
      />
    </ul>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Match from "./Match";
import { GAME_TYPE } from "../utils/Enum";
export default {
  components: { Match },
  computed: {
    ...mapState(["contestInfo"]),
  },
  methods: {
    ...mapMutations([
      "teamNameChange",
      "gameDateChangeByType",
      "gamePlaceChangeByType",
    ]),
    gameDateChange({ round, idx, date }) {
      this.gameDateChangeByType({
        type: GAME_TYPE.WIN,
        round,
        idx,
        date,
      });
    },
    gamePlaceChange({ round, idx, place }) {
      this.gamePlaceChangeByType({
        type: GAME_TYPE.WIN,
        round,
        idx,
        place,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
ul {
  height: 100%;
  li {
    margin-bottom: 20px;
  }
}
</style>