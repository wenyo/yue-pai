import { createStore } from "vuex";
import { CONTEST_TYPE, GAME_TYPE } from "../utils/Enum";

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
};
console.log(GAME_FORM);

export default createStore({
  state: {
    type: "",
    teamCount: 5,
    teamInfo: Array.from({ length: 5 }, (v, i) =>
      Object.assign({}, { ...TEAM_FORM, id: i.toString() })
    ),
  },
  mutations: {
    changeType(state, payload) {
      const newType = payload.target.value;
      if (!CONTEST_VALUE.includes(newType)) return;
      state.type = newType;
    },
    changeTeamCount(state, payload) {
      const newTeamCount = parseInt(payload.target.value);
      state.teamCount = newTeamCount;
      state.teamInfo = Array.from({ length: newTeamCount }, (v, i) =>
        Object.assign({}, { ...TEAM_FORM, id: i.toString() })
      );
    },
    changeTeamName(state, { name, idx }) {
      state.teamInfo[idx].name = name;
    },
    changeSeed(state, { is_seed, idx }) {
      state.teamInfo[idx].is_seed = is_seed;
    },
  },
  actions: {},
  modules: {},
});
