<template>
  <div>
    <b-form id="player-from" @submit="onSubmit" v-if="playerForm.show">
      <b-form-group id="input-group-1" label="Your Name:" label-for="input-1">
        <b-form-input id="input-1" v-model="playerForm.name" required placeholder="Enter name"></b-form-input>
      </b-form-group>
      <b-form-group label="Join Room Or Create Room" label-for="radio-group-1">
        <b-form-radio-group
          id="radio-group-1"
          v-model="playerForm.roomSelected"
          :options="playerForm.roomOptions"
          name="radio-options"
        ></b-form-radio-group>
      </b-form-group>
      <b-form-group
        id="input-group-2"
        label="Room ID:"
        label-for="input-2"
        v-if="playerForm.roomSelected==='join'"
      >
        <b-form-input id="input-2" v-model="playerForm.roomID" required placeholder="Enter Room ID"></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="primary">Submit</b-button>
    </b-form>

    <b-form id="setting-from" @submit="onStartGame" v-show="settingForm.show">
      <b-form-group label="Game setting">
        <b-form-checkbox-group
          v-model="settingForm.roleSelected"
          :options="settingForm.roleOptions"
          name="buttons-1"
          buttons
          stacked
        ></b-form-checkbox-group>
      </b-form-group>
      <b-button type="submit" variant="primary">Start Game</b-button>
    </b-form>

    <div id="player-panel" v-show="playerPanel.show">
      Your role is {{this.playerRoleName}}
      <br />
      {{playerPanel.text}}
    </div>
    <b-form id="wolf-form" @submit="onWolfSubmit" v-show="wolfForm.show">
      <b-form-group>
        <b-form-radio-group v-model="wolfForm.selected" :options="wolfForm.options" buttons stacked></b-form-radio-group>
      </b-form-group>
    </b-form>
    <b-form id="seer-form" @submit="onSeerSubmit" v-show="seerForm.show">
      <b-form-group>
        <b-form-checkbox-group
          v-model="seerForm.selected"
          :options="seerForm.options"
          buttons
          stacked
        ></b-form-checkbox-group>
      </b-form-group>
    </b-form>
    <b-form id="robber-form" @submit="onRobberSubmit" v-show="robberForm.show">
      <b-form-group>
        <b-form-radio-group
          v-model="robberForm.selected"
          :options="robberForm.options"
          buttons
          stacked
        ></b-form-radio-group>
      </b-form-group>
    </b-form>
    <b-form id="trouble-maker-form" @submit="onTroubleMakerSubmit" v-show="troubleMakerForm.show">
      <b-form-group>
        <b-form-checkbox-group v-model="troubleMakerForm.selected" :options="troubleMakerForm.options" buttons stacked></b-form-checkbox-group>
      </b-form-group>
    </b-form>
    <b-form id="drunk-form" @submit="onDrunkSubmit" v-show="drunkForm.show">
      <b-form-group>
        <b-form-radio-group v-model="drunkForm.selected" :options="drunkForm.options" buttons stacked></b-form-radio-group>
      </b-form-group>
    </b-form>
    <b-form id="witch-form" @submit="onWitchSubmit" v-show="witchForm.show">
      <b-form-group>
        <b-form-checkbox-group v-model="witchForm.selected" :options="witchForm.options" buttons stacked></b-form-checkbox-group>
      </b-form-group>
    </b-form>
    <b-form id="vote-form" @submit="onVoteSubmit" v-show="voteForm.show">
      <b-form-group>
        <b-form-radio-group v-model="voteForm.selected" :options="voteForm.options" buttons stacked></b-form-radio-group>
      </b-form-group>
    </b-form>
    <b-list-group v-show="this.voteShow">
      <b-list-group-item v-for="(value,index) in this.voteUserIDNumber" :key="index">
        {{this.getUserNameByuserID(index) +" : " + value}}
      </b-list-group-item>
      <b-list-group-item v-show="this.isOwner" button variant="primary" @click="onNewGame">
        one more time
      </b-list-group-item>
    </b-list-group>

    <b-card title="RoomPlayerNumber">{{playerNumber}}</b-card>
    <b-card title="registerRsp">{{registerRsp}}</b-card>
    <b-card title="loginRsp">{{loginRsp}}</b-card>
    <b-card title="roomUserInfoList">{{roomUserInfoList}}</b-card>
    <b-card title="roomInfo">{{roomInfo}}</b-card>
    <b-card title="roleUserMap">{{roleUserMap}}</b-card>
    <b-card title="roleSubmit">{{roleSubmit}}</b-card>
  </div>
</template>

<script>
import { RoleList, randomNum } from "../plugins/var";
import {
  init,
  engine,
  response,
  GameData,
  GameEvent
} from "../plugins/matchvs";
init();

export default {
  mounted() {
    response.initResponse = function(status) {
      if (status === 200) {
        console.log("init success");
      }
    }.bind(this);
    response.registerUserResponse = function(registerRsp) {
      // 用户ID
      this.registerRsp = registerRsp;
      engine.login(registerRsp.userID, registerRsp.token, "dev-miao");
    }.bind(this);
    response.loginResponse = function(loginRsp) {
      this.loginRsp = loginRsp;
      if (this.playerForm.roomSelected === "join") {
        engine.joinRoom(this.playerForm.roomID, this.playerForm.name);
      } else {
        let createRoomInfo = {
          roomName: "Let's go!",
          maxPlayer: 20,
          mode: 1,
          canWatch: 2,
          visibility: 1,
          roomProperty: "roomProperty"
        };
        engine.createRoom(createRoomInfo, this.playerForm.name);
      }
    }.bind(this);
    response.createRoomResponse = function(response) {
      if (response.status === 200) {
        console.log("创建成功！");
        this.roomInfo.roomID = response.roomID;
        this.roomInfo.owner = response.owner;
        this.roomUserInfoList.push({
          userID: this.registerRsp.userID,
          userProfile: this.playerForm.name
        });
        this.settingForm.show = true;
      }
    }.bind(this);
    response.joinRoomResponse = function(status, roomUserInfoList, roomInfo) {
      console.log("加入房间结果：", status);
      console.log("房间用户列表：", roomUserInfoList);
      console.log("房间信息：", roomInfo);
      this.roomUserInfoList = roomUserInfoList;
      this.roomUserInfoList.push({
        userID: this.registerRsp.userID,
        userProfile: this.playerForm.name
      });
      this.roomInfo = roomInfo;
    }.bind(this);
    response.joinRoomNotify = function(roomUserInfo) {
      this.roomUserInfoList.push(roomUserInfo);
    }.bind(this);
    response.joinOverResponse = function(joinOverRsp) {
      // 返回值
      console.log("加入房间结果：", joinOverRsp.status);
      // 负载数据
      console.log("负载信息：", joinOverRsp.cpProto);
    }.bind(this);
    response.joinOverNotify = function(notifyInfo) {
      console.log("加入房间结束：", notifyInfo);
    }.bind(this);
    response.leaveRoomNotify = function(leaveRoomInfo) {
      console.log("有玩家离开：", leaveRoomInfo);
      let index = this.roomUserInfoList.findIndex(value => {
        value.userID === leaveRoomInfo.userID;
      });
      this.roomUserInfoList.splice(index, 1);
    }.bind(this);
    response.sendEventResponse = function(sendEventResponse) {
      console.log("发送消息结果：", sendEventResponse);
      if (sendEventResponse.status === 200) {
        let msg = this.sentMsg[sendEventResponse.sequence];
        this.receiveMsg(msg);
      }
    }.bind(this);
    response.sendEventNotify = function(sendEventNotify) {
      console.log("收到消息：", sendEventNotify);
      let msg = JSON.parse(sendEventNotify.cpProto);
      this.receiveMsg(msg);
    }.bind(this);

    //初始化roleOptions
    for (let role in RoleList) {
      if(role === "property") continue;
      this.settingForm.roleOptions.push({
        text: this.$t("role." + RoleList.property[RoleList[role]].name),
        value: role
      });
    }

    //初始化matchvs
    engine.init(
      response,
      GameData.channel,
      GameData.platform,
      GameData.gameID,
      GameData.appKey,
      GameData.gameVersion
    );
  },
  data() {
    return {
      roleList: RoleList,
      playerForm: {
        show: true,
        name: randomNum(100,999),
        roomOptions: this.$t("rooms"),
        roomSelected: "join",
        roomID: ""
      },
      settingForm: {
        show: false,
        roleOptions: [],
        roleSelected: []
      },
      registerRsp: null,
      loginRsp: null,
      roomUserInfoList: [],
      roomInfo: {
        roomID: 0,
        roomProperty: {},
        owner: 0
      },
      originRoleUserMap:{},
      roleUserMap: {},
      sentMsg: {},
      playerRole: "",
      playerPanel: {
        show: false,
        text: ""
      },
      wolfForm: {
        show: false,
        options: [],
        selected: ""
      },
      seerForm: {
        show: false,
        options: [],
        selected: []
      },
      robberForm: {
        show: false,
        options: [],
        selected: ""
      },
      troubleMakerForm: {
        show: false,
        options: [],
        selected: []
      },
      drunkForm: {
        show: false,
        options: [],
        selected: ""
      },
      witchForm: {
        show: false,
        options: [],
        selected: []
      },
      voteForm: {
        show: false,
        options: [],
        selected: []
      },
      totalRoles: [],
      waitRoles: [],
      roleSubmit: {},
      voteResult: {},
      voteUserIDNumber:{},
      voteShow: false,
    };
  },
  computed: {
    playerNumber() {
      return this.roomUserInfoList.length;
    },
    isOwner() {
      if(this.registerRsp !== null) return this.roomInfo.owner === this.registerRsp.userID;
      return false;
    },
    playerRoleName(){
      if(RoleList.property[this.playerRole] !== undefined) return RoleList.property[this.playerRole].name;
      return "";
    }
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      engine.registerUser();

      //如果已经登录
      if(this.loginRsp !== null){
        if (this.playerForm.roomSelected === "join") {
          engine.joinRoom(this.playerForm.roomID, this.playerForm.name);
        } else {
          let createRoomInfo = {
            roomName: "Let's go!",
            maxPlayer: 20,
            mode: 1,
            canWatch: 2,
            visibility: 1,
            roomProperty: "roomProperty"
          };
          engine.createRoom(createRoomInfo, this.playerForm.name);
        }
      }
    },
    sendMsg(msg) {
      console.log("send:"+msg);
      let sent = engine.sendEvent(JSON.stringify(msg));
      this.sentMsg[sent.sequence] = msg;
    },
    receiveMsg(msg) {
      if (msg.event === GameEvent.GameStart) {
        console.log("游戏开始");
        this.onMvGameStart(msg.roleUserMap);
      }
      //狼提交
      else if (msg.event === GameEvent.WolfSubmit) {
        this.roleSubmit[GameEvent.role] = msg.selected;
        this.roleMeved(GameEvent.role);
      }
      //狼结果
      else if (msg.event === GameEvent.WolfResult && this.getWolfRoles().indexOf(this.playerRole)>0) {
        this.playerPanel = msg.result;
      }
      //预言家提交
      else if (msg.event === GameEvent.SeerSubmit) {
        this.roleSubmit[GameEvent.role] = msg.selected;
        this.roleMeved(GameEvent.role);
      }
      //预言家结果
      else if (msg.event === GameEvent.SeerResult && this.playerRole === RoleList.Seer) {
        this.playerPanel.text = msg.result;
      }
      //强盗提交
      else if (msg.event === GameEvent.RobberSubmit) {
        this.roleSubmit[GameEvent.role] = msg.selected;
        this.roleMoved(GameEvent.role);
      }
      //强盗结果
      else if (msg.event === GameEvent.RobberResult && this.playerRole === RoleList.Robber) {
        this.playerPanel.text = msg.result;
      }
      //捣蛋鬼提交
      else if (msg.event === GameEvent.RobberSubmit) {
        this.roleSubmit[GameEvent.role] = msg.selected;
        this.roleMoved(GameEvent.role);
      }
      //捣蛋鬼结果
      else if (msg.event === GameEvent.RobberResult && this.playerRole === RoleList.Robber) {
        this.playerPanel.text = msg.result;
      }
      //酒鬼提交
      else if (msg.event === GameEvent.DrunkSubmit) {
        this.roleSubmit[GameEvent.role] = msg.selected;
        this.roleMoved(GameEvent.role);
      }
      //酒鬼结果
      else if (msg.event === GameEvent.DrunkSubmit && this.playerRole === RoleList.Drunk) {
        this.playerPanel.text = msg.result;
      }
      //失眠者结果
      else if (msg.event === GameEvent.InsomanicResult && this.playerRole === RoleList.Insomanic) {
        this.playerPanel.text = msg.result;
      }
      //女巫提交
      else if (msg.event === GameEvent.WitchSubmit) {
        this.roleSubmit[GameEvent.role] = msg.selected;
        this.roleMoved(GameEvent.role);
      }
      //女巫结果
      else if (msg.event === GameEvent.WitchResult && this.playerRole === RoleList.Witch) {
        this.playerPanel.text = msg.result;
      }
      else if (msg.event === GameEvent.DiscussStart){
        this.startDiscuss();
      }
      //投票提交
      else if (msg.event === GameEvent.VoteSubmit) {
        this.voteResult[msg.role] = msg.selected;
        this.roleVoted(msg.role);
      }
      //投票结果
      else if (msg.event === GameEvent.VoteResult){
        this.voteUserIDNumber = GameEvent.result;
        this.showVoteResult();
      }
    },
    roleVoted(role){
      //等待列表中剔除角色
      let i = this.waitRoles.findIndex(value => {
        return value === role;
      });
      this.waitRoles.splice(i, 1);
      //等待列表为空，进行投票结算，通知投票结果
      if (this.waitRoles.length === 0 && this.isOwner) {
        for(let role in this.voteResult){
          let userID = this.voteResult[role];
          if(this.voteUserIDNumber[userID] === undefined) this.voteUserIDNumber[userID]=0;
          else this.voteUserIDNumber[userID]++;
        }
        this.sendMsg({
          event: GameEvent.VoteResult,
          result: this.voteUserIDNumber,
        })
      }
    },
    roleMoved(role) {
      //等待列表中剔除角色
      let i = this.waitRoles.findIndex(value => {
        return value === role;
      });
      this.waitRoles.splice(i, 1);
      this.checkWaitRoles();
    },
    //检查是否需要等待
    checkWaitRoles() {
      //等待列表为空，进行结算，进入讨论阶段 房主结算提交结果
      if (this.waitRoles.length === 0 && this.isOwner) {
        for (let role of this.totalRoles) {
          // 狼
          if (this.getWolfRoles().indexOf(role)>0){
            let selected = this.roleSubmit[role].selected;
            let msg = {
              event: GameEvent.WolfResult,
              result: "这张牌是："+this.$t(RoleList.property[this.getRoleByuserID(selected)].name)
            }
            this.sendMsg(msg);
          }
          // 预言家
          else if (role === RoleList.Seer) {
            let msg = {
              event: GameEvent.SeerResult,
              result: ""
            };
            for (let userID of this.roleSubmit[role].selected) {
              let role = this.getRoleByuserID(userID);
              msg.result +=
                this.getUserNameByuserID(userID) +
                " 的身份：" +
                this.$t(RoleList.property[role].name) +
                "\n";
            }
            this.sendMsg(msg);
          } 
          // 强盗
          else if (role === RoleList.Robber) {
            let selected = this.roleUserMap[role].selected;
            this.exchangeRole(
              selected,
              this.roleUserMap[role].userID
            );
            let msg = {
              event: GameEvent.RobberResult,
              result: "你与 "+this.getUserNameByuserID(selected)+" 交换了身份， 你现在的身份：" + this.$t(RoleList.property[this.getRoleByuserID(selected)].name)
            };
            this.sendMsg(msg);
          }
          // 捣蛋鬼
          else if(role === RoleList.TroubleMaker){
            this.exchangeRole(this.roleSubmit.selected[0],this.roleSubmit.selected[1]);
            let msg = {
              event: GameEvent.TroubleMakerResult,
              result: "你交换了 "+this.getUserNameByuserID(this.roleSubmit.selected[0])+" 和 "+this.getUserNameByuserID(this.roleSubmit.selected[1])+" 的身份",
            }
            this.sendMsg(msg);
          }
          // 酒鬼
          else if(role === RoleList.Drunk){
            let selected = this.roleUserMap[role].selected;
            this.exchangeRole(selected,this.roleUserMap[role].userID);
            let msg = {
              event: GameEvent.RobberResult,
              result:"你与 "+this.getUserNameByuserID(selected)+" 交换了身份"
            };
            this.sendMsg(msg);
          }
          // 失眠者
          else if(role === RoleList.Insomanic){
            let msg = {
              event: GameEvent.InsomanicResult,
              result: "你现在的身份是："+ this.$t(RoleList.property[this.getRoleByuserID(this.originRoleUserMap[role].userID)].name)
            }
            this.sendMsg(msg);
          }
          // 女巫
          else if(role === RoleList.Witch){
            let noPlayerIndex = this.isPlayer(this.roleSubmit.selected[0]) ? 1 : 0;
            let noPlayerRole = this.getRoleByuserID(this.roleSubmit.selected[noPlayerIndex]);
            this.exchangeRole(this.roleSubmit.selected[0],this.roleSubmit.selected[1]);
            let msg = {
              event: GameEvent.WitchResult,
              result: "你将非玩家身份 "+ this.$t(RoleList.property[noPlayerRole].name) +" 给了 "+this.getUserNameByuserID(this.roleSubmit.selected[noPlayerIndex===0?1:0]),
            }
            this.sendMsg(msg);
          }
        }
        let msg = { event: GameEvent.DiscussStart };
        this.sentMsg(msg);
      }
    },
    onStartGame(evt) {
      evt.preventDefault();
      engine.joinOver("Start Game!");
      this.createRoleUserMap();
      let msg = {
        event: GameEvent.GameStart,
        roleUserMap: this.roleUserMap
      };
      this.sendMsg(msg);

      //计算结算顺序
      let roleSelected = Array.from(this.settingForm.roleSelected);
      roleSelected.sort((a, b) => {
        return RoleList.property[RoleList[a]].order - RoleList.property[RoleList[b]].order;
      });
      //创建局内需要结算的角色列表
      this.totalRoles = Array.from(roleSelected);

      //计算需要提交的角色
      this.waitRoles = roleSelected.filter(role => {
        //单狼需要提交
        if (role === RoleList.WereWolf || role === RoleList.WereWolf2) {
          if (this.getWolfRoles().length === 1) return true;
          return false;
        }
        //爪牙、失眠者不需要提交
        else if (
          RoleList.property[RoleList[role]].order > 0 &&
          role !== RoleList.Minion &&
          role !== RoleList.Insomanic
        ) {
          return true;
        } else {
          return false;
        }
      });
    },
    onMvGameStart(roleUserMap) {
      this.roleUserMap = this.originRoleUserMap = roleUserMap;
      for (let role in roleUserMap) {
        console.log(role);
        //当前玩家的角色
        if (this.registerRsp.userID === roleUserMap[role].userID) {
          this.playerRole = role;
        }
      }
      this.playerPanel.text = "waiting...";
      this.playerPanel.show = true;

      //玩家是村民
      if (
        this.playerRole === RoleList.Villager ||
        this.playerRole === RoleList.Villager2 ||
        this.playerRole === RoleList.Villager3
      ) {
        //TODO
      } 
      // 玩家是狼
      else if (
        this.playerRole === RoleList.WereWolf || this.playerRole === RoleList.WereWolf2
      ) {
        let wolfRoles = this.getWolfRoles();
        // 场上只有一狼
        if (wolfRoles.length === 1) {
          this.playerPanel.text = "你没有队友，查看一张非玩家牌";
          for (let roleUser in roleUserMap) {
            if (roleUserMap[roleUser].userProfile !== "no player") continue;
            this.wolfForm.options.push({
              text: roleUserMap[roleUser].userProfile,
              value: roleUserMap[roleUser].userID
            });
          }
          this.wolfForm.show = true;
        }
        // 多狼
        else {
          this.playerPanel.text = "狼队：";
          for (let role in wolfRoles) {
            this.playerPanel.text += this.roleUserMap[role].userProfile + ",";
          }
        }
      } else if (this.playerRole === RoleList.Minion) {
        this.playerPanel.text = "狼队：";
        let wolfRoles = this.getWolfRoles();
        for (let role in wolfRoles) {
          this.playerPanel.text += this.roleUserMap[role].userProfile + ",";
        }
      }
      // 玩家是预言家
      else if (this.playerRole === RoleList.Seer) {
        this.playerPanel.text = "查看一张玩家牌或两张非玩家牌";
        for (let roleUser in roleUserMap) {
          this.seerForm.options.push({
            text: roleUserMap[roleUser].userProfile,
            value: roleUserMap[roleUser].userID
          });
        }
        this.seerForm.show = true;
      }
      // 玩家是强盗
      else if (this.playerRole === RoleList.Robber) {
        this.playerPanel.text = "将你的牌与一张玩家牌交换";
        for (let roleUser in roleUserMap) {
          if (
            roleUserMap[roleUser].userID === this.registerRsp.userID ||
            roleUserMap[roleUser].userProfile === "no player"
          )
            continue;
          this.robberForm.options.push({
            text: roleUserMap[roleUser].userProfile,
            value: roleUserMap[roleUser].userID
          });
        }
        this.robberForm.show = true;
      }
      // 玩家是捣蛋鬼
      else if(this.playerRole === RoleList.TroubleMaker){
        this.playerPanel.text = "将两张玩家牌交换";
        for (let roleUser in roleUserMap) {
          if (
            roleUserMap[roleUser].userID === this.registerRsp.userID ||
            roleUserMap[roleUser].userProfile === "no player"
          )
            continue;
          this.troubleMakerForm.options.push({
            text: roleUserMap[roleUser].userProfile,
            value: roleUserMap[roleUser].userID
          });
        }
        this.troubleMakerForm.show = true;
      }
      // 酒鬼
      else if(this.playerRole === RoleList.Drunk){
        this.playerPanel.text = "将你的牌与一张玩家牌交换";
        for (let roleUser in roleUserMap) {
          if (
            roleUserMap[roleUser].userID === this.registerRsp.userID ||
            roleUserMap[roleUser].userProfile === "no player"
          )
            continue;
          this.drunkForm.options.push({
            text: roleUserMap[roleUser].userProfile,
            value: roleUserMap[roleUser].userID
          });
        }
        this.drunkForm.show = true;
      }
      // 女巫
      else if(this.playerRole === RoleList.Witch){
        this.playerPanel.text = "将一张非玩家牌与一张玩家牌交换";
        for (let roleUser in roleUserMap) {
          if (roleUserMap[roleUser].userID === this.registerRsp.userID) continue;
          this.witchForm.options.push({
            text: roleUserMap[roleUser].userProfile,
            value: roleUserMap[roleUser].userID
          });
        }
        this.witchForm.show = true;
      }
    },
    startDiscuss() {
      for (let userInfo in this.userInfoList) {
        this.voteForm.options.push({
          text: userInfo.userProfile,
          value: userInfo.userID
        });
      }
      this.voteForm.show = true;
      // 创建等待角色列表
      this.waitRoles = [];
      for(let role in this.roleUserMap){
        if(this.roleUserMap[role].userProfile !== "no player") this.waitRoles.push(role);
      }
    },
    showVoteResult(){
      this.voteShow = true;
    },
    onNewGame(){
      this.voteShow = false;
      this.settingForm.show = true;
    },
    onWolfSubmit(){
      let msg = {
        event: GameEvent.WolfSubmit,
        selected: this.wolfForm.selected,
        role: this.playerRole,
      };
      this.sendMsg(msg);
      this.wolfForm.show = false;
      this.playerPanel.text = "waiting...";
    },
    onSeerSubmit() {
      let msg = {
        event: GameEvent.SeerSubmit,
        selected: this.seerForm.selected,
        role: this.playerRole,
      };
      this.sendMsg(msg);
      this.seerForm.show = false;
      this.playerPanel.text = "waiting...";
    },
    onRobberSubmit() {
      let msg = {
        event: GameEvent.RobberSubmit,
        selected: this.robberForm.selected,
        role: this.playerRole,
      };
      this.sendMsg(msg);
      this.robberForm.show = false;
      this.playerPanel.text = "waiting...";
    },
    onTroubleMakerSubmit() {
      let msg = {
        event: GameEvent.TroubleMakerSubmit,
        selected: this.troubleMakerForm.selected,
        role: this.playerRole,
      };
      this.sendMsg(msg);
      this.troubleMakerForm.show = false;
      this.playerPanel.text = "waiting...";
    },
    onDrunkSubmit(){
      let msg = {
        event: GameEvent.DrunkSubmit,
        selected: this.drunkForm.selected,
        role: this.playerRole,
      };
      this.sendMsg(msg);
      this.drunkForm.show = false;
      this.playerPanel.text = "waiting...";
    },
    onWitchSubmit(){
      let msg = {
        event: GameEvent.WitchSubmit,
        selected: this.witchForm.selected,
        role: this.playerRole,
      };
      this.sendMsg(msg);
      this.witchForm.show = false;
      this.playerPanel.text = "waiting...";
    },
    onVoteSubmit() {
      let msg = {
        event: GameEvent.VoteSubmit,
        selected: this.voteForm.selected,
        role: this.playerRole,
      };
      this.sentMsg(msg);
      this.voteForm.show = false;
      this.playerPanel.text = "vote complete";
    },
    createRoleUserMap() {
      let userInfoList = JSON.parse(JSON.stringify(this.roomUserInfoList));
      for (let role in this.settingForm.roleSelected) {
        if (userInfoList.length === 0) {
          this.roleUserMap[role] = {
            userID: "no-player-" + role,
            userProfile: "no-player"
          };
        } else {
          let i = randomNum(0, userInfoList.length);
          this.roleUserMap[role] = userInfoList[i];
          userInfoList.splice(i, 1);
        }
      }
    },
    getRoleByuserID(userID) {
      for (let role in this.roleUserMap) {
        if (userID === this.roleUserMap.role.userInfo.userID) {
          return role;
        }
      }
    },
    setRoleByuserID(newRole, userID) {
      let role = this.getRoleByuserID(userID);
      let info = this.roleUserMap[role];
      delete this.roleUserMap[role];
      this.roleUserMap[newRole] = info;
    },
    getUserNameByuserID(userID) {
      for (let userInfo of this.roomUserInfoList) {
        if (userID === userInfo.userID) {
          return userInfo.userProfile;
        }
      }
    },
    exchangeRole(userID, userID2) {
      let role = this.getRoleByuserID(userID);
      let role2 = this.getRoleByuserID(userID2);
      this.setRoleByuserID(role2, userID);
      this.setRoleByuserID(role, userID2);
    },
    getWolfRoles() {
      let roles = [];
      for (let role in this.roleUserMap) {
        if (
          (role === RoleList.WereWolf || role === RoleList.WereWolf2) &&
          this.roleUserMap[role].userProfile !== "no player"
        ) {
          roles.push(role);
        }
      }
      return roles;
    },
    isPlayer(userID){
      return userID.indexOf("no player") === 0;
    }
  }
};
</script>