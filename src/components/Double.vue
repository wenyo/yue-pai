<template>
  <div class="contest">
    <ul v-for="(roundInfo, roundIdx) in contestInfo.WIN" :key="roundIdx">
      <Match
        v-for="(game, idx) in roundInfo"
        :key="idx"
        :game="game"
        :idx="idx"
        :roundIdx="roundIdx"
        :contestType="GAME_TYPE.WIN"
        :team-name-change="teamNameChange"
        :game-date-change="gameDateChangeByWin"
        :game-place-change="gamePlaceChangeByWin"
        :game-score-change="gameScoreChangeByWin"
      />
    </ul>
  </div>
  <div class="contest">
    <ul v-for="(roundInfo, roundIdx) in contestInfo.LOSE" :key="roundIdx">
      <Match
        v-for="(game, idx) in roundInfo"
        :key="idx"
        :game="game"
        :idx="idx"
        :roundIdx="roundIdx"
        :contestType="GAME_TYPE.LOSE"
        :team-name-change="teamNameChange"
        :game-date-change="gameDateChangeByLose"
        :game-place-change="gamePlaceChangeByLose"
        :game-score-change="gameScoreChangeByLose"
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
      "gamePlaceChangeByType",
      "gameScoreChangeByType",
    ]),
    gameDateChangeByWin({ roundIdx, idx, date }) {
      this.gameDateChangeByType({
        type: GAME_TYPE.WIN,
        roundIdx,
        idx,
        date,
      });
    },
    gameDateChangeByLose({ roundIdx, idx, date }) {
      this.gameDateChangeByType({
        type: GAME_TYPE.LOSE,
        roundIdx,
        idx,
        date,
      });
    },
    gamePlaceChangeByWin({ roundIdx, idx, place }) {
      this.gamePlaceChangeByType({
        type: GAME_TYPE.WIN,
        roundIdx,
        idx,
        place,
      });
    },
    gamePlaceChangeByLose({ roundIdx, idx, place }) {
      this.gamePlaceChangeByType({
        type: GAME_TYPE.LOSE,
        roundIdx,
        idx,
        place,
      });
    },
    gameScoreChangeByWin({ roundIdx, idx, playerKey, score }) {
      this.gameScoreChangeByType({
        type: GAME_TYPE.WIN,
        roundIdx,
        idx,
        playerKey,
        score,
      });
    },
    gameScoreChangeByLose({ roundIdx, idx, playerKey, score }) {
      this.gameScoreChangeByType({
        type: GAME_TYPE.LOSE,
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
