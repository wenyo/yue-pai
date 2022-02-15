<template>
  <div class="contest">
    <ul v-for="(roundInfo, roundIdx) in contestInfo.WIN" :key="roundIdx">
      <Match
        v-for="(game, idx) in roundInfo"
        :key="idx"
        :game="game"
        :idx="idx"
        :roundIdx="roundIdx"
      />
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Match from "./Match.vue";
export default {
  mounted() {
    // window.print();
  },
  components: { Match },
  computed: {
    ...mapState(["contestInfo"]),
  },
};
</script>

<style lang="scss" scoped>
.contest {
  display: flex;
}
ul {
  margin-right: 60px;
}
</style>