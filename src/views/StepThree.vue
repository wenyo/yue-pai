<template>
  <Header />
  <div class="contain">
    <StepLine :now-step="3" />
    <h3 class="step-title">3/填寫日期與場地與調整隊伍</h3>
    <div class="article">
      <Single v-if="type === CONTEST_TYPE.SINGLE.id" />
      <Double v-if="type === CONTEST_TYPE.DOUBLE.id" />
      <Round v-if="type === CONTEST_TYPE.ROUND.id" />
    </div>
  </div>
  <div class="step">
    <router-link to="/step_two" custom v-slot="{ navigate }">
      <Button :type="BUTTON_TYPE.FIVE" :click_fun="navigate">上一步</Button>
    </router-link>
    <router-link to="/step_three" custom v-slot="{ navigate }">
      <Button :type="BUTTON_TYPE.SECOND" :click_fun="navigate">下一步</Button>
    </router-link>
  </div>
  <Footer />
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { CONTEST_TYPE, BUTTON_TYPE } from "../utils/Enum";
import Header from "../components/Header.vue";
import Single from "../components/Single";
import Double from "../components/Double";
import Round from "../components/Round";
import StepLine from "../components/StepLine.vue";
import Button from "../components/Button.vue";
import Footer from "../components/Footer.vue";

export default {
  data() {
    return {
      CONTEST_TYPE,
      BUTTON_TYPE,
    };
  },
  created() {
    this.contestInfoSizeChange(this.teamCount);
  },
  components: { Single, Double, Round, Button, Footer, StepLine, Header },
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
