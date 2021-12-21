<template>
  <li>
    <div>
      <input
        class="w-70"
        type="text"
        name=""
        id=""
        :placeholder="placeHolderHomeTeam"
        :value="game.player1.id"
      />
      <input class="w-30" type="number" name="" id="" placeholder="比分" />
    </div>
    <div>
      <input
        class="w-70"
        type="text"
        name=""
        id=""
        :value="game.player2.id"
        :placeholder="placeHolderHomeTeam"
      />
      <input class="w-30" type="number" name="" id="" placeholder="比分" />
    </div>
    <div>
      <input class="w-50" type="date" name="" id="" />
      <input class="w-50" type="text" name="" id="" placeholder="場地" />
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
    placeHolderHomeTeam() {
      return "隊伍名稱";
    },
    placeHolderAwayTeam() {
      return "隊伍名稱";
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