import { ROUND, NO_PLAYER, PLAYER_KEY, NO_SCORE, GAME_TYPE, NO_ID, CONTEST_TYPE } from "../utils/Enum";

export default class MatchData {
  constructor(props) {
    this.contestType = props.contestType;
    this.gameType = props.gameType;
    this.game = props.game;
    this.idx = props.idx;
    this.roundIdx = props.roundIdx;
    this.teamInfo = props.teamInfo;
    this.round = props.roundIdx + 1;
    this.game_number = props.idx + 1;
    this.scoreDefault = props.game.bye ? "-" : "比分";
  }

  namePlaceholderGetFromPrevGame(playerKey) {
    const gameType = this.game[playerKey].game_type;
    const winnerChose = this.game[playerKey].winner_chose;
    const sort = this.game[playerKey].sort;
    const gameTypeText =
      this.contestType === CONTEST_TYPE.SINGLE.id ? "" : gameType === GAME_TYPE.WIN ? "勝部" : "敗部";
    const winnerChoseText = winnerChose ? "勝者" : "敗者";
    const prevRound = sort.roundIdx + 1;
    const prevGameSort = sort.game_idx + 1;
    return `${gameTypeText}${prevRound}-${prevGameSort} ${winnerChoseText}`;
  }

  namePlaceholderGet(playerKey) {
    if (this.game.bye_player.includes(PLAYER_KEY[playerKey])) return "輪空";

    if (this.round === ROUND.ONE && this.contestType === GAME_TYPE.WIN) return "隊伍名稱";
    return this.namePlaceholderGetFromPrevGame(PLAYER_KEY[playerKey]);
  }

  nameGet(playerKey) {
    const id = this.game[PLAYER_KEY[playerKey]].id;
    return id === NO_ID ? "" : this.teamInfo[id].name;
  }

  idGet(playerKey) {
    const id = this.game[PLAYER_KEY[playerKey]].id;
    return id === NO_ID ? "" : id;
  }

  nameDisabled(playerKey) {
    return (
      this.contestType === GAME_TYPE.LOSE ||
      this.round !== ROUND.ONE ||
      (this.game.bye && this.game[PLAYER_KEY[playerKey]].id === NO_ID)
    );
  }

  scoreValue(playerKey) {
    return this.game[PLAYER_KEY[playerKey]].score === NO_SCORE ? "" : this.game[PLAYER_KEY[playerKey]].score;
  }

  scoreDisabled(playerKey) {
    return this.game.bye || this.game[PLAYER_KEY[playerKey]].id === NO_ID;
  }

  seedCheck(playerKey) {
    const id = this.game[PLAYER_KEY[playerKey]].id;
    if (id === NO_ID) return;
    return this.teamInfo[id].is_seed;
  }

  draggableCheck() {
    return this.round === ROUND.ONE && this.gameType === GAME_TYPE.WIN;
  }

  winnerGet() {
    if (this.game.player1.score === NO_SCORE || this.game.player1.score === NO_SCORE ) return NO_PLAYER;
    if (this.game.player1.score > this.game.player2.score) return PLAYER_KEY.PLAYER1;
    if (this.game.player1.score < this.game.player2.score) return PLAYER_KEY.PLAYER2;
    return NO_PLAYER;
  }
}
