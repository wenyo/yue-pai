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
  NONE: "NONE",
  WIN: "WIN",
  LOSE: "LOSE",
};

export const MAX_EXPONENT = 6;

export const NO_SCORE = -1;
export const NO_ID = -1;
export const NO_PLAYER = "none";
export const GROUP_DEFAULT = 1;

export const ROUND = { ONE: 1 };
export const ROUND_IDX = { ONE: 0, TWO: 1 };

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
  player1: {
    score: NO_SCORE,
    //round 1
    id: NO_ID,
    //round others
    game_type: GAME_TYPE.NONE,
    sort: { roundIdx: -1, game_idx: -1 },
    winner_chose: true,
  },
  player2: {
    score: NO_SCORE,
    //round 1
    id: NO_ID,
    //round others
    game_type: GAME_TYPE.NONE,
    sort: { roundIdx: -1, game_idx: -1 },
    winner_chose: true,
  },
  place: "",
  date: "",
  time: "",
  bye: false,
  bye_player: [],
  show: true,
  championship: false,
  third_place: false,
};

export const BUTTON_TYPE = {
  MASTER: "master",
  SECOND: "second",
  THIRD: "third",
  FORTH: "forth",
  FIVE: "five",
};

export const STEP_IDX = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
};
