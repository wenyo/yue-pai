<template>
  <ul>
    <Match
      v-for="(game, idx) in contestInfo.WIN[round]"
      :key="idx"
      :game="game"
      :idx="idx + 1"
      :round="round + 1"
      :team-name-change="teamNameChange"
      :game-date-change="gameDateChange"
      :game-place-change="gamePlaceChange"
    />
  </ul>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Match from "./Match";
import { GAME_TYPE } from "../utils/Enum";
export default {
  props: ["round"],
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