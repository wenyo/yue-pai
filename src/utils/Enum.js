export const CONTEST_TYPE = {
  SINGLE: {
    eng: "Single elimination",
    ch: "單淘汰賽",
    id: "SINGLE",
  },
  DOUBLE: {
    eng: "Double elimination",
    ch: "雙淘汰賽",
    id: "DOUBLE",
  },
  ROUND: {
    eng: "Round robin",
    ch: "循環賽",
    id: "ROUND",
  },
};

export const CONTEST_VALUE = Object.keys(CONTEST_TYPE).map(
  (key) => CONTEST_TYPE[key].id
);

export const GAME_TYPE = {
  WIN: "WIN",
  LOSE: "LOSE",
};

export const MAX_EXPONENT = 6;

export const NO_SCORE = -1;

export const ROUND_ONE = 1;

export const CONTEST_INFO_DEFAULT = { WIN: [], LOSE: [] };

export const PLAYER_KEY = {
  PLAYER1: "player1",
  PLAYER2: "player2",
};

export const TEAM_FORM = {
  id: "",
  name: "",
  is_seed: false,
};

export const GAME_FORM = {
  type: GAME_TYPE.WIN,
  player1: {
    score: -1,
    //round 1
    id: "",
    //round others
    game_type: "",
    sort: { roundIdx: -1, game_idx: -1 },
    winner_chose: true,
  },
  player2: {
    score: -1,
    //round 1
    id: "",
    //round others
    game_type: "",
    sort: { roundIdx: -1, game_idx: -1 },
    winner_chose: true,
  },
  place: "",
  time: "",
  bye: false,
};
