import { createStore } from "vuex";
import { CONTEST_TYPE } from "../utils/Enum";

const CONTEST_VALUE = Object.keys(CONTEST_TYPE);

export default createStore({
  state: {
    type: "",
    teamCount: 0,
  },
  mutations: {
    changeType(state, payload) {
      console.log(payload.target.value);
      const newType = payload.target.value;
      if (!CONTEST_VALUE.includes(newType)) return;
      state.type = newType;
    },
    changeTeamCount(state, payload) {
      const newTeamCount = parseInt(payload.target.value);
      state.teamCount = newTeamCount;
    },
  },
  actions: {},
  modules: {},
});
