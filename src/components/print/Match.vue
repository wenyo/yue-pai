<template>
  <li
    class="game"
    :class="{ hidden: !match_data.game.show, 'no-bye': !match_data.game.bye }"
  >
    <div class="top">
      <div class="title">
        <span class="font-dark-200"
          >{{ match_data.round }}-{{ match_data.game_number }}</span
        >
        <span class="red-icon" v-if="match_data.game.championship">決</span>
        <span class="red-icon" v-if="match_data.game.third_place">季</span>
      </div>
      <div class="place">{{ match_data.game.place ?? "" }}</div>
    </div>
    <ul class="middle">
      <li
        v-for="playerKey in Object.keys(PLAYER_KEY)"
        :key="playerKey"
        :class="{ 'font-dark-200': loser === PLAYER_KEY[playerKey] }"
      >
        <div v-if="match_data.nameGet(playerKey) !== ''">
          {{ match_data.nameGet(playerKey) }}
        </div>
        <div v-else class="font-dark-300">
          {{ match_data.namePlaceholderGet(playerKey) }}
        </div>
        <div v-if="match_data.scoreValue(playerKey) !== ''">
          {{ match_data.scoreValue(playerKey) }}
        </div>
        <div v-else class="font-dark-300">比分</div>
      </li>
    </ul>
    <div class="bottom">
      <div>{{ match_data.game.date ?? "" }}</div>
      <div>{{ match_data.game.time ?? "" }}</div>
    </div>
    <div class="front-line"></div>
  </li>
</template>

<script>
import { mapState } from "vuex";
import {
  ROUND,
  PLAYER_KEY,
  NO_SCORE,
  GAME_TYPE,
  NO_ID,
  NO_PLAYER,
} from "../../utils/Enum";
import MatchData from "../MatchData.js";

export default {
  props: ["contestType", "game", "idx", "roundIdx"],
  data() {
    return {
      ROUND,
      PLAYER_KEY,
      NO_SCORE,
      NO_ID,
      GAME_TYPE,
    };
  },
  computed: {
    ...mapState(["teamInfo"]),
    match_data() {
      return new MatchData({
        contestType: this.contestType,
        game: this.game,
        idx: this.idx,
        roundIdx: this.roundIdx,
        teamInfo: this.teamInfo,
      });
    },
    loser() {
      const player1Score = this.match_data.scoreValue("PLAYER1");
      const player2Score = this.match_data.scoreValue("PLAYER2");
      const emptyScore = "";

      if (player1Score === emptyScore || player2Score === emptyScore)
        return NO_PLAYER;

      if (player1Score < player2Score) return PLAYER_KEY.PLAYER1;

      if (player1Score > player2Score) return PLAYER_KEY.PLAYER2;

      return NO_PLAYER;
    },
  },
};
</script>
<style lang="scss" scoped>
.game {
  width: fit-content;
  font-size: 14px;
  height: 70px;
}
.top,
.bottom {
  display: flex;
  justify-content: space-between;
  height: 15px;
}

.place {
  max-width: 110px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.middle {
  li {
    height: 20px;
    width: 150px;
    display: flex;

    &:first-child > div {
      border-bottom: unset;
    }
  }

  div {
    padding: 2px 4px;
    border: 1px solid $dark-100;
    box-sizing: border-box;

    &:first-child {
      width: 70%;
    }

    &:last-child {
      width: 30%;
      margin-left: -1px;
    }
  }
}

.font-dark-200 {
  color: $dark-200;
}

.font-dark-300 {
  color: $dark-300;
}

.title {
  position: relative;
}

.red-icon {
  position: absolute;
  top: -2px;
  font-size: 12px;
}

.hidden {
  visibility: hidden;
}
.contest.win {
  #final-round {
    margin-left: 560px;
    .front-line {
      width: 600px;
      left: -600px;
    }
  }
}

.single {
  & :last-child > .game:first-child {
    margin-bottom: 10px;

    .front-line {
      width: 170px;
      left: -170px;
    }
  }
}
</style>
