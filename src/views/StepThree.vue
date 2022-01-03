<template>
  <div class="contain">
    <div class="article">
      <h3>3/填寫日期與場地與調整隊伍</h3>
      <Single v-if="type === CONTEST_TYPE.SINGLE.id" />
      <Double v-if="type === CONTEST_TYPE.DOUBLE.id" />
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
import { mapState, mapActions, mapMutations } from "vuex";
import { CONTEST_TYPE } from "../utils/Enum";
import Single from "../components/Single";
import Double from "../components/Double";

export default {
  data() {
    return {
      CONTEST_TYPE,
    };
  },
  created() {
    this.teamCountChange(8);
    // temp for test
    this.contestInfoSizeChange(this.teamCount);
  },
  components: { Single, Double },
  computed: {
    ...mapState(["teamCount", "type"]),
  },
  methods: {
    ...mapMutations(["teamCountChange"]),
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
