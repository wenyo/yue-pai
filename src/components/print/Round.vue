<template>
  <div class="contest">
    <div v-for="(info, groupIdx) in contestInfo.ROUND" :key="groupIdx">
      <h4>第{{ groupIdx + 1 }}組</h4>
      <div class="group">
        <ul
          class="round no-line"
          v-for="(roundInfo, roundIdx) in info"
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
        <table class="score-table">
          <tr>
            <th :colspan="teamInfo.length + 1" class="th-bg">計分板</th>
          </tr>
          <tr>
            <th></th>
            <th v-for="(team, idx) in teamInfo" :key="idx">{{ team.name }}</th>
          </tr>
          <tr v-for="(team, team_idx) in teamInfo" :key="team_idx">
            <td>{{ team.name }}</td>
            <template
              v-for="(score, score_idx) in roundScore[groupIdx][team_idx]"
              :key="score_idx"
            >
              <td
                v-if="score && (score[0] > NO_SCORE || score[1] > NO_SCORE)"
                :class="{ win: score[0] > score[1] }"
              >
                {{ `${scoreShow(score[0])} : ${scoreShow(score[1])}` }}
              </td>
              <td :class="{ 'gray-bg': !score }" v-else></td>
            </template>
          </tr>
        </table>
      </div>
    </div>
  </div>
  <!-- <table class="score-table">
    <tr>
      <th :colspan="teamInfo.length + 1" class="th-bg">計分板</th>
    </tr>
    <tr>
      <th></th>
      <th v-for="(team, idx) in teamInfo" :key="idx">{{ team.name }}</th>
    </tr>
    <tr v-for="(team, team_idx) in teamInfo" :key="team_idx">
      <td>{{ team.name }}</td>
      <template
        v-for="(score, score_idx) in roundScore[team_idx]"
        :key="score_idx"
      >
        <td
          v-if="score && (score[0] > NO_SCORE || score[1] > NO_SCORE)"
          :class="{ win: score[0] > score[1] }"
        >
          {{ `${scoreShow(score[0])} : ${scoreShow(score[1])}` }}
        </td>
        <td :class="{ 'gray-bg': !score }" v-else></td>
      </template>
    </tr>
  </table> -->
</template>

<script>
import { mapState } from "vuex";
import Match from "./Match.vue";
import { NO_SCORE } from "../../utils/Enum";
export default {
  components: { Match },
  data() {
    return {
      NO_SCORE,
    };
  },
  computed: {
    ...mapState(["contestInfo", "teamInfo", "roundScore"]),
  },
  methods: {
    scoreShow(score) {
      return score === NO_SCORE ? "" : score;
    },
  },
};
</script>

<style lang="scss" scoped>
.contest {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.group {
  display: flex;
  margin-bottom: 20px;
}

.round {
  margin-right: 40px;

  li {
    margin-bottom: 20px;
  }
}

.score-table {
  th,
  td {
    border: 1px solid $dark-300;
    width: 80px;
    text-align: center;
    padding: 10px 0;
  }
}

th.th-bg {
  background-color: $primary-color-five;
}

.gray-bg {
  background-color: $dark-300;
}

.win {
  color: $primary-color-second;
}
</style>
