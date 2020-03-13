/**
 * Matchvs JSB加载与Js加载
 */
var engine;
var response;
var MsMatchInfo;
var MsCreateRoomInfo;
var MsRoomFilterEx;
var LocalStore_Clear;

function init() {
  try {
    engine = new window.MatchvsEngine();
    response = new window.MatchvsResponse();
    MsMatchInfo = window.MsMatchInfo;
    MsCreateRoomInfo = window.MsCreateRoomInfo;
    MsRoomFilterEx = window.MsRoomFilterEx;
    LocalStore_Clear = window.LocalStore_Clear;

    if (typeof BK != "undefined" || typeof FBInstant != "undefined") {
      window.MVS.SetWss && window.MVS.SetWss(true);
    }

  } catch (error) {
    // TODO
  }
}

/**
 * 体验地址的游戏信息
 * @type {{gameID: number, channel: string, platform: string, gameVersion: number, appKey: string, userName: string, mxaNumer: number, userID: string, token: string, host: string}}
 */

const GameData = {
  gameID: 218387,
  channel: 'Matchvs',
  platform: 'alpha',
  gameVersion: 1,
  appKey: '4a2a524ea3394b98bbe51f9e74ef8eb7#M',
  userName: '',
  mxaNumer: 3,
  userID: "",
  token: "",
  host: "",
  isPAAS: false,
  reset: function () {
    GameData.gameID = "";
    GameData.appKey = "";
    GameData.userID = "";
    GameData.token = "";
  },
}

const GameEvent = {
  JoinRoomNotify: 1,
  JoinOverNotify: 2,
  Reconnect: 6,
  ReconnectRsp: 7,
  New: 9,
  GameStart: 10,
  DiscussStart: 11,
  WolfSubmit: 15,
  WolfResult: 16,
  SeerSubmit: 20,
  SeerResult: 21,
  RobberSubmit: 40,
  RobberResult: 41,
  TroubleMakerSubmit: 60,
  TroubleMakerResult: 61,
  DrunkSubmit: 70,
  DrunkResult: 71,
  InsomanicResult: 80,
  WitchSubmit: 90,
  WitchResult: 91,
  RoleSubmit: 100,
  RoleResult: 110,
  VoteSubmit: 999,
  VoteResult: 1000,
}

export {
  GameData,
  GameEvent,
  init,
  engine,
  response,
  MsMatchInfo,
  MsCreateRoomInfo,
  MsRoomFilterEx,
  LocalStore_Clear,
};