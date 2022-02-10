<template>
  <div class="game">
    <div class="top">
      <span>{{ match_data.round }}-{{ match_data.game_number }}</span>
      <div>{{ match_data.game.place ?? "" }}</div>
    </div>
    <ul class="middle">
      <li v-for="playerKey in Object.keys(PLAYER_KEY)" :key="playerKey">
        <div>
          {{
            match_data.nameGet(PLAYER_KEY[playerKey]) !== ""
              ? match_data.nameGet(PLAYER_KEY[playerKey])
              : match_data.namePlaceholderGet(playerKey)
          }}
        </div>
        <div>{{ match_data.scoreValue(playerKey) }}</div>
      </li>
    </ul>
    <div class="bottom">
      <div>{{ match_data.game.date ?? "" }}</div>
      <div>{{ match_data.game.time ?? "" }}</div>
    </div>
  </div>
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
  props: ["contestType", "game", "idx", "roundIdx"], // game data???
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
      console.log(this.game);
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
</style>
