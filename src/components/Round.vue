<template>
  <div class="contest">
    <ul v-for="(roundInfo, roundIdx) in contestInfo.WIN" :key="roundIdx">
      <Match
        v-for="(game, idx) in roundInfo"
        :key="idx"
        :game="game"
        :idx="idx"
        :round-idx="roundIdx"
        :contest-type="type"
        :game-type="GAME_TYPE.WIN"
        :team-name-change="teamNameChange"
        :game-date-change="gameDateChangeByType"
        :game-time-change="gameTimeChangeByType"
        :game-place-change="gamePlaceChangeByType"
        :game-score-change="gameScoreChangeByType"
      />
    </ul>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Match from "./Match";
import { GAME_TYPE } from "../utils/Enum";
export default {
  data() {
    return {
      GAME_TYPE,
    };
  },
  components: { Match },
  computed: {
    ...mapState(["contestInfo", "type"]),
  },
  methods: {
    ...mapMutations([
      "teamNameChange",
      "gameDateChangeByType",
      "gameTimeChangeByType",
      "gamePlaceChangeByType",
      "gameScoreChangeByType",
    ]),
  },
};
</script>

<style lang="scss" scoped>
.contest {
  display: flex;
  margin-bottom: 50px;
}
ul {
  li {
    margin-bottom: 20px;
  }
}
</style>
