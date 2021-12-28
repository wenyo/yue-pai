import { createStore } from "vuex";
import {
  CONTEST_TYPE,
  GAME_TYPE,
  MAX_EXPONENT,
  PLAYER_KEY,
} from "../utils/Enum";

const CONTEST_VALUE = Object.keys(CONTEST_TYPE).map(
  (key) => CONTEST_TYPE[key].id
);
const TEAM_FORM = {
  id: "",
  name: "",
  is_seed: false,
};

const GAME_FORM = {
  type: GAME_TYPE.WIN,
  player1: {
    score: -1,
    //round 1
    id: "",
    //round others
    game_type: "",
    sort: { round: -1, game_idx: -1 },
    winner_chose: true,
  },
  player2: {
    score: -1,
    //round 1
    id: "",
    //round others
    game_type: "",
    sort: { round: -1, game_idx: -1 },
    winner_chose: true,
  },
  place: "",
  time: "",
  bye: false,
};

function gameSizeGet(team_count) {
  const base = 2;
  let result = {
    isLegal: false,
    base,
    exponent: 0,
    msg: "",
  };

  for (let i = 0; i < MAX_EXPONENT; i++) {
    const minSquare = Math.pow(base, i);
    const maxSquare = Math.pow(base, i + 1);

    if (minSquare < team_count && maxSquare >= team_count) {
      return (result = {
        ...result,
        isLegal: true,
        exponent: i,
      });
    }
  }

  return (result = {
    ...result,
    msg: "隊伍數量應為 2 ~ 64 之間",
  });
}

function roundOneGameSortGet(gameLen) {
  const halfCount = 2;
  const teamCount = 2;
  let result = [];
  let gameIdxAry = [Array.from({ length: gameLen }, (v, i) => i)];

  while (gameIdxAry[0].length > teamCount) {
    let newGameIdx = [[], []];
    for (let gameTemp of gameIdxAry) {
      const middleNumber = gameTemp.length / halfCount;
      newGameIdx[0].push(gameTemp.slice(0, middleNumber));
      newGameIdx[1].push(
        gameTemp.slice(middleNumber, gameTemp.length).reverse()
      );
    }
    gameIdxAry = newGameIdx[0].concat(newGameIdx[1]);
  }

  let resultTemp = [];
  for (const value of gameIdxAry) {
    for (const idx in value) {
      if (!resultTemp[idx]) resultTemp[idx] = [];
      resultTemp[idx].push(value[idx]);
    }
  }

  for (const sortAry of resultTemp) {
    result = result.concat(sortAry);
  }

  return result;
}

export default createStore({
  state: {
    type: CONTEST_TYPE.SINGLE.id,
    teamCount: 9,
    teamInfo: Array.from({ length: 9 }, (v, i) =>
      Object.assign(
        {},
        { ...TEAM_FORM, id: i.toString(), name: i.toString() + "!" }
      )
    ),
    contestInfo: { WIN: [], LOSE: [] },
  },
  mutations: {
    typeChange(state, payload) {
      const newType = payload.target.value;
      if (!CONTEST_VALUE.includes(newType)) return;
      state.type = newType;
    },
    teamCountChange(state, payload) {
      const newTeamCount = parseInt(payload.target.value);
      state.teamCount = newTeamCount;
      state.teamInfo = Array.from({ length: newTeamCount }, (v, i) =>
        Object.assign(
          {},
          { ...TEAM_FORM, id: i.toString(), name: i.toString() }
        )
      );
    },
    teamNameChange(state, { idx, name }) {
      state.teamInfo[idx].name = name;
    },
    gameDateChangeByType(state, { type, roundIdx, idx, date }) {
      state.contestInfo[type][roundIdx][idx].time = date;
    },
    gamePlaceChangeByType(state, { type, roundIdx, idx, place }) {
      state.contestInfo[type][roundIdx][idx].place = place;
    },
    gameScoreChangeByType(state, { type, roundIdx, idx, playerKey, score }) {
      console.log(score);
      state.contestInfo[type][roundIdx][idx][playerKey].score = score;

      if (state.type === CONTEST_TYPE.ROUND.id) return;

      // WIN
      for (const gameInfo of state.contestInfo[GAME_TYPE.WIN][roundIdx + 1]) {
        console.log(gameInfo);
      }
    },
    seedChange(state, { is_seed, idx }) {
      state.teamInfo[idx].is_seed = is_seed;
    },
    roundOneWin(state, { gameLen }) {
      const playerCountInGame = 2;
      let newGameInfo = Object.assign([], state.contestInfo.WIN);
      newGameInfo.unshift(
        Array.from({ length: gameLen }, () =>
          JSON.parse(JSON.stringify(GAME_FORM))
        )
      );
      const roundOne = newGameInfo[0];
      const roundTwo = newGameInfo[1];

      // seed
      const seedPlayer = state.teamInfo
        .filter((team) => team.is_seed)
        .map((v) => v.id);
      let seedCount = seedPlayer.length;

      // not seed
      const notSeedPlayer = state.teamInfo
        .filter((team) => !team.is_seed)
        .map((v) => v.id);
      let notSeedCount = notSeedPlayer.length;

      // bye
      let byeCount = gameLen * 2 - state.teamCount;

      // sort order
      const sortOrder = roundOneGameSortGet(gameLen * playerCountInGame);

      for (const order of sortOrder) {
        const gameIdx = Math.floor(order / playerCountInGame);
        const playerKey =
          order % playerCountInGame === 0
            ? PLAYER_KEY.PLAYER1
            : PLAYER_KEY.PLAYER2;
        let gameInfo = roundOne[gameIdx];

        if (gameInfo.bye) continue;

        // add player
        if (seedCount > 0) {
          gameInfo[playerKey].id = seedPlayer[seedPlayer.length - seedCount];
          seedCount--;
        } else {
          gameInfo[playerKey].id =
            notSeedPlayer[notSeedPlayer.length - notSeedCount];
          notSeedCount--;
        }

        // add bye
        if (byeCount > 0) {
          gameInfo.bye = true;
          byeCount--;

          // add next round player id
          const gameIdxInRoundTwo = Math.floor(gameIdx / playerCountInGame);
          const playerKeyInRoundTwo =
            gameIdx % playerCountInGame === 0
              ? PLAYER_KEY.PLAYER1
              : PLAYER_KEY.PLAYER2;
          roundTwo[gameIdxInRoundTwo][playerKeyInRoundTwo].id =
            gameInfo[playerKey].id;
        }

        roundOne[gameIdx] = gameInfo;
      }

      state.contestInfo.WIN = newGameInfo;
    },
    roundOtherWin(state, { round, gameLen }) {
      let newGameInfo = Object.assign([], state.contestInfo.WIN);

      newGameInfo.unshift(
        Array.from({ length: gameLen }, (v, i) => {
          return Object.assign(
            {},
            {
              ...GAME_FORM,
              player1: {
                ...GAME_FORM.player1,
                sort: { round, game_idx: i * 2 },
              },
              player2: {
                ...GAME_FORM.player2,
                sort: { round, game_idx: i * 2 + 1 },
              },
            }
          );
        })
      );
      state.contestInfo.WIN = newGameInfo;
    },
  },
  actions: {
    singleInfoSizeChange({ state, commit }, { base, exponent }) {
      for (let i = 0; i <= exponent; i++) {
        const gameLen = Math.pow(base, i);
        switch (i) {
          case exponent:
            commit("roundOneWin", { gameLen });
            break;
          default:
            commit("roundOtherWin", { round: exponent - i, gameLen });
            break;
        }
      }
      console.log(state.contestInfo);
    },
    contestInfoSizeChange({ state, dispatch }) {
      const { base, exponent } = gameSizeGet(state.teamCount);
      const CONTEST_TYPE_KEY = Object.keys(CONTEST_TYPE);
      switch (state.type) {
        case CONTEST_TYPE_KEY[0]:
          dispatch("singleInfoSizeChange", { base, exponent });
          break;
        default:
          break;
      }
    },
  },
  modules: {},
});
