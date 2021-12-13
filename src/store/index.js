import { createStore } from "vuex";
import { CONTEST_TYPE } from "../utils/Enum";

const CONTEST_VALUE = Object.keys(CONTEST_TYPE);
const TEAM_FORM = {
  name: "",
  order: -1,
  is_seed: false,
};

export default createStore({
  state: {
    type: "",
    teamCount: 4,
    teamInfo: Array.from({ length: 4 }, () => Object.assign({}, TEAM_FORM)),
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
      state.teamInfo = Array.from({ length: newTeamCount }, () =>
        Object.assign({}, TEAM_FORM)
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
