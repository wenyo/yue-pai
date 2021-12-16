<template>
  <ul>
    <Match
      v-for="(game, idx) in gameInfo[round]"
      :key="idx"
      :game="game"
      :idx="idx + 1"
      :round="round + 1"
    />
  </ul>
</template>

<script>
import { mapState } from "vuex";
import Match from "./Match";
export default {
  props: ["round"],
  components: { Match },
  computed: {
    ...mapState(["gameInfo"]),
  },
};
</script>

<style lang="scss" scoped>
ul {
  height: 100%;
  li {
    margin-bottom: 20px;
  }
}
</style>