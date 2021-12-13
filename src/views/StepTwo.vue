<template>
  <div class="contain">
    <div class="article">
      <h3>2/填寫隊伍名稱並選擇種子選手</h3>
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
            @change="changeTeamName({ name: $event.target.value, idx })"
          />
          <input
            type="checkbox"
            name=""
            id=""
            :value="info.is_seed"
            @change="changeSeed({ is_seed: $event.target.checked, idx })"
          />
        </li>
      </ul>
    </div>
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
const maxColumn = 4;

export default {
  data() {
    return {};
  },
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
</style>