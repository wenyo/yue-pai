<template>
  <Header />
  <StepLine :now-step="2" />
  <div class="contain">
    <h3 class="step-title">2/填寫隊伍名稱並選擇種子選手</h3>
    <div class="article">
      <ul>
        <li v-for="idx in column" :key="idx">
          <div>隊伍名稱</div>
          <div>種子</div>
        </li>
        <li v-for="(info, idx) in teamInfo" :key="idx">
          <input
            type="text"
            name=""
            id=""
            :value="info.name"
            @change="teamNameChange({ name: $event.target.value, idx })"
          />
          <input
            type="checkbox"
            name=""
            id=""
            :checked="info.is_seed"
            @change="seedChange({ is_seed: $event.target.checked, idx })"
          />
        </li>
      </ul>
    </div>
  </div>
  <div class="step">
    <router-link to="/step_one" custom v-slot="{ navigate }">
      <Button :type="BUTTON_TYPE.FIVE" :click_fun="navigate">上一步</Button>
    </router-link>
    <router-link to="/step_three" custom v-slot="{ navigate }">
      <Button :type="BUTTON_TYPE.SECOND" :click_fun="navigate">下一步</Button>
    </router-link>
  </div>
  <Footer />
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { STEP_IDX, BUTTON_TYPE } from "../utils/Enum";
import Header from "../components/Header.vue";
import StepLine from "../components/StepLine.vue";
import Button from "../components/Button.vue";
import Footer from "../components/Footer.vue";

const maxColumn = 4;

export default {
  data() {
    return {
      STEP_IDX,
      BUTTON_TYPE,
    };
  },
  components: { StepLine, Header, Footer, Button },
  computed: {
    ...mapState(["teamInfo"]),
    column() {
      return this.teamInfo.length > maxColumn
        ? maxColumn
        : this.teamInfo.length;
    },
  },
  methods: {
    ...mapMutations(["teamNameChange", "seedChange"]),
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
    display: flex;
    margin: 10px 0;

    & :first-child {
      flex-grow: 1;
    }
    & :nth-child(2) {
      text-align: center;
      width: 100px;
    }
  }
}
.article {
  div {
    font-weight: bold;
  }
}
</style>
