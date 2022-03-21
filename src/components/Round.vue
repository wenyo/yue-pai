<template>
  <div class="contest">
    <ul v-for="(roundInfo, roundIdx) in contestInfo.WIN" :key="roundIdx">
      <Match
        v-for="(game, idx) in roundInfo"
        :key="idx"
        :game="game"
        :idx="idx"
        :roundIdx="roundIdx"
        :contest-type="type"
        :game-type="GAME_TYPE.WIN"
        :team-name-change="teamNameChange"
        :game-date-change="gameDateChange"
        :game-time-change="gameTimeChange"
        :game-place-change="gamePlaceChange"
        :game-score-change="gameScoreChange"
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
    ...mapState(["contestInfo"]),
  },
  methods: {
    ...mapMutations([
      "teamNameChange",
      "gameDateChangeByType",
      "gameTimeChangeByType",
      "gamePlaceChangeByType",
      "gameScoreChangeByType",
    ]),
    gameDateChange({ roundIdx, idx, date }) {
      this.gameDateChangeByType({
        type: GAME_TYPE.WIN,
        roundIdx,
        idx,
        date,
      });
    },
    gameTimeChange({ roundIdx, idx, time }) {
      this.gameTimeChangeByType({
        type: GAME_TYPE.WIN,
        roundIdx,
        idx,
        time,
      });
    },
    gamePlaceChange({ roundIdx, idx, place }) {
      this.gamePlaceChangeByType({
        type: GAME_TYPE.WIN,
        roundIdx,
        idx,
        place,
      });
    },
    gameScoreChange({ roundIdx, idx, playerKey, score }) {
      this.gameScoreChangeByType({
        type: GAME_TYPE.WIN,
        roundIdx,
        idx,
        playerKey,
        score,
      });
    },
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
