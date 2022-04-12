<template>
  <div class="contest">
    <div v-for="(info, groupIdx) in contestInfo.ROUND" :key="groupIdx">
      <h4>第{{ groupIdx + 1 }}組</h4>
      <div class="group">
        <ul v-for="(roundInfo, roundIdx) in info" :key="roundIdx">
          <Match
            v-for="(game, idx) in roundInfo"
            :key="idx"
            :game="game"
            :idx="idx"
            :round-idx="roundIdx"
            :group-idx="groupIdx"
            :contest-type="type"
            :game-type="GAME_TYPE.WIN"
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
    </div>
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
    dragTargetInfo({ roundIdx, idx, playerKey, groupIdx }) {
      this.dragTarget = { roundIdx, idx, playerKey, groupIdx };
    },
    changePlayer({ roundIdx, idx, playerKey, groupIdx }) {
      const dropTarget = { roundIdx, idx, playerKey, groupIdx };
      const { dragTarget } = this;
      this.playerChangeByDrop({ dropTarget, dragTarget });
    },
  },
};
</script>

<style lang="scss" scoped>
.contest {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.group {
  display: flex;
  margin-bottom: 50px;
}

ul {
  li {
    margin-bottom: 20px;
  }
}

h4 {
  flex: 1 0 100%;
}
</style>
