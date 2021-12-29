<template>
  <li>
    <!-- team name & score -->
    <div v-for="playerKey in Object.keys(PLAYER_KEY)" :key="playerKey">
      <input
        class="w-70"
        type="text"
        name=""
        id=""
        @change="
          teamNameChange({
            idx: game[PLAYER_KEY[playerKey]].id,
            name: $event.target.value,
          })
        "
        :placeholder="placeholderGet(PLAYER_KEY[playerKey])"
        :value="valueGet(PLAYER_KEY[playerKey])"
        :disabled="
          round !== ROUND_ONE ||
          (game.bye && game[PLAYER_KEY[playerKey]].id === '')
        "
      />
      <input
        class="w-30"
        type="number"
        name=""
        id=""
        @change="
          gameScoreChange({
            roundIdx,
            idx: idx,
            playerKey: PLAYER_KEY[playerKey],
            score: $event.target.value,
          })
        "
        :placeholder="game.bye ? '-' : '比分'"
        :value="
          game[PLAYER_KEY[playerKey]].score === NO_SCORE
            ? ''
            : game[PLAYER_KEY[playerKey]].score
        "
        :disabled="game.bye"
      />
    </div>
    <!-- date -->
    <div>
      <input
        class="w-50"
        type="date"
        name=""
        id=""
        :disabled="game.bye"
        :value="game.time"
        @change="
          gameDateChange({ roundIdx, idx: idx, date: $event.target.value })
        "
      />
      <!-- place -->
      <input
        class="w-50"
        type="text"
        name=""
        id=""
        :value="game.place"
        :placeholder="game.bye ? '-' : '場地'"
        :disabled="game.bye"
        @change="
          gamePlaceChange({ roundIdx, idx: idx, place: $event.target.value })
        "
      />
    </div>
  </li>
</template>

<script>
import { mapState } from "vuex";
import { ROUND_ONE, PLAYER_KEY, NO_SCORE } from "../utils/Enum";

export default {
  props: [
    "game",
    "idx",
    "roundIdx",
    "teamNameChange",
    "gameDateChange",
    "gamePlaceChange",
    "gameScoreChange",
  ],
  data() {
    return {
      ROUND_ONE,
      PLAYER_KEY,
      NO_SCORE,
    };
  },
  computed: {
    ...mapState(["teamInfo"]),
    round() {
      return this.roundIdx + 1;
    },
  },
  methods: {
    placeholderGetFromPrevGame(playerKey) {
      const winnerChose = this.game[playerKey].winner_chose ? "勝者" : "敗者";
      const sort = this.game[playerKey].sort;
      const prevRound = sort.roundIdx + 1;
      return `${prevRound}-${sort.game_idx} ${winnerChose}`;
    },
    placeholderGet(playerKey) {
      switch (this.round) {
        case this.ROUND_ONE:
          return this.game.bye && this.game[playerKey].id === ""
            ? "輪空"
            : "隊伍名稱";
        default:
          return this.placeholderGetFromPrevGame(playerKey);
      }
    },
    valueGet(playerKey) {
      const id = this.game[playerKey].id;
      return id ? this.teamInfo[id].name : "";
    },
  },
};
</script>

<style lang="scss" scoped>
li {
  display: flex;
  flex-direction: column;

  & > div {
    width: 100%;
  }

  .w-70 {
    width: 70%;
  }
  .w-30 {
    width: 30%;
  }
  .w-50 {
    width: 50%;
  }
}
</style>
