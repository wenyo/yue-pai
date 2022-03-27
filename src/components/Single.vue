<template>
  <div>
    <ul v-for="(roundInfo, roundIdx) in contestInfo.WIN" :key="roundIdx">
      <Match
        v-for="(game, idx) in roundInfo"
        :key="idx"
        :game="game"
        :contest-type="type"
        :game-type="GAME_TYPE.WIN"
        :idx="idx"
        :roundIdx="roundIdx"
        :team-name-change="teamNameChange"
        :game-date-change="gameDateChange"
        :game-time-change="gameTimeChange"
        :game-place-change="gamePlaceChange"
        :game-score-change="gameScoreChange"
        :drag-target-info="dragTargetInfo"
        :change-player="changePlayer"
      />
    </ul>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Match from "./Match";
import { GAME_TYPE, NO_SCORE } from "../utils/Enum";
export default {
  data() {
    return {
      GAME_TYPE,
      dragTarget: {},
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
      "playerChangeByDrop",
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
    dragTargetInfo({ roundIdx, idx, playerKey }) {
      this.dragTarget = { roundIdx, idx, playerKey };
    },
    async changePlayer({ roundIdx, idx, playerKey }) {
      const dropTarget = { roundIdx, idx, playerKey };
      const { dragTarget } = this;
      const changeResult = this.playerChangeByDrop({ dropTarget, dragTarget });

      if (!changeResult) return;
      // reset score
      this.gameScoreChange({
        roundIdx: dropTarget.roundIdx,
        idx: dropTarget.idx,
        playerKey: dropTarget.playerKey,
        score: NO_SCORE,
      });
      this.gameScoreChange({
        roundIdx: dragTarget.roundIdx,
        idx: dragTarget.idx,
        playerKey: dragTarget.playerKey,
        score: NO_SCORE,
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
