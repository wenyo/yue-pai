<template>
  <div>
    <div v-for="(groupInfo, groupIdx) in contestInfo.ROUND" :key="groupIdx">
      <div style="page-break-after: always" v-if="groupIdx > 0 && groupInfo[0].length > 3"></div>
      <h4>第{{ groupIdx + 1 }}組</h4>
      <div class="group">
        <ul class="round no-line" v-for="(roundInfo, roundIdx) in groupInfo" :key="roundIdx">
          <Match v-for="(game, idx) in roundInfo" :key="idx" :game="game" :idx="idx" :roundIdx="roundIdx" />
        </ul>
        <div class="score-table">
          <tr>
            <th :colspan="teamInfo.length" class="th-bg">計分板</th>
          </tr>
          <tr>
            <th></th>
            <template v-for="playerId in scoreSort(roundScoreSort[groupIdx])">
              <th v-if="roundScoreSort[groupIdx][playerId] && playerId !== NO_ID.toString()" :key="playerId">
                {{ teamInfo[playerId].name }}
              </th>
            </template>
          </tr>
          <template v-for="(roundScoreInfo, playerId) in roundScoreSort[groupIdx]">
            <tr v-if="roundScoreInfo" :key="playerId">
              <td v-if="playerId !== NO_ID.toString()">{{ teamInfo[playerId].name }}</td>
              <template v-for="(scoreInfo, player2Id) in roundScoreInfo">
                <template v-if="player2Id !== NO_ID.toString()">
                  <td
                    v-if="scoreInfo && scoreInfo !== NO_SCORE"
                    :class="{ win: prevPlayerWin(groupInfo, scoreInfo) }"
                    :key="player2Id"
                  >
                    {{ scoreText(groupInfo, scoreInfo) }}
                  </td>
                  <td v-if="scoreInfo === NO_SCORE" class="gray-bg" :key="player2Id"></td>
                </template>
              </template>
            </tr>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Match from "./Match.vue";
import { NO_SCORE, NO_ID } from "../../utils/Enum";
export default {
  components: { Match },
  data() {
    return {
      NO_SCORE,
      NO_ID,
    };
  },
  created() {
    console.log(this.roundScoreSort);
  },
  computed: {
    ...mapState(["contestInfo", "teamInfo", "roundScore", "roundScoreSort"]),
  },
  methods: {
    scoreShow(score) {
      return score === NO_SCORE ? "" : score;
    },
    scoreSort(score) {
      return Object.keys(score);
    },
    prevPlayerWin(groupInfo, scoreInfo) {
      const thisGame = groupInfo[scoreInfo.round_idx][scoreInfo.game_idx];
      let playerPreScore = thisGame[scoreInfo.player_sort[0]].score;
      let playerNextScore = thisGame[scoreInfo.player_sort[1]].score;
      return playerPreScore > playerNextScore;
    },
    scoreText(groupInfo, scoreInfo) {
      const thisGame = groupInfo[scoreInfo.round_idx][scoreInfo.game_idx];
      let playerPreScore = thisGame[scoreInfo.player_sort[0]].score;
      let playerNextScore = thisGame[scoreInfo.player_sort[1]].score;
      playerPreScore = playerPreScore === NO_SCORE ? "" : playerPreScore;
      playerNextScore = playerNextScore === NO_SCORE ? "" : playerNextScore;
      return `${playerPreScore}:${playerNextScore}`;
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
  flex-wrap: wrap;
  margin-bottom: 100px;
  margin-top: 20px;
}

.round {
  margin-right: 40px;

  li {
    margin-bottom: 20px;
  }

  .game:not(:last-child) {
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
