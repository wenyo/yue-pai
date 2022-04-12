<template>
  <li v-if="match_data.game.show">
    <div class="title">
      <span>{{ match_data.round }}-{{ match_data.game_number }}</span>
      <span class="red-icon" v-if="match_data.game.championship">決</span>
      <span class="red-icon" v-if="match_data.game.third_place">季</span>
    </div>
    <!-- team name & score -->
    <div
      v-for="playerKey in Object.keys(PLAYER_KEY)"
      :key="playerKey"
      class="player-info"
      :class="{
        'mb-4': PLAYER_KEY[playerKey] === PLAYER_KEY.PLAYER1,
        'mb-10': PLAYER_KEY[playerKey] === PLAYER_KEY.PLAYER2,
        winner: this.match_data.winnerGet() === PLAYER_KEY[playerKey],
        loser: this.match_data.winnerGet() === playerKeyOtherGet(playerKey),
      }"
      :data-role="match_data.draggableCheck() ? 'drag-drop-container' : ''"
      :draggable="match_data.draggableCheck()"
      @dragstart="(ev) => onDragging(ev, playerKey)"
      @drop="(ev) => drop(ev, playerKey)"
      @dragover="allowDrop"
    >
      <div
        class="drag-icon border-0 border-r-1 border-l-4"
        v-if="match_data.draggableCheck()"
      >
        <i
          class="icon-seedling-solid"
          v-if="match_data.seedCheck(playerKey)"
        ></i>
        <i class="icon-grip-vertical-solid" v-else></i>
      </div>
      <input
        class="w-70 border-0 border-r-1"
        type="text"
        name=""
        id=""
        @change="
          teamNameChange({
            idx: match_data.idGet(playerKey),
            name: $event.target.value,
          })
        "
        :placeholder="match_data.namePlaceholderGet(playerKey)"
        :value="match_data.nameGet(playerKey)"
        :disabled="match_data.nameDisabled(playerKey)"
      />
      <input
        class="w-30 border-0"
        type="number"
        name=""
        id=""
        @change="
          gameScoreChange({
            roundIdx: match_data.roundIdx,
            idx: match_data.idx,
            groupIdx,
            playerKey: playerKey,
            score: $event.target.value,
            type: gameType,
          })
        "
        :placeholder="match_data.game.bye ? '-' : '比分'"
        :value="match_data.scoreValue(playerKey)"
        :disabled="match_data.scoreDisabled(playerKey)"
      />
    </div>
    <!-- date -->
    <div>
      <input
        class="w-40"
        type="date"
        name=""
        id=""
        :disabled="match_data.game.bye"
        :value="match_data.game.date"
        @change="
          gameDateChange({
            roundIdx: match_data.roundIdx,
            idx: match_data.idx,
            groupIdx,
            date: $event.target.value,
            type: gameType,
          })
        "
      />
      <input
        class="w-30"
        type="time"
        name=""
        id=""
        :value="match_data.game.time"
        @change="
          gameTimeChange({
            roundIdx: match_data.roundIdx,
            idx: match_data.idx,
            groupIdx,
            time: $event.target.value,
            type: gameType,
          })
        "
        :disabled="match_data.game.bye"
      />
      <!-- place -->
      <input
        class="w-30"
        type="text"
        name=""
        id=""
        :value="match_data.game.place"
        :placeholder="match_data.game.bye ? '-' : '場地'"
        :disabled="match_data.game.bye"
        @change="
          gamePlaceChange({
            roundIdx,
            idx: idx,
            groupIdx,
            place: $event.target.value,
            type: gameType,
          })
        "
      />
    </div>
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
} from "../utils/Enum";
import MatchData from "./MatchData.js";
import { playerKeyOtherGet } from "../utils/ContestFunc";

export default {
  props: [
    "contestType",
    "gameType",
    "game",
    "idx",
    "roundIdx",
    "groupIdx",
    "teamNameChange",
    "gameDateChange",
    "gameTimeChange",
    "gamePlaceChange",
    "gameScoreChange",
    "dragTargetInfo",
    "changePlayer",
  ],
  data() {
    return {
      ROUND,
      PLAYER_KEY,
      NO_SCORE,
      NO_ID,
      GAME_TYPE,
      dragPlayer: NO_PLAYER,
      playerKeyOtherGet,
    };
  },
  computed: {
    ...mapState(["teamInfo"]),
    match_data() {
      return new MatchData({
        contestType: this.contestType,
        gameType: this.gameType,
        game: this.game,
        idx: this.idx,
        roundIdx: this.roundIdx,
        teamInfo: this.teamInfo,
      });
    },
  },
  methods: {
    onDragging(e, playerKey) {
      const { roundIdx, idx, groupIdx } = this;
      this.dragTargetInfo({ roundIdx, idx, playerKey, groupIdx });
    },
    allowDrop(e) {
      e.preventDefault();
    },
    async drop(e, playerKey) {
      e.preventDefault();
      const { roundIdx, idx, groupIdx } = this;
      await this.changePlayer({ roundIdx, idx, playerKey, groupIdx });
      this.$forceUpdate();
    },
  },
};
</script>

<style lang="scss" scoped>
li {
  display: flex;
  flex-direction: column;
  margin-right: 10px;

  & > div {
    display: flex;
    width: 100%;
  }

  .w-70 {
    width: 70%;
  }

  .w-30 {
    width: 30%;
  }

  .w-40 {
    width: 40%;
  }

  .w-50 {
    width: 50%;
  }
}

.winner {
  color: $primary-color-second;
}
.loser {
  color: $dark-200;
}

.drag-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 4px;
  cursor: move;

  & ~ .w-70 {
    width: calc(70% - 22px);
  }

  i {
    font-size: 12px;
  }
}

.player-info {
  border: 1px solid $dark-200;
}

.title {
  display: flex;
  align-items: center;
  height: 20px;
}

.border-0 {
  border: unset;
}

.border-r-1 {
  border: unset;
  border-right: 1px solid $dark-200;
}

.border-l-4 {
  border-left: 4px solid $dark-200;
}

.border-r-0 {
  border-right: unset;
}

.border-l-0 {
  border-left: unset;
}
</style>
