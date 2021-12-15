<template>
  <div class="contain">
    <div class="article">
      <h3>3/填寫日期與場地與調整隊伍</h3>
    </div>
    <ul>
      <Match />
    </ul>
    <div class="step">
      <router-link to="/step_one" custom v-slot="{ navigate }">
        <button @click="navigate">上一步</button>
      </router-link>
      <router-link to="/step_three" custom v-slot="{ navigate }">
        <button @click="navigate">下一步</button>
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Match from "../components/Match";
const maxColumn = 4;

export default {
  data() {
    return {};
  },
  components: { Match },
  computed: {
    ...mapState(["teamInfo"]),
    column() {
      return this.teamInfo.length > maxColumn
        ? maxColumn
        : this.teamInfo.length;
    },
  },
  methods: {
    ...mapMutations(["changeTeamName", "changeSeed"]),
  },
};
</script>

<style lang="scss" scoped>
ul {
  width: 100%;
  display: flex;
  flex-wrap: wrap;

  li {
    width: 25%;
  }
}
</style>
