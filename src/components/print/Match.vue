<template>
  <li class="game">
    <div class="top">
      <span>{{ match_data.round }}-{{ match_data.game_number }}</span>
      <div>{{ match_data.game.place ?? "" }}</div>
    </div>
    <ul class="middle">
      <li v-for="playerKey in Object.keys(PLAYER_KEY)" :key="playerKey">
        <div v-if="match_data.nameGet(playerKey) !== ''">
          {{ match_data.nameGet(playerKey) }}
        </div>
        <div v-else class="font-dark-200">
          {{ match_data.namePlaceholderGet(playerKey) }}
        </div>
        <div v-if="match_data.scoreValue(playerKey) !== ''">
          {{ match_data.scoreValue(playerKey) }}
        </div>
        <div v-else class="font-dark-200">比分</div>
      </li>
    </ul>
    <div class="bottom">
      <div>{{ match_data.game.date ?? "" }}</div>
      <div>{{ match_data.game.time ?? "" }}</div>
    </div>
  </li>
</template>

<script>
import { mapState } from "vuex";
import {
  ROUND,
  PLAYER_KEY,
  NO_SCORE,
  GAME_TYPE,
  NO_ID,
} from "../../utils/Enum";
import MatchData from "../MatchData.js";

export default {
  props: ["contestType", "game", "idx", "roundIdx"],
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
      console.log(this.contestType);
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
.game {
  width: fit-content;
  margin-bottom: 20px;
}
.top,
.bottom {
  display: flex;
  justify-content: space-between;
}

.middle {
  li {
    width: 150px;
    display: flex;
  }
  div {
    border: 1px solid $dark-100;
    padding: 2px;
    box-sizing: border-box;
    &:first-child {
      width: 70%;
    }
    &:last-child {
      width: 30%;
    }
  }
}

.font-dark-200 {
  color: $dark-200;
}
</style>
