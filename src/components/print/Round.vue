<template>
  <div class="contest">
    <ul
      class="round no-line"
      v-for="(roundInfo, roundIdx) in contestInfo.WIN"
      :key="roundIdx"
    >
      <Match
        v-for="(game, idx) in roundInfo"
        :key="idx"
        :game="game"
        :idx="idx"
        :roundIdx="roundIdx"
      />
    </ul>
  </div>
  <table class="score-table">
    <tr>
      <th>計分板</th>
    </tr>
    <tr>
      <th v-for="(team, idx) in teamInfo" :key="idx">{{ team.name }}</th>
    </tr>
  </table>
</template>

<script>
import { mapState } from "vuex";
import Match from "./Match.vue";
export default {
  components: { Match },
  computed: {
    ...mapState(["contestInfo", "teamInfo"]),
  },
};
</script>

<style lang="scss" scoped>
.contest {
  display: flex;
}

.round {
  margin-right: 40px;

  li {
    margin-bottom: 20px;
  }
}
</style>
