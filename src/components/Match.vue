<template>
  <li>
    <div>
      <input
        class="w-70"
        type="text"
        name=""
        id=""
        @change="
          teamNameChange({ idx: game.player1.id, name: $event.target.value })
        "
        :placeholder="placeholderHomeTeam"
        :value="valueHomeTeam"
        :disabled="round !== ROUND_ONE || (game.bye && game.player1.id === '')"
      />
      <input
        class="w-30"
        type="number"
        name=""
        id=""
        @change="gameDateChangeByType()"
        :placeholder="game.bye ? '-' : '比分'"
        :disabled="game.bye"
      />
    </div>
    <div>
      <input
        class="w-70"
        type="text"
        name=""
        id=""
        @change="
          teamNameChange({ idx: game.player2.id, name: $event.target.value })
        "
        :value="valueAwayTeam"
        :placeholder="placeholderAwayTeam"
        :disabled="round !== ROUND_ONE || (game.bye && game.player2.id === '')"
      />
      <input
        class="w-30"
        type="number"
        name=""
        id=""
        :placeholder="game.bye ? '-' : '比分'"
        :disabled="game.bye"
      />
    </div>
    <div>
      <input
        class="w-50"
        type="date"
        name=""
        id=""
        :disabled="game.bye"
        @change="
          gameDateChange({ roundIdx, idx: idx, date: $event.target.value })
        "
      />
      <input
        class="w-50"
        type="text"
        name=""
        id=""
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
import { ROUND_ONE } from "../utils/Enum";

export default {
  props: [
    "game",
    "idx",
    "roundIdx",
    "teamNameChange",
    "gameDateChange",
    "gamePlaceChange",
  ],
  data() {
    return {
      ROUND_ONE,
    };
  },
  computed: {
    ...mapState(["teamInfo"]),
    round() {
      return this.roundIdx + 1;
    },
    valueHomeTeam() {
      return this.valueGet("player1");
    },
    valueAwayTeam() {
      return this.valueGet("player2");
    },
    placeholderHomeTeam() {
      return this.placeholderGet("player1");
    },
    placeholderAwayTeam() {
      return this.placeholderGet("player2");
    },
  },
  methods: {
    placeholderGetFromPrevGame(playerKey) {
      const winnerChose = this.game[playerKey].winner_chose ? "勝者" : "敗者";
      const sort = this.game[playerKey].sort;
      return `${sort.round}-${sort.game_idx} ${winnerChose}`;
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