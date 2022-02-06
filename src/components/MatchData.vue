<template>
  <li v-if="game.show">
    <div class="title">
      <span>{{ round }}-{{ game_number }}</span>
      <span class="red-icon" v-if="game.championship">決</span>
      <span class="red-icon" v-if="game.third_place">季</span>
    </div>
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
        :disabled="nameDisabled(playerKey)"
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
        :placeholder="scoreDefault()"
        :value="
          game[PLAYER_KEY[playerKey]].score === NO_SCORE
            ? ''
            : game[PLAYER_KEY[playerKey]].score
        "
        :disabled="game.bye || game[PLAYER_KEY[playerKey]].id === NO_ID"
      />
    </div>
    <!-- date -->
    <div>
      <input
        class="w-40"
        type="date"
        name=""
        id=""
        :disabled="game.bye"
        :value="game.date"
        @change="
          gameDateChange({ roundIdx, idx: idx, date: $event.target.value })
        "
      />
      <input
        class="w-30"
        type="time"
        name=""
        id=""
        :value="game.time"
        @change="
          gameTimeChange({ roundIdx, idx: idx, time: $event.target.value })
        "
        :disabled="game.bye"
      />
      <!-- place -->
      <input
        class="w-30"
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
import { ROUND, PLAYER_KEY, NO_SCORE, GAME_TYPE, NO_ID } from "../utils/Enum";

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
    ...mapState(["teamInfo", "contestInfo"]),
    round() {
      return this.roundIdx + 1;
    },
    game_number() {
      return this.idx + 1;
    },
    scoreDefault() {
      return this.game.bye ? "-" : "比分";
    },
  },
  methods: {
    placeholderGetFromPrevGame(playerKey) {
      const gameType = this.game[playerKey].game_type;
      const winnerChose = this.game[playerKey].winner_chose;
      const sort = this.game[playerKey].sort;
      const gameTypeText = gameType === GAME_TYPE.WIN ? "勝部" : "敗部";
      const winnerChoseText = winnerChose ? "勝者" : "敗者";
      const prevRound = sort.roundIdx + 1;
      const prevGameSort = sort.game_idx + 1;

      return `${gameTypeText}-${prevRound}-${prevGameSort} ${winnerChoseText}`;
    },
    placeholderGet(playerKey) {
      if (this.game.bye_player.includes(playerKey)) return "輪空";

      if (this.round === this.ROUND.ONE && this.contestType === GAME_TYPE.WIN)
        return "隊伍名稱";
      return this.placeholderGetFromPrevGame(playerKey);
    },
    valueGet(playerKey) {
      const id = this.game[playerKey].id;
      return id === this.NO_ID ? "" : this.teamInfo[id].name;
    },
    nameDisabled(playerKey) {
      return (
        this.contestType === GAME_TYPE.LOSE ||
        this.round !== ROUND.ONE ||
        (this.game.bye && this.game[PLAYER_KEY[playerKey]].id === NO_ID)
      );
    },
    scoreValue(playerKey) {
      return this.game[PLAYER_KEY[playerKey]].score === NO_SCORE
        ? ""
        : this.game[PLAYER_KEY[playerKey]].score;
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
  .w-40 {
    width: 40%;
  }
  .w-50 {
    width: 50%;
  }
}

.title {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.red-icon {
  display: inline-block;
  font-weight: bolder;
  font-size: 13px;
  color: $primary-color-second;
  border: 2px solid $primary-color-second;
  border-radius: 50%;
  margin-left: 2px;
}
</style>
