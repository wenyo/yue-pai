import { MAX_EXPONENT, PLAYER_KEY, NO_SCORE, GAME_TYPE } from "../utils/Enum";

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

export function roundOneGameSortGet(gameLen) {
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

export function checkPlayerIDInWinContest({
  roundIdx,
  idx,
  contestWinInfo,
  player1Info,
  player2Info,
  scoreResult,
}) {
  for (
    let roundIdxTemp = roundIdx + 1;
    roundIdxTemp < contestWinInfo.length;
    roundIdxTemp++
  ) {
    const roundInfoTemp = contestWinInfo[roundIdxTemp];
    for (const gameInfoTemp of roundInfoTemp) {
      for (const playerIdx of Object.keys(PLAYER_KEY)) {
        const playerKey = [PLAYER_KEY[playerIdx]];
        const playerSort = gameInfoTemp[playerKey].sort;

        gameInfoTemp[playerKey].game_type === GAME_TYPE.WIN;

        // clear all origin winner id
        if (
          gameInfoTemp[playerKey].id === player1Info.id ||
          gameInfoTemp[playerKey].id === player2Info.id
        ) {
          gameInfoTemp[playerKey].id = "";
          gameInfoTemp[playerKey].score = NO_SCORE;
        }

        // add new winner id
        if (
          roundIdxTemp === roundIdx + 1 &&
          playerSort.roundIdx === roundIdx &&
          playerSort.game_idx === idx
        ) {
          gameInfoTemp[playerKey].id = scoreResult.winner;
        }
      }
    }
  }
  return contestWinInfo;
}