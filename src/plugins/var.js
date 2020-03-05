const RoleList = {
  Villager: 1,
  Villager2: 2,
  Villager3: 3,
  WereWolf: 4,
  WereWolf2: 5,
  Minion: 7,
  Seer: 9,
  Robber: 12,
  Witch: 13,
  TroubleMaker: 14,
  Drunk: 16,
  Insomanic: 17,
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
    9: {
      name: "Seer",
      order: 9,
    },
    12: {
      name: "Robber",
      order: 12,
    },
    14: {
      name: "TroubleMaker",
      order: 14,
    },
    16: {
      name: 'Drunk',
      order: 16,
    },
    17: {
      name: 'Insomanic',
      order: 17,
    },
    7: {
      name: 'Minion',
      order: 7,
    },
    13: {
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
      return Math.floor(Math.random() * minNum);
    case 2:
      return Math.floor(Math.random() * (maxNum - minNum) + minNum);
    default:
      return 0;
  }
}
export {
  RoleList,
  randomNum,
}