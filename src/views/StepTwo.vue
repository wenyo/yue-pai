<template>
  <div class="wrap">
    <Header />
    <div class="outer">
      <StepLine :now-step="2" />
      <div class="contain-box">
        <div class="contain">
          <h3 class="step-title">2/填寫隊伍名稱並選擇種子選手</h3>
          <div class="article">
            <ul>
              <li v-for="idx in column" :key="idx">
                <div>隊伍名稱</div>
                <div v-if="type !== CONTEST_TYPE.ROUND.id">種子</div>
              </li>
              <li v-for="(info, idx) in teamInfo" :key="idx">
                <input
                  class="input-underline"
                  type="text"
                  name=""
                  id=""
                  :value="info.name"
                  @change="teamNameChange({ name: $event.target.value, idx })"
                />
                <Checkbox
                  :is-check="info.is_seed"
                  :change-func="
                    ($event) =>
                      seedChange({ is_seed: $event.target.checked, idx })
                  "
                  v-if="type !== CONTEST_TYPE.ROUND.id"
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="step">
        <router-link to="/step_one" custom v-slot="{ navigate }">
          <Button :type="BUTTON_TYPE.FIVE" :click_fun="navigate">上一步</Button>
        </router-link>
        <router-link to="/step_three" custom v-slot="{ navigate }">
          <Button :type="BUTTON_TYPE.SECOND" :click_fun="navigate"
            >下一步</Button
          >
        </router-link>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { STEP_IDX, BUTTON_TYPE, CONTEST_TYPE } from "../utils/Enum";
import Header from "../components/Header.vue";
import StepLine from "../components/StepLine.vue";
import Button from "../components/Button.vue";
import Footer from "../components/Footer.vue";
import Checkbox from "../components/Checkbox.vue";

const maxColumn = 4;

export default {
  data() {
    return {
      STEP_IDX,
      BUTTON_TYPE,
      CONTEST_TYPE,
    };
  },
  components: { StepLine, Header, Footer, Button, Checkbox },
  computed: {
    ...mapState(["teamInfo", "type"]),
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
    width: 24%;
    display: flex;
    margin: 10px 1% 10px 0;
    box-sizing: border-box;

    & :first-child {
      flex-grow: 1;
    }
    & :nth-child(2) {
      white-space: nowrap;
      display: flex;
      justify-content: flex-start;
      width: 80px;
      padding-left: 10px;
    }
  }
}

.article {
  div {
    font-weight: bold;
  }
}
</style>
