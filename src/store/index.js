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
  player1: "",
  player1_score: -1,
  player2: "",
  player2_score: -1,
  place: "",
  time: "",
  win: "",
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
        exponent: i + 1,
      });
    }
  }

  return (result = {
    ...result,
    msg: "隊伍數量應為 2 ~ 64 之間",
  });
}
GameSizeGet(7);

export default createStore({
  state: {
    type: Object.keys(CONTEST_TYPE)[0],
    teamCount: 5,
    teamInfo: Array.from({ length: 5 }, (v, i) =>
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
        Object.assign({}, { ...TEAM_FORM, id: i.toString() })
      );
    },
    teamNameChange(state, { name, idx }) {
      state.teamInfo[idx].name = name;
    },
    seedChange(state, { is_seed, idx }) {
      state.teamInfo[idx].is_seed = is_seed;
    },
    singleInfoSizeChange(state, { base, exponent }) {
      const newGameInfo = [];
      for (let i = 0; i <= exponent; i++) {
        const ArrayLen = Math.pow(base, i);
        newGameInfo.unshift(
          Array.from({ length: ArrayLen }, () => Object.assign({}, GAME_FORM))
        );
      }
      state.gameInfo = newGameInfo;
      console.log(newGameInfo);
    },
  },
  actions: {
    gameInfoSizeChange({ state, commit }) {
      const { base, exponent } = GameSizeGet(state.teamCount);
      const CONTEST_TYPE_KEY = Object.keys(CONTEST_TYPE);
      console.log(state.type);
      switch (state.type) {
        case CONTEST_TYPE_KEY[0]:
          commit("singleInfoSizeChange", { base, exponent });
          break;
        default:
          break;
      }
    },
  },
  modules: {},
});
