<template>
  <li>
    <div>
      <input
        class="w-70"
        type="text"
        name=""
        id=""
        :placeholder="placeholderHomeTeam"
        :value="valueHomeTeam"
        :disabled="game.bye && game.player1.id === ''"
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
        class="w-70"
        type="text"
        name=""
        id=""
        :value="valueAwayTeam"
        :placeholder="placeholderAwayTeam"
        :disabled="game.bye && game.player2.id === ''"
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
      <input class="w-50" type="date" name="" id="" :disabled="game.bye" />
      <input
        class="w-50"
        type="text"
        name=""
        id=""
        :placeholder="game.bye ? '-' : '場地'"
        :disabled="game.bye"
      />
    </div>
  </li>
</template>

<script>
import { mapState } from "vuex";
// import { noScore } from "../utils/Enum";
const ROUND_ONE = 1;

export default {
  props: ["game", "idx", "round"],
  computed: {
    ...mapState(["teamInfo", "gameInfo"]),
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
        case ROUND_ONE:
          return this.game.bye && this.game[playerKey].id === ""
            ? "輪空"
            : "隊伍名稱";
        default:
          return this.placeholderGetFromPrevGame(playerKey);
      }
    },
    valueGetFromPrevGame(game) {
      const sort = game.sort;
      const preGame = this.gameInfo[sort.round - 1][sort.game_idx];
      if (preGame.bye) {
        const id = preGame.player1.id || preGame.player2.id;
        return id;
      }
      return "";
    },
    valueGet(playerKey) {
      return this.game[playerKey].id;
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