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
    type: "",
    sort: [],
    win: true,
  },
  player2: {
    score: -1,
    //round 1
    id: "",
    //round others
    type: "",
    sort: [],
    win: true,
  },
  place: "",
  time: "",
  bye: false,
};

function GameSizeGet(team_count) {
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

export default createStore({
  state: {
    type: Object.keys(CONTEST_TYPE)[0],
    teamCount: 10,
    teamInfo: Array.from({ length: 10 }, (v, i) =>
      Object.assign(
        {},
        { ...TEAM_FORM, id: i.toString(), is_seed: i % 4 === 0 }
      )
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
      let newGameInfo = Object.assign([], state.gameInfo);
      console.log(state.gameInfo);
      newGameInfo.unshift(
        Array.from({ length: gameLen }, () =>
          JSON.parse(JSON.stringify(GAME_FORM))
        )
      );

      // seed
      const seedPlayer = state.teamInfo
        .filter((team) => team.is_seed)
        .map((v) => v.id);
      const SeedCount = Math.floor(seedPlayer.length / 2);
      let SeedIdx = 0;

      // not seed
      const notSeedPlayer = state.teamInfo
        .filter((team) => !team.is_seed)
        .map((v) => v.id);
      let notSeedIdx = 0;

      // bye
      const byeCount = gameLen * 2 - state.teamCount;
      if (byeCount > 0) {
        const count = Math.floor(byeCount / 2);
        for (const idx in newGameInfo[0]) {
          if (
            idx < count + (byeCount % 2) ||
            idx >= newGameInfo[0].length - count
          ) {
            newGameInfo[0][idx].bye = true;
            // play
            if (
              idx < SeedCount + (SeedCount % 2) ||
              idx > newGameInfo[0].length - SeedCount - 1
            ) {
              console.log(SeedIdx, idx);
              newGameInfo[0][idx].player1.id = seedPlayer[SeedIdx];
              SeedIdx++;
            } else {
              newGameInfo[0][idx].player1.id = notSeedPlayer[notSeedIdx];
              notSeedIdx++;
            }
          } else {
            newGameInfo[0][idx].player1.id = notSeedPlayer[notSeedIdx];
            newGameInfo[0][idx].player2.id = notSeedPlayer[++notSeedIdx];
            notSeedIdx++;
          }
        }
      }

      state.gameInfo = newGameInfo;
      console.log(newGameInfo);
    },
    roundOther(state, { gameLen }) {
      console.log(gameLen);
    },
  },
  actions: {
    singleInfoSizeChange({ state, commit }, { base, exponent }) {
      for (let i = 0; i <= exponent; i++) {
        const gameLen = Math.pow(base, i);
        console.log(gameLen);
        let newGameInfo = Object.assign([], state.gameInfo);
        switch (i) {
          case exponent:
            commit("roundOneInfo", { gameLen });
            break;
          default:
            newGameInfo.unshift(
              Array.from({ length: gameLen }, () =>
                Object.assign({}, GAME_FORM)
              )
            );
            state.gameInfo = newGameInfo;
            break;
        }
      }
    },
    gameInfoSizeChange({ state, dispatch }) {
      const { base, exponent } = GameSizeGet(state.teamCount);
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
