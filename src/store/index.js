import { createStore } from "vuex";
import {
  CONTEST_TYPE,
  GAME_TYPE,
  PLAYER_KEY,
  NO_SCORE,
  CONTEST_VALUE,
  TEAM_FORM,
  GAME_FORM,
  CONTEST_INFO_DEFAULT,
} from "../utils/Enum";
import {
  gameSizeGet,
  roundOneGameSortGet,
  roundOneInfoBuild,
  checkPlayerIDInWinContest,
} from "../utils/ContestFunc";

export default createStore({
  state: {
    type: CONTEST_TYPE.SINGLE.id,
    teamCount: 0,
    teamInfo: [],
    contestInfo: JSON.parse(JSON.stringify(CONTEST_INFO_DEFAULT)),
  },
  mutations: {
    typeChange(state, payload) {
      const newType = payload.target.value;
      if (!CONTEST_VALUE.includes(newType)) return;
      state.type = newType;
    },
    contestInfoReset(state) {
      state.contestInfo = JSON.parse(JSON.stringify(CONTEST_INFO_DEFAULT));
    },
    teamCountChange(state, payload) {
      const newTeamCount = parseInt(payload.target.value);
      state.teamCount = newTeamCount;
      state.teamInfo = Array.from({ length: newTeamCount }, (v, i) =>
        Object.assign(
          {},
          {
            ...TEAM_FORM,
            id: i.toString(),
            name: i.toString() + "!!",
            is_seed: i % 4 === 0,
          }
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
      // add score
      state.contestInfo[type][roundIdx][idx][playerKey].score =
        score === "" ? NO_SCORE : score;

      const thisGame = state.contestInfo[type][roundIdx][idx];
      let nextWinRound = state.contestInfo[GAME_TYPE.WIN][roundIdx + 1];
      // const nextLoseGame = state.contestInfo[GAME_TYPE.LOSE][roundIdx];

      if (state.type === CONTEST_TYPE.ROUND.id && !nextWinRound) return;

      const player1Info = thisGame[PLAYER_KEY.PLAYER1];
      const player2Info = thisGame[PLAYER_KEY.PLAYER2];
      const has_result =
        player1Info.score !== NO_SCORE &&
        player2Info.score !== NO_SCORE &&
        player1Info.score !== player2Info.score;
      let scoreResult = {
        has_result,
        winner: "",
        loser: "",
      };

      if (scoreResult.has_result) {
        switch (player1Info.score > player2Info.score) {
          case true:
            scoreResult = {
              ...scoreResult,
              winner: thisGame[PLAYER_KEY.PLAYER1].id,
              loser: thisGame[PLAYER_KEY.PLAYER2].id,
            };
            break;
          case false:
            scoreResult = {
              ...scoreResult,
              winner: thisGame[PLAYER_KEY.PLAYER2].id,
              loser: thisGame[PLAYER_KEY.PLAYER1].id,
            };
            break;
          default:
            break;
        }
      }

      // WIN contest
      const contestWinInfo = state.contestInfo[GAME_TYPE.WIN];
      state.contestInfo[GAME_TYPE.WIN] = checkPlayerIDInWinContest({
        roundIdx,
        idx,
        contestWinInfo,
        player1Info,
        player2Info,
        scoreResult,
      });
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

      // seed player
      const seedPlayer = state.teamInfo
        .filter((team) => team.is_seed)
        .map((v) => v.id);

      // not seed player
      const notSeedPlayer = state.teamInfo
        .filter((team) => !team.is_seed)
        .map((v) => v.id);

      // bye counter
      let byeCount = gameLen * 2 - state.teamCount;

      // sort order array
      const sortOrder = roundOneGameSortGet(gameLen * playerCountInGame);

      state.contestInfo.WIN = roundOneInfoBuild({
        sortOrder,
        newGameInfo,
        playerCountInGame,
        seedPlayer,
        notSeedPlayer,
        byeCount,
      });
    },
    roundOtherWin(state, { roundIdx, gameLen }) {
      let newGameInfo = Object.assign([], state.contestInfo.WIN);

      newGameInfo.unshift(
        Array.from({ length: gameLen }, (v, i) => {
          return Object.assign(
            {},
            {
              ...GAME_FORM,
              player1: {
                ...GAME_FORM.player1,
                game_type: GAME_TYPE.WIN,
                sort: { roundIdx, game_idx: i * 2 },
              },
              player2: {
                ...GAME_FORM.player2,
                game_type: GAME_TYPE.WIN,
                sort: { roundIdx, game_idx: i * 2 + 1 },
              },
            }
          );
        })
      );
      state.contestInfo.WIN = newGameInfo;
    },
    roundOneLose() {},
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
            commit("roundOtherWin", { roundIdx: exponent - i - 1, gameLen });
            break;
        }
      }
      console.log(state.contestInfo);
    },
    doubleInfoSizeChange({ state, commit }, { base, exponent }) {
      for (let i = 0; i <= exponent; i++) {
        const gameLen = Math.pow(base, i);
        switch (i) {
          case exponent:
            commit("roundOneWin", { gameLen });
            break;
          default:
            commit("roundOtherWin", { roundIdx: exponent - i - 1, gameLen });
            break;
        }
      }
      console.log(state.contestInfo);
    },
    contestInfoSizeChange({ state, dispatch, commit }) {
      const { base, exponent } = gameSizeGet(state.teamCount);
      const CONTEST_TYPE_KEY = Object.keys(CONTEST_TYPE);
      commit("contestInfoReset");
      switch (state.type) {
        case CONTEST_TYPE_KEY[0]:
          dispatch("singleInfoSizeChange", { base, exponent });
          break;
        case CONTEST_TYPE_KEY[1]:
          dispatch("doubleInfoSizeChange", { base, exponent });
          break;
        default:
          break;
      }
    },
  },
  modules: {},
});
