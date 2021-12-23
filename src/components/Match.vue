<template>
  <li>
    <div>
      <input
        class="w-70"
        type="text"
        name=""
        id=""
        placeholder="隊伍名稱"
        :value="game.player1.id"
      />
      <input
        class="w-30"
        type="number"
        name=""
        id=""
        :placeholder="this.game.bye ? '-' : '比分'"
        :disabled="this.game.bye"
      />
    </div>
    <div>
      <input
        class="w-70"
        type="text"
        name=""
        id=""
        :value="game.player2.id"
        :placeholder="this.game.bye ? '輪空' : '隊伍名稱'"
        :disabled="this.game.bye"
      />
      <input
        class="w-30"
        type="number"
        name=""
        id=""
        :placeholder="this.game.bye ? '-' : '比分'"
        :disabled="this.game.bye"
      />
    </div>
    <div>
      <input class="w-50" type="date" name="" id="" :disabled="this.game.bye" />
      <input
        class="w-50"
        type="text"
        name=""
        id=""
        :placeholder="this.game.bye ? '-' : '場地'"
        :disabled="this.game.bye"
      />
    </div>
  </li>
</template>

<script>
export default {
  props: ["game", "idx", "round"],
  computed: {
    valueHomeTeam() {
      switch (this.round) {
        case 1:
          break;

        default:
          break;
      }
      return "";
    },
    valueAwayTeam() {
      switch (this.round) {
        case 1:
          break;

        default:
          break;
      }
      return "";
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