<template>
  <b-container>
    <b-card-group columns>
    <b-card v-if="playerForm.show">
      <b-form id="player-from" @submit.prevent="onSubmit">
        <b-form-group id="input-1-group">
          <b-form-input id="input-1" v-model="playerForm.name" required :placeholder="$t('your_name')"></b-form-input>
        </b-form-group>
        <b-form-group id="radio-group-1-group">
          <b-form-radio-group id="radio-group-1" v-model="playerForm.roomSelected" :options="playerForm.roomOptions" buttons></b-form-radio-group>
        </b-form-group>
        <b-form-group id="input-2-group">
          <b-form-input id="input-2" v-if="playerForm.roomSelected=='join'" v-model="playerForm.roomID" required :placeholder="$t('room_id')"></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary">{{$t("submit")}}</b-button>
      </b-form>
    </b-card>
    <b-card header="房间信息" v-if="playerInfo.show">
      {{$t('your_name')+":"+playerForm.name}}
      <br>
      {{$t('room_id')+":"+roomInfo.roomID}}
      <h6>玩家列表</h6>
      <b-button-group vertical>
        <b-button v-for="(value,index) in this.roomUserInfoList" :key="index">
          {{value.userProfile}}
        </b-button>
      </b-button-group>
    </b-card>

    <b-card header="游戏设定" v-if="settingForm.show">
      <b-form id="setting-from" @submit.prevent="onStartGame">
        <b-form-group
          :invalid-feedback="'当前玩家数量为'+this.playerNumber+'，请设置角色数量'+(this.playerNumber+3)"
          :valid-feedback="'数量正确'"
          :state="settingFormState">
          <b-form-checkbox-group
            v-model="settingForm.roleSelected"
            :options="settingForm.roleOptions"
            name="buttons-1"
            buttons
            stacked
          ></b-form-checkbox-group>
        </b-form-group>
        <b-button type="submit" variant="primary">{{this.$t("start_game")}}</b-button>
      </b-form>
    </b-card>

    <b-card header="游戏信息" v-if="playerPanel.show">
      <h6>本局游戏身份</h6>
      <b-button-group vertical>
        <b-button v-for="(value,index) in this.roleUserMap" :key="index" v-b-tooltip.hover :title="$t('role_des.'+roleList.property[index].name)">
          {{$t('role.'+roleList.property[index].name)}}
        </b-button>
      </b-button-group>
      <div id="player-panel" class="p-1">
        <p>{{$t("your_role")}}{{$t('role.'+roleList.property[playerRole].name)}}</p>
        <p>{{$t('role_des.'+roleList.property[playerRole].name)}}</p>
      </div>
    </b-card>

    <b-card header="操作" v-if="playerPanel.show">
      <p>{{playerPanel.text}}</p>
      <b-form id="wolf-form" @submit.prevent="onWolfSubmit" v-show="wolfForm.show">
        <b-form-group :invalid-feedback="$t('invalid')"
          :state="wolfFormState">
          <b-form-radio-group v-model="wolfForm.selected" :options="wolfForm.options" buttons stacked></b-form-radio-group>
        </b-form-group>
        <b-button type="submit" variant="primary">{{$t("submit")}}</b-button>
      </b-form>
      <b-form id="seer-form" @submit.prevent="onSeerSubmit" v-show="seerForm.show">
        <b-form-group :invalid-feedback="$t('invalid')"
          :state="seerFormState">
          <b-form-checkbox-group v-model="seerForm.selected" :options="seerForm.options" buttons stacked></b-form-checkbox-group>
        </b-form-group>
        <b-button type="submit" variant="primary">{{$t("submit")}}</b-button>
      </b-form>
      <b-form id="robber-form" @submit.prevent="onRobberSubmit" v-show="robberForm.show">
        <b-form-group :invalid-feedback="$t('invalid')"
          :state="robberFormState">
          <b-form-radio-group v-model="robberForm.selected" :options="robberForm.options" buttons stacked></b-form-radio-group>
        </b-form-group>
        <b-button type="submit" variant="primary">{{$t("submit")}}</b-button>
      </b-form>
      <b-form id="trouble-maker-form" @submit.prevent="onTroubleMakerSubmit" v-show="troubleMakerForm.show">
        <b-form-group :invalid-feedback="$t('invalid')"
          :state="troubleMakerFormState">
          <b-form-checkbox-group v-model="troubleMakerForm.selected" :options="troubleMakerForm.options" buttons stacked></b-form-checkbox-group>
        </b-form-group>
        <b-button type="submit" variant="primary">{{$t("submit")}}</b-button>
      </b-form>
      <b-form id="drunk-form" @submit.prevent="onDrunkSubmit" v-show="drunkForm.show">
        <b-form-group :invalid-feedback="$t('invalid')"
          :state="drunkFormState">
          <b-form-radio-group v-model="drunkForm.selected" :options="drunkForm.options" buttons stacked></b-form-radio-group>
        </b-form-group>
        <b-button type="submit" variant="primary">{{$t("submit")}}</b-button>
      </b-form>
      <b-form id="witch-form" @submit.prevent="onWitchSubmit" v-show="witchForm.show">
        <b-form-group :invalid-feedback="$t('invalid')"
          :state="witchFormState">
          <b-form-checkbox-group v-model="witchForm.selected" :options="witchForm.options" buttons stacked></b-form-checkbox-group>
        </b-form-group>
        <b-button type="submit" variant="primary">{{$t("submit")}}</b-button>
      </b-form>

      <b-form id="vote-form" @submit.prevent="onVoteSubmit" v-show="voteForm.show">
        <b-form-group :invalid-feedback="$t('vote')"
          :state="voteFormState">
          <b-form-radio-group v-model="voteForm.selected" :options="voteForm.options" buttons stacked></b-form-radio-group>
        </b-form-group>
        <b-button type="submit" variant="primary">{{$t("submit")}}</b-button>
      </b-form>
      <b-list-group title="投票结果" v-if="this.voteShow">
        <b-list-group-item v-for="(value,index) in this.voteResult" :key="index">
          {{getUserNameByuserID(index)+" "+ $t('role.'+roleList.property[getRoleByuserID(index)].name) +" 投票给 " + getUserNameByuserID(value)}}
        </b-list-group-item>
        <b-list-group-item v-show="this.isOwner" button variant="primary" @click="onNewGame">
          {{$t("next_game")}}
        </b-list-group-item>
      </b-list-group>
    </b-card>
    
    <b-card header="Debug">
      <b-button v-b-toggle.collapse-debug>Debug</b-button>
      <b-collapse id="collapse-debug" class="mt-2">
        <b-card title="RoomPlayerNumber">{{playerNumber}}</b-card>
        <b-card title="totalRoles 需要结算的角色">{{totalRoles}}</b-card>
        <b-card title="registerRsp">{{registerRsp}}</b-card>
        <b-card title="loginRsp">{{loginRsp}}</b-card>
        <b-card title="roomUserInfoList">{{roomUserInfoList}}</b-card>
        <b-card title="roomInfo">{{roomInfo}}</b-card>
        <b-card title="originRoleUserMap">{{originRoleUserMap}}</b-card>
        <b-card title="roleUserMap">{{roleUserMap}}</b-card>
        <b-card title="roleSubmit">{{roleSubmit}}</b-card>
        <b-card title="voteResult">{{voteResult}}</b-card>
      </b-collapse>
    </b-card>
    </b-card-group>
  </b-container>
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
  created(){
    //注册监听刷新和关闭
    window.addEventListener('beforeunload', this.updateHandler);
  },
  destroyed(){
    window.removeEventListener('beforeunload', this.updateHandler);
  },
  mounted() {
    response.initResponse = function(status) {
      if (status == 200) {
        this.$bvToast.toast(this.$t('init')+this.$t('success'), {
          title: 'matchvs',
          autoHideDelay: 1000,
        })
      }
    }.bind(this);
    response.registerUserResponse = function(registerRsp) {
      // 用户ID
      this.registerRsp = registerRsp;
      if (registerRsp.status == 0){
        this.$bvToast.toast(this.$t('register')+this.$t('success'), {
          title: 'matchvs',
          autoHideDelay: 1000,
        })
        engine.login(registerRsp.userID, registerRsp.token, "dev-miao");
      }
    }.bind(this);
    response.loginResponse = function(loginRsp) {
      this.loginRsp = loginRsp;
      if(loginRsp.status == 200){
        this.$bvToast.toast(this.$t('login')+this.$t('success'), {
          title: 'matchvs',
          autoHideDelay: 1000,
        })
        if (this.playerForm.roomSelected == "join") {
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
    }.bind(this);
    response.createRoomResponse = function(response) {
      if (response.status == 200) {
        this.$bvToast.toast(this.$t('create_room')+this.$t('success'), {
          title: 'matchvs',
          autoHideDelay: 1000,
        })

        this.roomInfo.roomID = response.roomID;
        this.roomInfo.owner = response.owner;
        this.roomUserInfoList.push({
          userID: this.registerRsp.userID,
          userProfile: this.playerForm.name
        });
        this.settingForm.show = true;

        //复制房间ID到剪贴板
        const input = document.createElement('input');
        input.setAttribute('readonly', 'readonly');
        input.setAttribute('value', response.roomID);
        document.body.appendChild(input);
        input.select();
        if (document.execCommand('copy')) {
          document.execCommand('copy');
        }
        document.body.removeChild(input);
        this.playerInfo.show = true;
        this.playerForm.show = false;

        this.$bvToast.toast(this.$t('room_copy'), {
          title: '提示',
          autoHideDelay: 5000,
        })
      }
    }.bind(this);
    response.joinRoomResponse = function(status, roomUserInfoList, roomInfo) {
      if(status == 200){
        this.$bvToast.toast(this.$t('join_room')+this.$t('success'), {
          title: 'matchvs',
          autoHideDelay: 1000,
        })

        this.roomUserInfoList = Array.from(roomUserInfoList);
        this.roomUserInfoList.push({
          userID: this.registerRsp.userID,
          userProfile: this.playerForm.name
        });
        this.roomInfo = roomInfo;
        
        //复制房间ID到剪贴板
        const input = document.createElement('input');
        input.setAttribute('readonly', 'readonly');
        input.setAttribute('value', roomInfo.roomID);
        document.body.appendChild(input);
        input.select();
        if (document.execCommand('copy')) {
          document.execCommand('copy');
        }
        document.body.removeChild(input);
        this.playerInfo.show = true;
        this.playerForm.show = false;

        this.$bvToast.toast(this.$t('room_copy'), {
          title: '提示',
          autoHideDelay: 5000,
        })
      }
    }.bind(this);
    response.joinRoomNotify = function(roomUserInfo) {
      this.$bvToast.toast(roomUserInfo.userProfile+this.$t('join_room'), {
        title: 'matchvs',
        autoHideDelay: 1000,
      })
      this.roomUserInfoList.push(roomUserInfo);
    }.bind(this);
    response.joinOverResponse = function(joinOverRsp) {
      if(joinOverRsp.status == 200){
        this.$bvToast.toast(this.$t('join_over')+this.$t('success'), {
          title: 'matchvs',
          autoHideDelay: 1000,
        })
      }
    }.bind(this);
    response.joinOverNotify = function(joinOverNotify) {
      this.$bvToast.toast(joinOverNotify.roomID+this.$t('join_over'), {
        title: 'matchvs',
        autoHideDelay: 1000,
      })
    }.bind(this);
    response.leaveRoomResponse = function(leaveRoomRsp){
      if(leaveRoomRsp.status == 200){
        this.$bvToast.toast(this.$t('leave_room')+this.$t('success'), {
          title: 'matchvs',
          autoHideDelay: 1000,
        })
      }
    };
    response.leaveRoomNotify = function(leaveRoomInfo) {
      let index = this.roomUserInfoList.findIndex(value => {
        value.userID == leaveRoomInfo.userID;
      });
      this.$bvToast.toast(this.roomUserInfoList[index].userProfile+this.$t('leave_room'), {
        title: 'matchvs',
        autoHideDelay: 1000,
      })
      this.roomUserInfoList.splice(index, 1);
    }.bind(this);
    response.sendEventResponse = function(sendEventResponse) {
      if (sendEventResponse.status == 200) {
        let msg = this.sentMsg[sendEventResponse.sequence];
        delete this.sentMsg[sendEventResponse.sequence];
        this.receiveMsg(msg);
      }
    }.bind(this);
    response.sendEventNotify = function(sendEventNotify) {
      let msg = JSON.parse(sendEventNotify.cpProto,(k,v)=>{
        if(k === "Role") return Number(v);
        return v;
      });
      this.receiveMsg(msg);
    }.bind(this);

    //初始化roleOptions
    for (let role in RoleList) {
      if(role == "property") continue;
      this.settingForm.roleOptions.push({
        text: this.$t("role." + RoleList.property[RoleList[role]].name),
        value: RoleList[role]
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
        name: randomNum(100,999).toString(),
        roomOptions: this.$t("rooms"),
        roomSelected: "join",
        roomID: ""
      },
      playerInfo:{
        show: false
      },
      settingForm: {
        show: false,
        roleOptions: [],
        roleSelected: []
      },
      registerRsp: null,
      loginRsp: null,
      joinOverRsp: null,
      joinOverNotify: null,
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
        selected: ""
      },
      totalRoles: [],
      waitRoles: [],
      roleSubmit: {},
      voteResult: {},
      voteShow: false,
    };
  },
  computed: {
    playerNumber() {
      return this.roomUserInfoList.length;
    },
    orderRoomUserInfoList(){
      let list = Array.from(this.roomUserInfoList);
      list.sort((a,b) =>{
        a.userID<b.userID;
      })
      return list;
    },
    isOwner() {
      if(this.registerRsp != null) return this.roomInfo.owner == this.registerRsp.userID;
      return false;
    },
    settingFormState(){
      if(this.settingForm.roleSelected.length == (this.playerNumber+3)) return true;
      return false;
    },
    wolfFormState(){
      if(this.wolfForm.selected) return true;
      return false;
    },
    seerFormState(){
      if(this.seerForm.selected.length == 2 && !this.isPlayer(this.seerForm.selected[0]) && !this.isPlayer(this.seerForm.selected[1])){
        return true;
      }
      else if(this.seerForm.selected.length == 1 && this.isPlayer(this.seerForm.selected[0])){
        return true;
      }
      return false;
    },
    robberFormState(){
      return true;
    },
    witchFormState(){
      if(this.witchForm.selected.length == 0) return true;
      let isPlayer0 = this.isPlayer(this.witchForm.selected[0]);
      let isPlayer1 = this.isPlayer(this.witchForm.selected[1]);
      if(this.witchForm.selected.length == 2 && 
        ((isPlayer0 && !isPlayer1) || (isPlayer1 && !isPlayer0))) return true;
      return false;
    },
    troubleMakerFormState(){
      if(this.troubleMakerForm.selected.length == 0) return true;
      if(this.troubleMakerForm.selected.length == 2 && this.isPlayer(this.troubleMakerForm.selected[0]) && this.isPlayer(this.troubleMakerForm.selected[1])) return true;
      return false
    },
    drunkFormState(){
      if(this.drunkForm.selected) return true;
      return false;
    },
    voteFormState(){
      if(this.voteForm.selected) return true;
      return false;
    }
  },
  methods: {
    onSubmit() {
      //如果已经登录
      if(this.loginRsp){
        if (this.playerForm.roomSelected == "join") {
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
      //如果已经注册
      else if(this.registerRsp){
        engine.login(this.registerRsp.userID, this.registerRsp.token, "dev-miao");
      }
      //没注册
      else {
        engine.registerUser();
      }
    },
    sendMsg(msg) {
      let sent = engine.sendEvent(JSON.stringify(msg));
      this.sentMsg[sent.sequence] = msg;
    },
    receiveMsg(msg) {
      if (msg.event == GameEvent.GameStart) {
        this.onMvGameStart(msg.roleUserMap);
      }
      //角色提交
      else if (msg.event == GameEvent.RoleSubmit) {
        //保存结果
        this.roleSubmit[msg.role] = msg.selected;
        //等待列表中剔除角色
        let i = this.waitRoles.indexOf(msg.role);
        this.waitRoles.splice(i, 1);
        this.checkWaitRoles();
      }
      //角色结果
      else if (msg.event == GameEvent.RoleResult) {
        if(msg.roles.indexOf(this.playerRole)>=0) this.playerPanel.text = msg.result;
      }
      //开始讨论
      else if (msg.event == GameEvent.DiscussStart){
        this.startDiscuss();
      }
      //投票提交
      else if (msg.event == GameEvent.VoteSubmit) {
        this.voteResult[msg.role] = msg.selected;
        this.roleVoted(msg.role);
      }
      //投票结果
      else if (msg.event == GameEvent.VoteResult){
        this.voteResult = msg.result;
        this.roleUserMap = msg.roleUserMap;
        this.showVoteResult();
      }
      //新游戏
      else if (msg.event == GameEvent.New){
        this.originRoleUserMap = {};
        this.roleUserMap = {};
        this.sentMsg = {};
        this.playerRole = "";
        this.playerPanel.show = false;
        this.playerPanel.text = "";
        this.wolfForm.options = [];
        this.wolfForm.selected = "";
        this.seerForm.options = [];
        this.seerForm.selected = [];
        this.robberForm.options = [];
        this.robberForm.selected = "";
        this.troubleMakerForm.options = [];
        this.troubleMakerForm.selected = [];
        this.drunkForm.options = [];
        this.drunkForm.selected = "";
        this.witchForm.options = [];
        this.witchForm.selected = [];
        this.voteForm.options = [];
        this.voteForm.selected = "";
        this.totalRoles = [];
        this.waitRoles = [];
        this.roleSubmit = {};
        this.voteResult = {};
        this.voteShow = false;
      }
    },
    //角色投票
    roleVoted(role){
      //等待列表中剔除角色
      let i = this.waitRoles.findIndex(value => {
        return value == role;
      });
      this.waitRoles.splice(i, 1);
      //等待列表为空，进行投票结算，通知投票结果
      if (this.waitRoles.length == 0 && this.isOwner) {
        this.sendMsg({
          event: GameEvent.VoteResult,
          result: this.voteResult,
          roleUserMap: this.roleUserMap,
        })
      }
    },
    //检查是否需要等待
    checkWaitRoles() {
      //等待列表为空，进行结算，进入讨论阶段 房主结算提交结果
      if (this.waitRoles.length == 0 && this.isOwner) {
        for (let role of this.totalRoles) {
          // 狼
          if (role == RoleList.WereWolf || role == RoleList.WereWolf2){
            let selected = this.roleSubmit[role];
            //没有狼提交
            if(selected == undefined) continue;
            let msg = {
              event: GameEvent.RoleResult,
              roles: [RoleList.WereWolf,RoleList.WereWolf2],
              result: "这张牌是："+this.$t("role."+RoleList.property[this.getRoleByuserID(selected)].name)
            }
            this.sendMsg(msg);
          }
          // 预言家
          else if (role == RoleList.Seer) {
            let msg = {
              event: GameEvent.RoleResult,
              roles: [RoleList.Seer],
              result: ""
            };
            for (let userID of this.roleSubmit[role]) {
              let selected = this.getRoleByuserID(userID);
              msg.result += this.getUserNameByuserID(userID) + " 的身份：" + this.$t("role."+RoleList.property[selected].name) + "\n";
            }
            this.sendMsg(msg);
          } 
          // 强盗
          else if (role == RoleList.Robber) {
            let robberID = this.originRoleUserMap[role].userID;
            this.exchangeRole(this.roleSubmit[role],robberID);
            let msg = {
              event: GameEvent.RoleResult,
              roles: [RoleList.Robber],
              result: "你与 "+this.getUserNameByuserID(this.roleSubmit[role]) +" "+ this.$t('role.'+RoleList.property[this.getRoleByuserID(robberID)].name) +" 交换了身份"
            };
            this.sendMsg(msg);
          }
          // 捣蛋鬼
          else if(role == RoleList.TroubleMaker){
            this.exchangeRole(this.roleSubmit[role][0],this.roleSubmit[role][1]);
            let msg = {
              event: GameEvent.RoleResult,
              roles: [RoleList.TroubleMaker],
              result: "你交换了 "+this.getUserNameByuserID(this.roleSubmit[role][0])+" 和 "+this.getUserNameByuserID(this.roleSubmit[role][1])+" 的身份",
            }
            this.sendMsg(msg);
          }
          // 酒鬼
          else if(role == RoleList.Drunk){
            this.exchangeRole(this.roleSubmit[role],this.originRoleUserMap[role].userID);
            let msg = {
              event: GameEvent.RoleResult,
              roles: [RoleList.Drunk],
              result:"你与 "+this.getUserNameByuserID(this.roleSubmit[role])+" 交换了身份"
            };
            this.sendMsg(msg);
          }
          // 失眠者
          else if(role == RoleList.Insomanic){
            let msg = {
              event: GameEvent.RoleResult,
              roles: [RoleList.Insomanic],
              result: "你现在的身份是："+ this.$t("role."+RoleList.property[this.getRoleByuserID(this.originRoleUserMap[role].userID)].name)
            }
            this.sendMsg(msg);
          }
          // 女巫
          else if(role == RoleList.Witch){
            let noPlayerIndex = this.isPlayer(this.roleSubmit[role][0]) ? 1 : 0;
            let noPlayerRole = this.getRoleByuserID(this.roleSubmit[role][noPlayerIndex]);
            this.exchangeRole(this.roleSubmit[role][0],this.roleSubmit[role][1]);
            let msg = {
              event: GameEvent.RoleResult,
              roles: [RoleList.Witch],
              result: "你将非玩家身份 "+ this.$t('role.'+RoleList.property[noPlayerRole].name) +" 给了 "+this.getUserNameByuserID(this.roleSubmit[role][noPlayerIndex==0?1:0]),
            }
            this.sendMsg(msg);
          }
        }
        let msg = { event: GameEvent.DiscussStart };
        this.sendMsg(msg);
      }
    },
    //房主点击开始按钮
    onStartGame() {
      if(!this.settingFormState) return;
      engine.joinOver("Start Game!");
      this.createRoleUserMap();
      let msg = {
        event: GameEvent.GameStart,
        roleUserMap: this.roleUserMap
      };
      this.sendMsg(msg);

      //计算结算顺序
      let roleSelected = Array.from(this.settingForm.roleSelected);
      //过滤掉非玩家角色
      roleSelected = roleSelected.filter(role=>{
        if(!this.isPlayer(this.roleUserMap[role].userID)) return false;
        return true;
      });
      //按结算顺序排序
      roleSelected.sort((a, b) => {
        return RoleList.property[a].order - RoleList.property[b].order;
      });
      //创建局内需要结算的角色列表
      this.totalRoles = Array.from(roleSelected);

      //计算需要提交的角色
      this.waitRoles = roleSelected.filter(role => {
        //单狼需要提交
        if (role == RoleList.WereWolf || role == RoleList.WereWolf2) {
          let wolfRoles = this.getWolfRoles();
          if (wolfRoles.length == 1 && role == wolfRoles[0]) return true;
          return false;
        }
        //爪牙、失眠者不需要提交
        else if (
          RoleList.property[role].order > 0 &&
          role != RoleList.Minion &&
          role != RoleList.Insomanic
        ) {
          return true;
        } else {
          return false;
        }
      });
      //没有需要等待的角色
      if(this.waitRoles.length == 0){
        setTimeout(() => {
          this.checkWaitRoles();
        }, 2000);
      }
    },
    // 游戏开始事件
    onMvGameStart(roleUserMap) {
      this.settingForm.show = false;
      this.roleUserMap = roleUserMap;
      this.originRoleUserMap = JSON.parse(JSON.stringify(roleUserMap));
      for (let role in roleUserMap) {
        //当前玩家的角色
        if (this.registerRsp.userID == roleUserMap[role].userID) {
          this.playerRole = Number(role);
        }
      }
      this.playerPanel.show = true;

      //玩家是村民
      if (
        this.playerRole == RoleList.Villager ||
        this.playerRole == RoleList.Villager2 ||
        this.playerRole == RoleList.Villager3
      ) {
        this.playerPanel.text = "等待黎明到来";
      } 
      // 玩家是狼
      else if (
        this.playerRole == RoleList.WereWolf || this.playerRole == RoleList.WereWolf2
      ) {
        let wolfRoles = this.getWolfRoles();
        // 场上只有一狼
        if (wolfRoles.length == 1) {
          this.playerPanel.text = "你没有队友，查看一张非玩家牌";
          for (let roleUser in roleUserMap) {
            if (this.isPlayer(roleUserMap[roleUser].userID)) continue;
            this.wolfForm.options.push({
              text: roleUserMap[roleUser].userProfile,
              value: roleUserMap[roleUser].userID
            });
          }
          this.wolfForm.show = true;
        }
        // 多狼
        else {
          this.playerPanel.text = "狼玩家：";
          for (let role of wolfRoles) {
            this.playerPanel.text += this.roleUserMap[role].userProfile + " ";
          }
          this.playerPanel.text.trimRight();
        }
      // 爪牙
      } else if (this.playerRole == RoleList.Minion) {
        let wolfRoles = this.getWolfRoles();
        if(wolfRoles.length == 0){
          this.playerPanel.text = "场上没有狼人";
        }
        else{
          this.playerPanel.text = "狼队：";
          for (let role of wolfRoles) {
            this.playerPanel.text += this.roleUserMap[role].userProfile + " ";
          }
          this.playerPanel.text.trimRight();
        }
      }
      // 玩家是预言家
      else if (this.playerRole == RoleList.Seer) {
        this.playerPanel.text = "夜晚行动";
        for (let roleUser in roleUserMap) {
          this.seerForm.options.push({
            text: roleUserMap[roleUser].userProfile,
            value: roleUserMap[roleUser].userID
          });
        }
        this.seerForm.show = true;
      }
      // 玩家是强盗
      else if (this.playerRole == RoleList.Robber) {
        this.playerPanel.text = "夜晚行动";
        for (let roleUser in roleUserMap) {
          if (
            roleUserMap[roleUser].userID == this.registerRsp.userID ||
            !this.isPlayer(roleUserMap[roleUser].userID)
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
      else if(this.playerRole == RoleList.TroubleMaker){
        this.playerPanel.text = "夜晚行动";
        for (let roleUser in roleUserMap) {
          if (
            roleUserMap[roleUser].userID == this.registerRsp.userID ||
            !this.isPlayer(roleUserMap[roleUser].userID)
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
      else if(this.playerRole == RoleList.Drunk){
        this.playerPanel.text = "夜晚行动";
        for (let roleUser in roleUserMap) {
          if (
            roleUserMap[roleUser].userID == this.registerRsp.userID ||
            this.isPlayer(roleUserMap[roleUser].userID)
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
      else if(this.playerRole == RoleList.Witch){
        this.playerPanel.text = "夜晚行动";
        for (let roleUser in roleUserMap) {
          if (roleUserMap[roleUser].userID == this.registerRsp.userID) continue;
          this.witchForm.options.push({
            text: roleUserMap[roleUser].userProfile,
            value: roleUserMap[roleUser].userID
          });
        }
        this.witchForm.show = true;
      }
    },
    startDiscuss() {
      for (let userInfo of this.roomUserInfoList) {
        this.voteForm.options.push({
          text: userInfo.userProfile,
          value: userInfo.userID
        });
      }
      this.voteForm.show = true;
      // 创建等待角色列表
      this.waitRoles = [];
      for(let role in this.roleUserMap){
        if(this.isPlayer(this.roleUserMap[role].userID)) this.waitRoles.push(role);
      }
    },
    showVoteResult(){
      this.voteShow = true;
    },
    onNewGame(){
      this.settingForm.show = true;
      this.sendMsg({event: GameEvent.New});
    },
    onWolfSubmit(){
      if(!this.wolfFormState) return;
      let msg = {
        event: GameEvent.RoleSubmit,
        selected: this.wolfForm.selected,
        role: this.playerRole,
      };
      this.sendMsg(msg);
      this.wolfForm.show = false;
    },
    onSeerSubmit() {
      if(!this.seerFormState) return;
      let msg = {
        event: GameEvent.RoleSubmit,
        selected: this.seerForm.selected,
        role: this.playerRole,
      };
      this.sendMsg(msg);
      this.seerForm.show = false;
    },
    onRobberSubmit() {
      if(!this.robberFormState) return;
      let msg = {
        event: GameEvent.RoleSubmit,
        selected: this.robberForm.selected,
        role: this.playerRole,
      };
      this.sendMsg(msg);
      this.robberForm.show = false;
    },
    onTroubleMakerSubmit() {
      if(!this.troubleMakerFormState) return;
      let msg = {
        event: GameEvent.RoleSubmit,
        selected: this.troubleMakerForm.selected,
        role: this.playerRole,
      };
      this.sendMsg(msg);
      this.troubleMakerForm.show = false;
    },
    onDrunkSubmit(){
      if(!this.drunkFormState) return;
      let msg = {
        event: GameEvent.RoleSubmit,
        selected: this.drunkForm.selected,
        role: this.playerRole,
      };
      this.sendMsg(msg);
      this.drunkForm.show = false;
    },
    onWitchSubmit(){
      if(!this.witchFormState) return;
      let msg = {
        event: GameEvent.RoleSubmit,
        selected: this.witchForm.selected,
        role: this.playerRole,
      };
      this.sendMsg(msg);
      this.witchForm.show = false;
    },
    onVoteSubmit() {
      if(!this.voteFormState) return;
      let msg = {
        event: GameEvent.VoteSubmit,
        selected: this.voteForm.selected,
        role: this.registerRsp.userID,
      };
      this.sendMsg(msg);
      this.voteForm.show = false;
    },
    //创建角色玩家映射
    createRoleUserMap() {
      let userInfoList = Array.from(this.roomUserInfoList);
      let roles = Array.from(this.settingForm.roleSelected);
      this.roleUserMap = {};
      // 玩家比角色数量少，先遍历玩家，再遍历剩下的角色
      for(let userInfo of userInfoList){
        let i = randomNum(0, roles.length);
        let role = roles[i];
        this.roleUserMap[role] = {userID: userInfo.userID,userProfile: userInfo.userProfile};
        roles.splice(i,1);
      }
      for(let role of roles){
        this.roleUserMap[role] = {
          userID: "no-player-" + role,
          userProfile: this.$t('no_player')
        };
      }
    },
    getRoleByuserID(userID) {
      for (let role in this.roleUserMap) {
        if (userID == this.roleUserMap[role].userID) {
          return role;
        }
      }
    },
    getUserNameByuserID(userID) {
      for (let userInfo of this.roomUserInfoList) {
        if (userID == userInfo.userID) {
          return userInfo.userProfile;
        }
      }
      return this.$t('no_player');
    },
    exchangeRole(userID, userID2) {
      let role = this.getRoleByuserID(userID);
      let role2 = this.getRoleByuserID(userID2);
      [this.roleUserMap[role],this.roleUserMap[role2]] = [this.roleUserMap[role2],this.roleUserMap[role]];
    },
    // 玩家控制的狼角色列表
    getWolfRoles() {
      let roles = [];
      for (let role in this.roleUserMap) {
        if ((role == RoleList.WereWolf || role == RoleList.WereWolf2) && this.isPlayer(this.roleUserMap[role].userID)) {
          roles.push(role);
        }
      }
      return roles;
    },
    isPlayer(userID){
      if(userID) return userID.toString().indexOf("no-player") < 0;
    },
    // 刷新或关闭页面时
    updateHandler(){
      engine.leaveRoom("走了");
    }
  }
};
</script>