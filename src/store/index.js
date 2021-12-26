import { createStore } from "vuex";
import { CONTEST_TYPE, GAME_TYPE, MAX_EXPONENT } from "../utils/Enum";

const CONTEST_VALUE = Object.keys(CONTEST_TYPE);
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
    type: Object.keys(CONTEST_TYPE)[0],
    teamCount: 9,
    teamInfo: Array.from({ length: 9 }, (v, i) =>
      Object.assign({}, { ...TEAM_FORM, id: i.toString() })
    ),
    gameInfo: [],
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
    teamNameChange(state, { name, idx }) {
      state.teamInfo[idx].name = name;
    },
    seedChange(state, { is_seed, idx }) {
      state.teamInfo[idx].is_seed = is_seed;
    },
    roundOneInfo(state, { gameLen }) {
      const playerCountInGame = 2;
      const roundOne = Array.from({ length: gameLen }, () =>
        JSON.parse(JSON.stringify(GAME_FORM))
      );

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
          order % playerCountInGame === 0 ? "player1" : "player2";
        let gameInfo = roundOne[gameIdx];

        if (gameInfo.bye) continue;

        // add bye
        if (byeCount > 0) {
          gameInfo.bye = true;
          byeCount--;
        }

        // add player
        if (seedCount > 0) {
          gameInfo[playerKey].id = seedPlayer[seedPlayer.length - seedCount];
          seedCount--;
        } else {
          gameInfo[playerKey].id =
            notSeedPlayer[notSeedPlayer.length - notSeedCount];
          notSeedCount--;
        }

        roundOne[gameIdx] = gameInfo;
      }

      let newGameInfo = Object.assign([], state.gameInfo);
      newGameInfo.unshift(roundOne);
      state.gameInfo = newGameInfo;
    },
    roundOther(state, { round, gameLen }) {
      console.log("gameLen", gameLen);
      console.log("round", round);
      let newGameInfo = Object.assign([], state.gameInfo);

      newGameInfo.unshift(
        Array.from({ length: gameLen }, (v, i) => {
          console.log(i);
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
      state.gameInfo = newGameInfo;
      // console.log(newGameInfo);
    },
  },
  actions: {
    singleInfoSizeChange({ state, commit }, { base, exponent }) {
      for (let i = 0; i <= exponent; i++) {
        const gameLen = Math.pow(base, i);
        switch (i) {
          case exponent:
            commit("roundOneInfo", { gameLen });
            break;
          default:
            commit("roundOther", { round: exponent - i, gameLen });
            break;
        }
      }
      console.log(state.gameInfo);
    },
    gameInfoSizeChange({ state, dispatch }) {
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
