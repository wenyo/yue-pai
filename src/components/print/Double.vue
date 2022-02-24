<template>
  <Single />
  <div class="contest">
    <ul v-for="(roundInfo, roundIdx) in contestInfo.LOSE" :key="roundIdx">
      <Match
        v-for="(game, idx) in roundInfo"
        :key="idx"
        :game="game"
        :idx="idx"
        :round-idx="roundIdx"
        :contest-type="type"
      />
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Single from "./Single.vue";
import Match from "./Match.vue";
export default {
  components: { Match, Single },
  computed: {
    ...mapState(["contestInfo", "type"]),
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

.single {
  & :nth-last-child(3),
  & :nth-last-child(2),
  & :nth-last-child(1) {
    padding: 0 0;
  }
}
</style>
