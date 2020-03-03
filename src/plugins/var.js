const RoleList = {
  Villager: 1,
  Villager2: 2,
  Villager3: 3,
  WereWolf: 4,
  WereWolf2: 5,
  Seer: 6,
  Robber: 7,
  TroubleMaker: 8,
  Drunk: 9,
  Insomanic: 10,
  Minion: 11,
  Witch: 12,
  property: {
    1: {
      name: "Villager",
      order: 0,
    },
    2: {
      name: "Villager",
      order: 0,
    },
    3: {
      name: "Villager",
      order: 0,
    },
    4: {
      name: "WereWolf",
      order: 4,
    },
    5: {
      name: "WereWolf",
      order: 4,
    },
    6: {
      name: "Seer",
      order: 9,
    },
    7: {
      name: "Robber",
      order: 12,
    },
    8: {
      name: "TroubleMaker",
      order: 14,
    },
    9: {
      name: 'Drunk',
      order: 16,
    },
    10: {
      name: 'Insomanic',
      order: 17,
    },
    11: {
      name: 'Minion',
      order: 7,
    },
    12: {
      name: 'Witch',
      order: 13,
    },
  },
  // Tanner:
  // {
  //   name: 'Tanner'
  // },
  // Hunter:{
  //   name: 'Hunter'
  // },
  // Mason:{
  //   name: 'Mason'
  // },
  // Mason2: {
  //   name: 'Mason'
  // },
  // Doppelganger:{
  //   name: 'Doppelganger'
  // },
  // Sentinel:{
  //   name: 'Sentinel'
  // },
  // AlphaWolf:{
  //   name: 'AlphaWolf'
  // },
  // MysticWolf:{
  //   name: 'MysticWolf'
  // },
  // ApprenticeSeer:{
  //   name: 'ApprenticeSeer'
  // },
  // ParanormalInvestigator:{
  //   name: 'ParanormalInvestigator'
  // },
  // VillageIdiot:{
  //   name: 'VillageIdiot'
  // },
  // Revealer:{
  //   name: 'Revealer'
  // },
  // Curator:{
  //   name: 'Curator'
  // },
  // BodyGuard:{
  //   name: 'BodyGuard'
  // },
  // DreamWolf:{
  //   name: 'DreamWolf'
  // }
}
//生成从minNum到maxNum的随机数
function randomNum(minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10);
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
    default:
      return 0;
  }
}
export {
  RoleList,
  randomNum,
}