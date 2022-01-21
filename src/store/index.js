import { createStore } from "vuex";
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
  roundOneGameSortGet,
  roundOneInfoBuild,
  checkPlayerIDInContest,
  gameInfoCheck,
  roundRobinBuild,
  roundRobinIdOrderGet,
  newGameForm,
} from "../utils/ContestFunc";

export default createStore({
  state: {
    type: "",
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
      const newTeamCount = payload;
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

      if (state.type === CONTEST_TYPE.ROUND.id && !nextWinRound) return;

      const player1Info = thisGame[PLAYER_KEY.PLAYER1];
      const player2Info = thisGame[PLAYER_KEY.PLAYER2];
      const has_result =
        player1Info.score !== NO_SCORE &&
        player2Info.score !== NO_SCORE &&
        player1Info.score !== player2Info.score;
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

      state.contestInfo[GAME_TYPE.WIN][championshipAddRound][
        championshipAddGameIdx
      ].show = player1Info.score < player2Info.score;
    },
    seedChange(state, { is_seed, idx }) {
      state.teamInfo[idx].is_seed = is_seed;
    },
    roundOneWin(state, { gameLen }) {
      const playerCountInGame = 2;
      let newGameInfo = Object.assign([], state.contestInfo.WIN);
      newGameInfo.unshift(Array.from({ length: gameLen }, () => newGameForm()));

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
          sort: { roundIdx: lastWinRoundIdx, game_idx: ROUND_IDX.ONE },
        },
        championship: true,
        show: false,
      };
      state.contestInfo.WIN.push([championGame]);
    },
    roundLoseFromLose(state, { winRoundIdx, gameLenInLose }) {
      const winContest = state.contestInfo.WIN[winRoundIdx];
      const winRoundLen = winContest.length;
      const gameType =
        winRoundIdx === ROUND_IDX.ONE ? GAME_TYPE.WIN : GAME_TYPE.LOSE;
      const winnerChose = winRoundIdx === ROUND_IDX.ONE ? false : true;
      const NEW_GAME_FORM = newGameForm();

      let newGameInfo = Object.assign([], state.contestInfo.LOSE);
      newGameInfo.push(
        Array.from({ length: gameLenInLose }, (v, i) => {
          const player1GameIdx = i;
          const player2GameIdx = i + winRoundLen / 2;
          const player1Exist = !winContest[player1GameIdx].bye || winnerChose;
          const player2Exist = !winContest[player2GameIdx].bye || winnerChose;
          let player1Sort = {
            roundIdx: winRoundIdx,
            game_idx: player1GameIdx,
          };
          let player2Sort = {
            roundIdx: winRoundIdx,
            game_idx: player2GameIdx,
          };

          let bye_player = [];
          if (!player1Exist) bye_player.push(PLAYER_KEY.PLAYER1);
          if (!player2Exist) bye_player.push(PLAYER_KEY.PLAYER2);

          return Object.assign(
            {},
            {
              ...NEW_GAME_FORM,
              show: player1Exist || player2Exist,
              bye: !player1Exist || !player2Exist,
              bye_player,
              player1: {
                ...NEW_GAME_FORM.player1,
                game_type: gameType,
                sort: player1Sort,
                winner_chose: winnerChose,
              },
              player2: {
                ...NEW_GAME_FORM.player2,
                game_type: gameType,
                sort: player2Sort,
                winner_chose: winnerChose,
              },
            }
          );
        })
      );
      state.contestInfo.LOSE = newGameInfo;
    },
    roundLoseFromLoseWin(state, { winRoundIdx, gameLenInLose }) {
      const prevRoundIdxLose = state.contestInfo.LOSE.length - 1;
      const prevRoundIdxWin = winRoundIdx + 1;
      let newGameInfo = Object.assign([], state.contestInfo.LOSE);
      newGameInfo.push(
        Array.from({ length: gameLenInLose }, (v, i) => {
          const player2GameIdx = gameLenInLose - i - 1;
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

          return game_info;
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

          const player1_Id =
            preRound[player1_order.game_idx][player1_order.player_key].id;

          const player2_Id =
            preRound[player2_order.game_idx][player2_order.player_key].id;

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
        console.log(winGameIdx, exponent - winGameIdx - 1);
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
    doubleInfoSizeChange({ commit }, { base, exponent }) {
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
      for (let winRoundIdx = 0; winRoundIdx < exponent; winRoundIdx++) {
        const gameLenInLose = Math.pow(base, exponent - winRoundIdx - 1);
        commit("roundLoseFromLose", { winRoundIdx, gameLenInLose });
        commit("roundLoseFromLoseWin", { winRoundIdx, gameLenInLose });
      }
      commit("championLoseAdd");
      commit("championAdd");
    },
    roundInfoSizeChange({ state, commit }) {
      const round_count =
        state.teamCount % 2 === 0 ? state.teamCount - 1 : state.teamCount;
      const game_count = Math.ceil(state.teamCount / 2);
      commit("roundRobinOne", { game_count });
      commit("roundRobinOther", { round_count, game_count });
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
        case CONTEST_TYPE_KEY[2]:
          dispatch("roundInfoSizeChange", { base, exponent });
          break;
        default:
          break;
      }
      console.log(state.contestInfo);
    },
  },
  modules: {},
});
