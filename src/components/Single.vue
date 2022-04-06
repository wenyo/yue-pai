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
        :round-idx="roundIdx"
        :team-name-change="teamNameChange"
        :game-date-change="gameDateChangeByType"
        :game-time-change="gameTimeChangeByType"
        :game-place-change="gamePlaceChangeByType"
        :game-score-change="gameScoreChangeByType"
        :drag-target-info="dragTargetInfo"
        :change-player="changePlayer"
      />
    </ul>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import Match from "./Match";
import { GAME_TYPE } from "../utils/Enum";
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
    ]),
    ...mapActions(["playerChangeByDrop"]),
    dragTargetInfo({ roundIdx, idx, playerKey }) {
      this.dragTarget = { roundIdx, idx, playerKey };
    },
    changePlayer({ roundIdx, idx, playerKey }) {
      const dropTarget = { roundIdx, idx, playerKey };
      const { dragTarget } = this;
      this.playerChangeByDrop({ dropTarget, dragTarget });
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
