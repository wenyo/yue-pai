import {
  MAX_EXPONENT,
  PLAYER_KEY,
  NO_SCORE,
  GAME_TYPE,
  NO_ID,
  ROUND_IDX,
  GAME_FORM,
  CONTEST_TYPE,
} from "../utils/Enum";

export function newGameForm() {
  return JSON.parse(JSON.stringify(GAME_FORM));
}

export function gameSizeGet(team_count) {
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

export function roundOneSortGet(gameLen, type) {
  const halfCount = 2;
  const teamCount = type === GAME_TYPE.WIN ? 2 : 4;
  let result = [];
  let gameIdxAry = [Array.from({ length: gameLen }, (v, i) => i)];

  if (gameLen < teamCount) return gameIdxAry[0];

  while (gameIdxAry[0].length > teamCount) {
    let newGameIdx = [[], []];
    for (let gameTemp of gameIdxAry) {
      const middleNumber = gameTemp.length / halfCount;
      const firstCutGame = gameTemp.slice(0, middleNumber);
      let secondCutGame = gameTemp.slice(middleNumber, gameTemp.length);
      secondCutGame =
        type === GAME_TYPE.WIN ? secondCutGame.reverse() : secondCutGame;

      newGameIdx[0].push(firstCutGame);
      newGameIdx[1].push(secondCutGame);
    }
    gameIdxAry = newGameIdx[0].concat(newGameIdx[1]);
  }

  let resultTemp = [];
  if (type === GAME_TYPE.WIN) {
    for (const value of gameIdxAry) {
      for (const idx in value) {
        if (!resultTemp[idx]) resultTemp[idx] = [];
        resultTemp[idx].push(value[idx]);
      }
    }
  } else if (type === GAME_TYPE.LOSE) {
    resultTemp = [[], [], [], []];
    for (const value of gameIdxAry) {
      for (const idx in resultTemp) {
        resultTemp[idx].push(value[idx]);
      }
    }
    resultTemp = [resultTemp[0], resultTemp[2], resultTemp[1], resultTemp[3]];
  }

  for (const sortAry of resultTemp) {
    result = result.concat(sortAry);
  }

  return result;
}

export function roundOneInfoBuild({
  sortOrder,
  newGameInfo,
  playerCountInGame,
  seedPlayer,
  notSeedPlayer,
  byeCount,
}) {
  let roundOne = newGameInfo[0];
  let roundTwo = newGameInfo[1];
  let seedCount = seedPlayer.length;
  let notSeedCount = notSeedPlayer.length;

  for (const order of sortOrder) {
    const gameIdx = Math.floor(order / playerCountInGame);
    const playerKey =
      order % playerCountInGame === 0 ? PLAYER_KEY.PLAYER1 : PLAYER_KEY.PLAYER2;
    const otherPlayerKey = playerKeyOtherGet(playerKey);
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
      gameInfo.bye_player.push(otherPlayerKey);
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

  return newGameInfo;
}

export function checkPlayerIDInContest({
  roundIdx,
  idx,
  contestInfo,
  player1Id,
  player2Id,
  scoreResult,
  this_game_type,
  game_type,
}) {
  const roundCheckIdx = this_game_type === game_type ? roundIdx : 0;
  for (
    let roundIdxTemp = roundCheckIdx; // next roundIdx
    roundIdxTemp < contestInfo.length;
    roundIdxTemp++
  ) {
    const roundInfoTemp = contestInfo[roundIdxTemp];
    for (const gameIdxTemp in roundInfoTemp) {
      // 同場比賽跳過
      if (
        this_game_type === game_type &&
        roundIdxTemp === roundIdx &&
        idx === parseInt(gameIdxTemp)
      )
        continue;

      const gameInfoTemp = roundInfoTemp[gameIdxTemp];
      for (const playerIdx of Object.keys(PLAYER_KEY)) {
        const playerKey = [PLAYER_KEY[playerIdx]];
        const playerSort = gameInfoTemp[playerKey].sort;

        if (gameInfoTemp[playerKey].game_type !== this_game_type) continue;

        // clear all origin winner id
        if (
          gameInfoTemp[playerKey].id === player1Id ||
          gameInfoTemp[playerKey].id === player2Id
        ) {
          gameInfoTemp[playerKey].id = NO_ID;
          gameInfoTemp[playerKey].score = NO_SCORE;
        }

        // add new winner id
        if (playerSort.roundIdx === roundIdx && playerSort.game_idx === idx) {
          gameInfoTemp[playerKey].id = gameInfoTemp[playerKey].winner_chose
            ? scoreResult.winner
            : scoreResult.loser;
        }
      }
    }
  }
  return contestInfo;
}

export function byePlayerKeyGet(bye_player) {
  if (bye_player.length !== 1) return;
  return playerKeyOtherGet(bye_player[0]);
}

export function playerKeyOtherGet(player) {
  switch (player) {
    case PLAYER_KEY.PLAYER1:
      return PLAYER_KEY.PLAYER2;
    case PLAYER_KEY.PLAYER2:
      return PLAYER_KEY.PLAYER1;
    default:
      break;
  }
}

export function gameInfoCheck({ game_info, contest_all }) {
  for (const key in PLAYER_KEY) {
    const playerKey = PLAYER_KEY[key];
    const playerInfo = game_info[playerKey];
    const contest = contest_all[playerInfo.game_type];
    const roundIdx = playerInfo.sort.roundIdx;
    const game_idx = playerInfo.sort.game_idx;
    const playerPre = contest[roundIdx][game_idx];
    const winner_chose = playerInfo.winner_chose;

    if (!playerPre.bye) continue;

    const preByePlayerCount = playerPre.bye_player.length;
    if (preByePlayerCount === 1 && winner_chose) {
      playerSortCheck({
        player_info: playerInfo,
        player_pre: playerPre,
      });
    } else {
      game_info.bye_player.push(playerKey);
      game_info.bye = true;
    }
  }

  if (game_info.bye_player.length === 2) game_info.show = false;
  return { game_info, contest_all };
}

export function playerSortCheck({ player_info, player_pre }) {
  const playerOtherKey = byePlayerKeyGet(player_pre.bye_player);
  player_info.sort = player_pre[playerOtherKey].sort;
  player_info.winner_chose = player_pre[playerOtherKey].winner_chose;
  player_info.game_type = player_pre[playerOtherKey].game_type;

  return { player_info, player_pre };
}

export function roundRobinIdOrderGet({ game_idx, game_last_idx }) {
  let result = {
    player1_order: {
      game_idx: -1,
      player_key: "",
    },
    player2_order: {
      game_idx: -1,
      player_key: "",
    },
  };

  switch (game_idx) {
    case ROUND_IDX.ONE:
      result = {
        player1_order: {
          game_idx: ROUND_IDX.ONE,
          player_key: PLAYER_KEY.PLAYER1,
        },
        player2_order: {
          game_idx: ROUND_IDX.TWO,
          player_key: PLAYER_KEY.PLAYER1,
        },
      };
      break;

    case game_last_idx:
      result = {
        player1_order: {
          game_idx: game_idx,
          player_key: PLAYER_KEY.PLAYER2,
        },
        player2_order: {
          game_idx: game_idx - 1,
          player_key: PLAYER_KEY.PLAYER2,
        },
      };
      break;

    default:
      result = {
        player1_order: {
          game_idx: game_idx + 1,
          player_key: PLAYER_KEY.PLAYER1,
        },
        player2_order: {
          game_idx: game_idx - 1,
          player_key: PLAYER_KEY.PLAYER2,
        },
      };
      break;
  }
  return result;
}

export function roundRobinBuild({ player1_Id, player2_Id }) {
  const NEW_GAME_INFO = newGameForm();
  let bye = false;
  let bye_player = [];

  if (player1_Id === NO_ID) {
    bye = true;
    bye_player.push(PLAYER_KEY.PLAYER1);
  }

  if (player2_Id === NO_ID) {
    bye = true;
    bye_player.push(PLAYER_KEY.PLAYER2);
  }

  return Object.assign(
    {},
    {
      ...NEW_GAME_INFO,
      bye,
      bye_player,
      player1: {
        ...NEW_GAME_INFO.player1,
        game_type: GAME_TYPE.NONE,
        winner_chose: true,
        id: player1_Id,
      },
      player2: {
        ...NEW_GAME_INFO.player2,
        game_type: GAME_TYPE.NONE,
        winner_chose: false,
        id: player2_Id,
      },
    }
  );
}

export function playerIdGet({ contest_info, game_type, player_info }) {
  const { groupIdx, roundIdx, idx, playerKey } = player_info;
  switch (game_type) {
    case CONTEST_TYPE.ROUND.id:
      return contest_info[game_type][groupIdx][roundIdx][idx][
        PLAYER_KEY[playerKey]
      ].id;

    default:
      return contest_info[game_type][roundIdx][idx][PLAYER_KEY[playerKey]].id;
  }
}

export function playerIdSet({ contest_info, game_type, player_info, id }) {
  const { groupIdx, roundIdx, idx, playerKey } = player_info;
  switch (game_type) {
    case CONTEST_TYPE.ROUND.id:
      contest_info[game_type][groupIdx][roundIdx][idx][
        PLAYER_KEY[playerKey]
      ].id = id;
      break;

    default:
      contest_info[game_type][roundIdx][idx][PLAYER_KEY[playerKey]].id = id;
      break;
  }
  return contest_info;
}
