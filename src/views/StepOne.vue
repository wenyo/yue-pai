<template>
  <div class="contain">
    <div class="article">
      <h3>1/選擇賽制與隊伍數</h3>
      <label for="contest">選擇賽制</label>
      <select id="contest" :value="type" @change="typeChange">
        <option value="">請選擇</option>
        <option
          v-for="(info, type) in CONTEST_TYPE"
          :key="type"
          :value="info.id"
        >
          {{ info.ch }}
        </option>
      </select>
      <label for="team-count">輸入隊伍數</label>
      <input
        type="number"
        id="team-count"
        :value="teamCount"
        @change="teamCountChange"
      />
    </div>
    <div class="step">
      <router-link to="/" custom v-slot="{ navigate }">
        <button @click="navigate">上一步</button>
      </router-link>
      <router-link to="/step_two" custom v-slot="{ navigate }">
        <button @click="navigate">下一步</button>
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import { CONTEST_TYPE } from "../utils/Enum.js";
export default {
  data() {
    return {
      CONTEST_TYPE,
    };
  },
  computed: {
    ...mapState(["type", "teamCount"]),
  },
  methods: {
    ...mapMutations(["typeChange", "teamCountChange"]),
  },
};
</script>
