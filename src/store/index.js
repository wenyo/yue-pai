import { createStore } from "vuex";
import download from "downloadjs";
import {
  CONTEST_TYPE,
  GAME_TYPE,
  PLAYER_KEY,
  NO_SCORE,
  CONTEST_VALUE,
  TEAM_FORM,
  CONTEST_INFO_DEFAULT,
  ROUND_IDX,
  NO_ID,
} from "../utils/Enum";
import {
  gameSizeGet,
  roundOneSortGet,
  roundOneInfoBuild,
  checkPlayerIDInContest,
  gameInfoCheck,
  roundRobinBuild,
  roundRobinIdOrderGet,
  newGameForm,
  playerKeyOtherGet,
} from "../utils/ContestFunc";

export default createStore({
  state: {
    contestName: "",
    type: "",
    teamCount: 0,
    teamCountPowCheck: false,
    teamInfo: [],
    contestInfo: JSON.parse(JSON.stringify(CONTEST_INFO_DEFAULT)),
    isContestReset: true,
    roundScore: [],
    imgBase64: "",
  },
  mutations: {
    contestReset(state, payload) {
      state.isContestReset = payload.is_contest_reset;
    },
    downloadJSON(state) {
      const nowTime = new Date();
      const fileName = `${state.contestName}_${nowTime.getFullYear()}-${
        nowTime.getMonth() + 1
      }-${nowTime.getDate()}.json`;
      download(JSON.stringify(state), fileName, "text/plain");
    },
    filesContentGet(state, payload) {
      const stateKeys = Object.keys(state);
      const payloadKeys = Object.keys(payload);
      for (const key of stateKeys) {
        if (!payloadKeys.includes(key)) continue;
        state[key] = payload[key];
      }
    },
    contestNameChange(state, payload) {
      const newContestName = payload;
      state.contestName = newContestName;
    },
    typeChange(state, payload) {
      const newType = payload.target.value;
      if (!CONTEST_VALUE.includes(newType)) return;
      state.type = newType;
      state.isContestReset = true;
    },
    contestInfoDefault(state) {
      state.contestInfo = JSON.parse(JSON.stringify(CONTEST_INFO_DEFAULT));
    },
    teamCountChange(state, payload) {
      const newTeamCount = payload;
      state.isContestReset = true;
      state.teamCount = newTeamCount;
      state.teamInfo = Array.from({ length: newTeamCount }, (v, i) =>
        Object.assign(
          {},
          {
            ...TEAM_FORM,
            id: i,
            name: i.toString(),
          }
        )
      );
    },
    imgBase64Change(state, { img }) {
      state.imgBase64 = img;
    },
    teamNameChange(state, { idx, name }) {
      state.teamInfo[idx].name = name;
    },
    gameDateChangeByType(state, { type, roundIdx, idx, date }) {
      state.contestInfo[type][roundIdx][idx].date = date;
    },
    gameTimeChangeByType(state, { type, roundIdx, idx, time }) {
      state.contestInfo[type][roundIdx][idx].time = time;
    },
    gamePlaceChangeByType(state, { type, roundIdx, idx, place }) {
      state.contestInfo[type][roundIdx][idx].place = place;
    },
    gameScoreChangeByType(state, { type, roundIdx, idx, playerKey, score }) {
      // add score
      const playerKeyName = PLAYER_KEY[playerKey];
      state.contestInfo[type][roundIdx][idx][playerKeyName].score = score === "" ? NO_SCORE : score;
      const thisGame = state.contestInfo[type][roundIdx][idx];

      if (state.type === CONTEST_TYPE.ROUND.id) {
        const playerNowInfo = thisGame[playerKeyName];
        const playerOtherInfo = thisGame[playerKeyOtherGet(playerKeyName)];
        const isNowIdSmall = playerNowInfo.id < playerOtherInfo.id;
        const scoreX = isNowIdSmall ? playerNowInfo.id : playerOtherInfo.id;
        const scoreY = !isNowIdSmall ? playerNowInfo.id : playerOtherInfo.id;
        const scoreSort = isNowIdSmall ? 0 : 1;
        const scoreSort1 = !isNowIdSmall ? 0 : 1;

        state.roundScore[scoreX][scoreY][scoreSort] = score;
        state.roundScore[scoreY][scoreX][scoreSort1] = score;
        return;
      }

      // check winner for next round
      const player1Info = thisGame[PLAYER_KEY.PLAYER1];
      const player2Info = thisGame[PLAYER_KEY.PLAYER2];
      const has_result =
        player1Info.score !== NO_SCORE && player2Info.score !== NO_SCORE && player1Info.score !== player2Info.score;
      let scoreResult = {
        has_result,
        winner: NO_ID,
        loser: NO_ID,
      };

      if (scoreResult.has_result) {
        switch (player1Info.score > player2Info.score) {
          case true:
            scoreResult = {
              ...scoreResult,
              winner: player1Info.id,
              loser: player2Info.id,
            };
            break;
          case false:
            scoreResult = {
              ...scoreResult,
              winner: player2Info.id,
              loser: player1Info.id,
            };
            break;
          default:
            break;
        }
      }

      // WIN contest
      state.contestInfo[GAME_TYPE.WIN] = checkPlayerIDInContest({
        roundIdx,
        idx,
        contestInfo: state.contestInfo[GAME_TYPE.WIN],
        player1Id: player1Info.id,
        player2Id: player2Info.id,
        scoreResult,
        this_game_type: type,
        game_type: GAME_TYPE.WIN,
      });

      // LOSE contest
      state.contestInfo[GAME_TYPE.LOSE] = checkPlayerIDInContest({
        roundIdx,
        idx,
        contestInfo: state.contestInfo[GAME_TYPE.LOSE],
        player1Id: player1Info.id,
        player2Id: player2Info.id,
        scoreResult,
        this_game_type: type,
        game_type: GAME_TYPE.LOSE,
      });

      // check double championshipAdd
      if (state.type !== CONTEST_TYPE.DOUBLE.id) return;

      const championshipRound = state.contestInfo[GAME_TYPE.WIN].length - 2;
      const championshipGameIdx = 0;
      if (roundIdx !== championshipRound || championshipGameIdx !== idx) return;

      const championshipAddRound = state.contestInfo[GAME_TYPE.WIN].length - 1;
      const championshipAddGameIdx = 0;

      // eslint-disable-next-line prettier/prettier
      state.contestInfo[GAME_TYPE.WIN][championshipAddRound][championshipAddGameIdx].show =
        player1Info.score < player2Info.score;
    },
    roundScoreDefault(state) {
      if (state.type !== CONTEST_TYPE.ROUND.id) return;
      state.roundScore = Array.from({ length: state.teamCount }, (v1, i) =>
        Array.from({ length: state.teamCount }, (v2, j) => (i === j ? null : [NO_SCORE, NO_SCORE]))
      );
    },
    seedChange(state, { is_seed, idx }) {
      state.teamInfo[idx].is_seed = is_seed;
      state.isContestReset = true;
    },
    roundOneWin(state, { gameLen }) {
      const playerCountInGame = 2;
      let newGameInfo = Object.assign([], state.contestInfo.WIN);
      newGameInfo.unshift(Array.from({ length: gameLen }, () => newGameForm()));

      // seed player
      const seedPlayer = state.teamInfo.filter((team) => team.is_seed).map((v) => v.id);

      // not seed player
      const notSeedPlayer = state.teamInfo.filter((team) => !team.is_seed).map((v) => v.id);

      // bye counter
      let byeCount = gameLen * 2 - state.teamCount;

      // sort order array
      const sortOrder = roundOneSortGet(gameLen * playerCountInGame, GAME_TYPE.WIN);

      state.contestInfo.WIN = roundOneInfoBuild({
        sortOrder,
        newGameInfo,
        playerCountInGame,
        seedPlayer,
        notSeedPlayer,
        byeCount,
      });
    },
    roundOtherWin(state, { roundIdx, gameLen, last_round = false }) {
      let newGameInfo = Object.assign([], state.contestInfo.WIN);

      newGameInfo.unshift(
        Array.from({ length: gameLen }, (v, i) => {
          const NEW_GAME_FORM = newGameForm();
          return Object.assign(
            {},
            {
              ...NEW_GAME_FORM,
              player1: {
                ...NEW_GAME_FORM.player1,
                game_type: GAME_TYPE.WIN,
                sort: { roundIdx, game_idx: i * 2 },
              },
              player2: {
                ...NEW_GAME_FORM.player2,
                game_type: GAME_TYPE.WIN,
                sort: { roundIdx, game_idx: i * 2 + 1 },
              },
              championship: last_round,
            }
          );
        })
      );
      state.contestInfo.WIN = newGameInfo;
    },
    thirdPlaceWinAdd(state) {
      const lastRoundIdx = state.contestInfo.WIN.length - 1;
      const lastTwoRoundIdx = lastRoundIdx - 1;
      const lastTowRound = state.contestInfo.WIN[lastTwoRoundIdx];
      if (lastTowRound[0].bye || lastTowRound[1].bye) return;

      const NEW_GAME_FORM = newGameForm();
      const thirdPlaceInfo = Object.assign(
        {},
        {
          ...NEW_GAME_FORM,
          player1: {
            ...NEW_GAME_FORM.player1,
            game_type: GAME_TYPE.WIN,
            winner_chose: false,
            sort: {
              roundIdx: lastTwoRoundIdx,
              game_idx: ROUND_IDX.ONE,
            },
          },
          player2: {
            ...NEW_GAME_FORM.player2,
            game_type: GAME_TYPE.WIN,
            winner_chose: false,
            sort: {
              roundIdx: lastTwoRoundIdx,
              game_idx: ROUND_IDX.TWO,
            },
          },
          third_place: true,
        }
      );
      state.contestInfo.WIN[lastRoundIdx].push(thirdPlaceInfo);
    },
    championLoseAdd(state) {
      const lastWinRoundIdx = state.contestInfo.WIN.length - 1;
      const lastLoseRoundIdx = state.contestInfo.LOSE.length - 1;
      const NEW_GAME_FORM = newGameForm();

      const championGame = {
        ...NEW_GAME_FORM,
        player1: {
          ...NEW_GAME_FORM.player1,
          game_type: GAME_TYPE.WIN,
          winner_chose: true,
          sort: { roundIdx: lastWinRoundIdx, game_idx: ROUND_IDX.ONE },
        },
        player2: {
          ...NEW_GAME_FORM.player2,
          game_type: GAME_TYPE.LOSE,
          winner_chose: true,
          sort: { roundIdx: lastLoseRoundIdx, game_idx: ROUND_IDX.ONE },
        },
        championship: true,
      };

      state.contestInfo.WIN.push([championGame]);
    },
    championAdd(state) {
      const lastWinRoundIdx = state.contestInfo.WIN.length - 1;
      const lastLoseRoundIdx = state.contestInfo.LOSE.length - 1;
      const NEW_GAME_FORM = newGameForm();
      const championGame = {
        ...NEW_GAME_FORM,
        player1: {
          ...NEW_GAME_FORM.player1,
          game_type: GAME_TYPE.WIN,
          winner_chose: true,
          sort: { roundIdx: lastWinRoundIdx, game_idx: ROUND_IDX.ONE },
        },
        player2: {
          ...NEW_GAME_FORM.player2,
          game_type: GAME_TYPE.WIN,
          winner_chose: false,
          sort: { roundIdx: lastLoseRoundIdx, game_idx: ROUND_IDX.ONE },
        },
        championship: true,
        show: false,
      };
      state.contestInfo.WIN.push([championGame]);
    },
    roundOneAllByeCheck(state) {
      const loseContest = state.contestInfo[GAME_TYPE.LOSE];
      state.teamCountPowCheck = loseContest[0].map((round) => round.bye).includes(false);
      if (state.teamCountPowCheck) return;

      loseContest.shift();

      const newLoseContest = loseContest.map((round) =>
        round.map((game) => {
          const player1Info = game.player1;
          const player2Info = game.player2;
          // eslint-disable-next-line prettier/prettier
          const player1LoseAdd = player1Info.game_type === GAME_TYPE.LOSE ? -1 : 0;
          // eslint-disable-next-line prettier/prettier
          const player2LoseAdd = player2Info.game_type === GAME_TYPE.LOSE ? -1 : 0;
          return {
            ...game,
            player1: {
              ...player1Info,
              sort: {
                ...player1Info.sort,
                roundIdx: player1Info.sort.roundIdx + player1LoseAdd,
              },
            },
            player2: {
              ...player2Info,
              sort: {
                ...player2Info.sort,
                roundIdx: player2Info.sort.roundIdx + player2LoseAdd,
              },
            },
          };
        })
      );
      state.contestInfo[GAME_TYPE.LOSE] = newLoseContest;
    },
    roundLoseRoundOne(state) {
      const gameLenInWIN = state.contestInfo.WIN[0].length;
      const gameLenInLOSE = gameLenInWIN / 2;
      const sortOrder = roundOneSortGet(gameLenInWIN, GAME_TYPE.LOSE);
      const multiplier = 2;
      let newGameInfo = Object.assign([], state.contestInfo.LOSE);

      newGameInfo.unshift(
        Array.from({ length: gameLenInLOSE }, (v, i) => {
          // build basic player info
          const NEW_GAME_FORM = newGameForm();
          const player1SortIdx = sortOrder[multiplier * i];
          const player2SortIdx = sortOrder[multiplier * i + 1];
          const player1 = {
            ...NEW_GAME_FORM.player1,
            sort: { roundIdx: ROUND_IDX.ONE, game_idx: player1SortIdx },
            winner_chose: false,
            game_type: GAME_TYPE.WIN,
          };
          const player2 = {
            ...NEW_GAME_FORM.player2,
            sort: { roundIdx: ROUND_IDX.ONE, game_idx: player2SortIdx },
            winner_chose: false,
            game_type: GAME_TYPE.WIN,
          };

          let gameInfo = Object.assign(
            {},
            {
              ...NEW_GAME_FORM,
              player1,
              player2,
            }
          );

          // check prevGame is bye
          const { game_info, contest_all } = gameInfoCheck({
            game_info: gameInfo,
            contest_all: state.contestInfo,
          });

          gameInfo = game_info;
          state.contestInfo = contest_all;

          return gameInfo;
        })
      );

      state.contestInfo.LOSE = newGameInfo;
    },
    roundLoseFromLose(state, { roundIdx, gameLenInLose }) {
      // eslint-disable-next-line prettier/prettier
      const gameType = roundIdx === ROUND_IDX.ONE ? GAME_TYPE.WIN : GAME_TYPE.LOSE;
      const contest = state.contestInfo[gameType];
      // eslint-disable-next-line prettier/prettier
      const prevRoundIdx = roundIdx === ROUND_IDX.ONE ? ROUND_IDX.ONE : contest.length - 1;
      const winnerChose = roundIdx === ROUND_IDX.ONE ? false : true;

      let newGameInfo = Object.assign([], state.contestInfo.LOSE);
      newGameInfo.push(
        Array.from({ length: gameLenInLose }, (v, i) => {
          const NEW_GAME_FORM = newGameForm();
          const player1SortGameIdx = 2 * i;
          const player2SortGameIdx = 2 * i + 1;
          let player1Info = {
            ...NEW_GAME_FORM.player1,
            game_type: gameType,
            sort: {
              roundIdx: prevRoundIdx,
              game_idx: player1SortGameIdx,
            },
            winner_chose: winnerChose,
          };
          let player2Info = {
            ...NEW_GAME_FORM.player1,
            game_type: gameType,
            sort: {
              roundIdx: prevRoundIdx,
              game_idx: player2SortGameIdx,
            },
            winner_chose: winnerChose,
          };

          let gameInfo = Object.assign(
            {},
            {
              ...NEW_GAME_FORM,
              player1: player1Info,
              player2: player2Info,
            }
          );

          // check prevGame is bye
          const { game_info, contest_all } = gameInfoCheck({
            game_info: gameInfo,
            contest_all: state.contestInfo,
          });

          gameInfo = game_info;
          state.contestInfo = contest_all;

          return gameInfo;
        })
      );
      state.contestInfo.LOSE = newGameInfo;
    },
    roundLoseFromLoseWin(state, { roundIdx, gameLenInLose }) {
      const prevRoundIdxLose = state.contestInfo.LOSE.length - 1;
      const prevRoundIdxWin = roundIdx;
      // eslint-disable-next-line prettier/prettier
      const player2Sort = roundOneSortGet(gameLenInLose, GAME_TYPE.LOSE).reverse();
      let newGameInfo = Object.assign([], state.contestInfo.LOSE);

      newGameInfo.push(
        Array.from({ length: gameLenInLose }, (v, i) => {
          const player2GameIdx = player2Sort[i];
          const NEW_GAME_INFO = newGameForm();

          let gameInfo = Object.assign(
            {},
            {
              ...NEW_GAME_INFO,
              player1: {
                ...NEW_GAME_INFO.player1,
                game_type: GAME_TYPE.LOSE,
                sort: { roundIdx: prevRoundIdxLose, game_idx: i },
                winner_chose: true,
              },
              player2: {
                ...NEW_GAME_INFO.player2,
                game_type: GAME_TYPE.WIN,
                sort: {
                  roundIdx: prevRoundIdxWin,
                  game_idx: player2GameIdx,
                },
                winner_chose: false,
              },
            }
          );

          const { game_info, contest_all } = gameInfoCheck({
            game_info: gameInfo,
            contest_all: state.contestInfo,
          });

          gameInfo = game_info;
          state.contestInfo = contest_all;

          return gameInfo;
        })
      );
      state.contestInfo.LOSE = newGameInfo;
    },
    roundRobinOne(state, { game_count }) {
      const teamMaxId = state.teamCount - 1;
      let newGameInfo = Object.assign([], state.contestInfo.WIN);

      newGameInfo.push(
        Array.from({ length: game_count }, (v, i) => {
          const bye = i * 2 + 1 > teamMaxId;
          const player1_Id = i * 2;
          const player2_Id = bye ? NO_ID : i * 2 + 1;
          return roundRobinBuild({ player1_Id, player2_Id, bye });
        })
      );
      state.contestInfo.WIN = newGameInfo;
    },
    roundRobinOther(state, { round_count, game_count }) {
      const game_last_idx = game_count - 1;
      let newGameInfo = Object.assign([], state.contestInfo.WIN);

      for (let roundIdx = 1; roundIdx < round_count; roundIdx++) {
        const preRound = newGameInfo[roundIdx - 1];
        const newGameInRound = Array.from({ length: game_count }, (v, i) => {
          const { player1_order, player2_order } = roundRobinIdOrderGet({
            game_idx: i,
            game_last_idx,
          });

          const player1_Id = preRound[player1_order.game_idx][player1_order.player_key].id;

          const player2_Id = preRound[player2_order.game_idx][player2_order.player_key].id;

          return roundRobinBuild({ player1_Id, player2_Id });
        });
        newGameInfo.push(newGameInRound);
      }

      state.contestInfo.WIN = newGameInfo;
    },
  },
  actions: {
    singleInfoSizeChange({ commit }, { base, exponent }) {
      for (let winGameIdx = 0; winGameIdx <= exponent; winGameIdx++) {
        const gameLen = Math.pow(base, winGameIdx);
        switch (winGameIdx) {
          case exponent:
            commit("roundOneWin", { gameLen });
            break;
          default:
            commit("roundOtherWin", {
              roundIdx: exponent - winGameIdx - 1,
              gameLen,
              last_round: exponent - winGameIdx - 1 === exponent - 1,
            });
            break;
        }
      }
      commit("thirdPlaceWinAdd");
    },
    doubleInfoSizeChange({ commit, state }, { base, exponent }) {
      // WIN
      for (let winGameIdx = 0; winGameIdx <= exponent; winGameIdx++) {
        const gameLenWin = Math.pow(base, winGameIdx);
        switch (winGameIdx) {
          case exponent:
            commit("roundOneWin", { gameLen: gameLenWin });
            break;
          default:
            commit("roundOtherWin", {
              roundIdx: exponent - winGameIdx - 1,
              gameLen: gameLenWin,
            });
            break;
        }
      }

      // LOSE
      commit("roundLoseRoundOne");

      if (!state.teamCountPowCheck) exponent = exponent + 1;
      for (let roundIdx = 1; roundIdx < exponent; roundIdx++) {
        const gameLenInLose = state.contestInfo.WIN[roundIdx].length;
        if (roundIdx !== 1) {
          commit("roundLoseFromLose", { roundIdx, gameLenInLose });
        }
        commit("roundLoseFromLoseWin", { roundIdx, gameLenInLose });
      }

      commit("roundOneAllByeCheck");
      commit("championLoseAdd");
      commit("championAdd");

      if (Object.keys(state.contestInfo.LOSE.slice(-1)[0]).length > 1) {
        commit("roundLoseFromLose", { roundIdx: exponent, gameLenInLose: 1 });
        commit("roundLoseFromLoseWin", {
          roundIdx: exponent,
          gameLenInLose: 1,
        });
      }
    },
    roundInfoSizeChange({ state, commit }) {
      const round_count = state.teamCount % 2 === 0 ? state.teamCount - 1 : state.teamCount;
      const game_count = Math.ceil(state.teamCount / 2);
      commit("roundRobinOne", { game_count });
      commit("roundRobinOther", { round_count, game_count });
    },
    contestInfoSizeChange({ state, dispatch, commit }) {
      if (!state.isContestReset) return;
      const { base, exponent } = gameSizeGet(state.teamCount);
      const CONTEST_TYPE_KEY = Object.keys(CONTEST_TYPE);
      commit("contestInfoDefault");
      switch (state.type) {
        case CONTEST_TYPE_KEY[0]:
          dispatch("singleInfoSizeChange", { base, exponent });
          break;
        case CONTEST_TYPE_KEY[1]:
          dispatch("doubleInfoSizeChange", { base, exponent });
          break;
        case CONTEST_TYPE_KEY[2]:
          dispatch("roundInfoSizeChange", { base, exponent });
          break;
        default:
          break;
      }
      console.log(state.contestInfo);
    },
    teamCountDataChange({ commit }, { value }) {
      commit("teamCountChange", { value });
      commit("roundScoreDefault");
    },
  },
  modules: {},
});
