<template>
  <li v-if="match_data.game.show">
    <div class="title">
      <span>{{ match_data.round }}-{{ match_data.game_number }}</span>
      <span class="red-icon" v-if="match_data.game.championship">決</span>
      <span class="red-icon" v-if="match_data.game.third_place">季</span>
    </div>
    <!-- team name & score -->
    <div v-for="playerKey in Object.keys(PLAYER_KEY)" :key="playerKey" :draggable="match_data.round === ROUND.ONE">
      <div class="drag-icon" v-if="match_data.round === ROUND.ONE">
        <i class="icon-seedling-solid" v-if="match_data.seedCheck(playerKey)"></i>
        <i class="icon-grip-vertical-solid" v-else></i>
      </div>
      <input
        class="w-70"
        type="text"
        name=""
        id=""
        @change="
          teamNameChange({
            idx: match_data.idGet(playerKey),
            name: $event.target.value,
          })
        "
        :placeholder="match_data.namePlaceholderGet(playerKey)"
        :value="match_data.nameGet(playerKey)"
        :disabled="match_data.nameDisabled(playerKey)"
      />
      <input
        class="w-30"
        type="number"
        name=""
        id=""
        @change="
          gameScoreChange({
            roundIdx: match_data.roundIdx,
            idx: match_data.idx,
            playerKey: playerKey,
            score: $event.target.value,
          })
        "
        :placeholder="match_data.game.bye ? '-' : '比分'"
        :value="match_data.scoreValue(playerKey)"
        :disabled="match_data.scoreDisabled(playerKey)"
      />
    </div>
    <!-- date -->
    <div>
      <input
        class="w-40"
        type="date"
        name=""
        id=""
        :disabled="match_data.game.bye"
        :value="match_data.game.date"
        @change="
          gameDateChange({
            roundIdx: match_data.roundIdx,
            idx: match_data.idx,
            date: $event.target.value,
          })
        "
      />
      <input
        class="w-30"
        type="time"
        name=""
        id=""
        :value="match_data.game.time"
        @change="
          gameTimeChange({
            roundIdx: match_data.roundIdx,
            idx: match_data.idx,
            time: $event.target.value,
          })
        "
        :disabled="match_data.game.bye"
      />
      <!-- place -->
      <input
        class="w-30"
        type="text"
        name=""
        id=""
        :value="match_data.game.place"
        :placeholder="match_data.game.bye ? '-' : '場地'"
        :disabled="match_data.game.bye"
        @change="gamePlaceChange({ roundIdx, idx: idx, place: $event.target.value })"
      />
    </div>
  </li>
</template>

<script>
import { mapState } from "vuex";
import { ROUND, PLAYER_KEY, NO_SCORE, GAME_TYPE, NO_ID } from "../utils/Enum";
import MatchData from "./MatchData.js";

export default {
  props: [
    "contestType",
    "game",
    "idx",
    "roundIdx",
    "teamNameChange",
    "gameDateChange",
    "gameTimeChange",
    "gamePlaceChange",
    "gameScoreChange",
  ],
  data() {
    return {
      ROUND,
      PLAYER_KEY,
      NO_SCORE,
      NO_ID,
      GAME_TYPE,
    };
  },
  computed: {
    ...mapState(["teamInfo"]),
    match_data() {
      return new MatchData({
        contestType: this.contestType,
        game: this.game,
        idx: this.idx,
        roundIdx: this.roundIdx,
        teamInfo: this.teamInfo,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
li {
  display: flex;
  flex-direction: column;

  & > div {
    display: flex;
    width: 100%;
  }

  .w-70 {
    width: 70%;
  }
  .w-30 {
    width: 30%;
  }
  .w-40 {
    width: 40%;
  }
  .w-50 {
    width: 50%;
  }
  .drag-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid grey;
    padding: 0 4px;
    cursor: move;

    i {
      font-size: 12px;
    }
  }
}

.title {
  display: flex;
  align-items: center;
  height: 20px;
}
</style>
