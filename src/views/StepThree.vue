<template>
  <div class="contain">
    <div class="article">
      <h3>3/填寫日期與場地與調整隊伍</h3>
      <Single />
    </div>
    <div class="step">
      <router-link to="/step_two" custom v-slot="{ navigate }">
        <button @click="navigate">上一步</button>
      </router-link>
      <router-link to="/step_three" custom v-slot="{ navigate }">
        <button @click="navigate">下一步</button>
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Single from "../components/Single";

export default {
  data() {
    return {};
  },
  created() {
    this.contestInfoSizeChange(this.teamCount);
  },
  components: { Single },
  computed: {
    ...mapState(["teamCount"]),
  },
  methods: {
    ...mapActions(["contestInfoSizeChange"]),
  },
};
</script>

<style lang="scss" scoped>
.article > div {
  display: flex;
  flex-direction: row;
}
ul {
  width: 100%;
  display: flex;
  flex-wrap: wrap;

  li {
    width: 25%;
  }
}
</style>
