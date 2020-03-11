<template>
  <b-container>
    <b-card-group columns>
      <transition name="slide-fade">
        <b-card v-show="playerForm.show">
          <template v-slot:header>
            <h3 class="mb-0">开始游戏</h3>
          </template>
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
      </transition>
      <transition name="slide-fade">
        <b-card v-show="playerInfo.show">
          <template v-slot:header>
            <h3 class="mb-0">房间信息</h3>
          </template>
          <b-card-text>
            {{$t('your_name')+":"+playerForm.name}}
            <br>
            {{$t('room_id')+":"+roomInfo.roomID}}
          </b-card-text>
          <b-card-text>
            <h6>玩家列表</h6>
            <b-button-group vertical>
              <b-button v-for="(value,index) in this.orderRoomUserInfoList" :key="index">
                {{(index+1) +"号玩家 " + value.userProfile + (value.offline ? "已离开" : "")}}
              </b-button>
            </b-button-group>
          </b-card-text>
        </b-card>
      </transition>

    <transition name="slide-fade">
      <b-card v-show="settingForm.show">
        <template v-slot:header>
          <h3 class="mb-0">游戏设定</h3>
        </template>
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
    </transition>
    
    <transition name="slide-fade">
      <b-card v-show="playerPanel.show">
        <template v-slot:header>
          <h3 class="mb-0">本局游戏身份</h3>
          <h4>夜晚行动的角色顺序与此相同</h4>
        </template>
        
        <b-card-text>
          <b-button-group vertical>
            <b-button v-for="(value,index) in this.roleUserMap" :key="index" v-b-tooltip.hover :title="$t('role_des.'+roleList.property[index].name)">
              {{$t('role.'+roleList.property[index].name)}}
            </b-button>
          </b-button-group>
        </b-card-text>
        <b-card-text>
          {{$t("your_role")}}<strong>{{$t('role.'+roleList.property[playerRole].name)}}</strong>
        </b-card-text>
        <b-card-text>{{$t('role_des.'+roleList.property[playerRole].name)}}</b-card-text>
      </b-card>
    </transition>


    <transition name="slide-fade">
      <b-card v-show="playerPanel.show">
        <template v-slot:header>
          <h3 class="mb-0">操作</h3>
        </template>
        <b-card-text style="white-space: pre;">{{playerPanel.text}}</b-card-text>
        
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
            <b-form-checkbox-group v-model="robberForm.selected" :options="robberForm.options" buttons stacked></b-form-checkbox-group>
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
      </b-card>
    </transition>


    <transition name="slide-fade">
      <b-card v-show="voteForm.show">
        <template v-slot:header>
          <h3 class="mb-0">{{$t('vote')}}</h3>
        </template>
        <b-form id="vote-form" @submit.prevent="onVoteSubmit" v-show="voteForm.show">
          <b-form-group :invalid-feedback="$t('vote_invalid')"
            :state="voteFormState">
            <b-form-radio-group v-model="voteForm.selected" :options="voteForm.options" buttons stacked></b-form-radio-group>
          </b-form-group>
          <b-button type="submit" variant="primary">{{$t("submit")}}</b-button>
        </b-form>
      </b-card>
    </transition>


    <transition name="slide-fade">
      <b-card v-show="this.voteShow" no-body>
        <template v-slot:header v-show="this.voteShow">
          <h3 class="mb-0">投票结果</h3>
        </template>
        <b-list-group flush>
          <b-list-group-item v-for="(value,index) in this.voteResult" :key="index">
            {{getUserNameByuserID(index)+" "+ $t('role.'+roleList.property[getRoleByuserID(index)].name) +" 投票给 " + getUserNameByuserID(value)}}
          </b-list-group-item>
          <b-list-group-item>
            {{"获得胜利的是：" + getWinner()}}
          </b-list-group-item>
          <b-list-group-item v-show="this.isOwner" button variant="primary" @click="onNewGame">
            {{$t("next_game")}}
          </b-list-group-item>
        </b-list-group>
      </b-card>
    </transition>

    <transition name="slide-fade">
      <b-card v-show="this.reconnectShow">
        <template v-slot:header v-show="this.voteShow">
          <h3 class="mb-0">与服务器断开链接</h3>
        </template>
        <b-button @click="onReconnect" variant="danger">重连</b-button>
      </b-card>
    </transition>

    <transition name="slide-fade">
      <b-card header="Debug" :style="debugStyle">
        <b-button v-b-toggle.collapse-debug>Debug</b-button>
        <b-collapse id="collapse-debug" class="mt-2">
          <b-card title="totalRoles">{{totalRoles}}</b-card>
          <b-card title="waitRoles">{{waitRoles}}</b-card>
          <b-card title="waitUsers">{{waitUsers}}</b-card>
          <b-card title="voteResult">{{voteResult}}</b-card>
          <b-card title="orderRoomUserInfoList">{{orderRoomUserInfoList}}</b-card>
          <b-card title="roomUserInfoList">{{roomUserInfoList}}</b-card>
          <b-card title="roomInfo">{{roomInfo}}</b-card>
          <b-card title="originRoleUserMap">{{originRoleUserMap}}</b-card>
          <b-card title="roleUserMap">{{roleUserMap}}</b-card>
          <b-card title="roleSubmit">{{roleSubmit}}</b-card>
        </b-collapse>
      </b-card>
    </transition>
    </b-card-group>
  </b-container>
</template>
<style lang="scss" scoped>
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all 1s ease;
}
.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(100vw);
  opacity: 0;
}
</style>
<script>
import * as NoSleep from 'nosleep.js/dist/NoSleep';
const noSleep = new NoSleep();
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
          autoHideDelay: 2000,
        })
      }
    }.bind(this);
    response.registerUserResponse = function(registerRsp) {
      // 用户ID
      this.registerRsp = registerRsp;
      if (registerRsp.status == 0){
        this.$bvToast.toast(this.$t('register')+this.$t('success'), {
          title: 'matchvs',
          autoHideDelay: 2000,
        })
        engine.login(registerRsp.userID, registerRsp.token, "dev-miao");
      }
    }.bind(this);
    response.loginResponse = function(loginRsp) {
      this.loginRsp = loginRsp;
      if(loginRsp.status == 200){
        engine.setReconnectTimeout(-1) //房间重连超时
        engine.setTeamReconnectTimeout(-1) //组队重连超时
        this.$bvToast.toast(this.$t('login')+this.$t('success'), {
          title: 'matchvs',
          autoHideDelay: 2000,
        });
        //如果有房间ID则重新连接
        if(loginRsp.roomID != 0){
          engine.reconnect();
          this.$bvToast.toast("重新连接房间", {
            title: 'matchvs',
            autoHideDelay: 2000,
          });
        }
        else if (this.playerForm.roomSelected == "join") {
          engine.joinRoom(this.playerForm.roomID, this.playerForm.name);
        } 
        else {
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
          autoHideDelay: 2000,
        })

        this.roomInfo.roomID = response.roomID;
        this.roomInfo.owner = response.owner;
        this.roomUserInfoList.push({
          userID: this.registerRsp.userID,
          userProfile: this.playerForm.name
        });
        this.settingForm.show = true;
        this.playerInfo.show = true;
        this.playerForm.show = false;

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

        this.$bvToast.toast(this.$t('room_copy'), {
          title: this.$t('prompt'),
          autoHideDelay: 5000,
        })
      }
    }.bind(this);
    response.joinRoomResponse = function(status, roomUserInfoList, roomInfo) {
      if(status == 200){
        this.$bvToast.toast(this.$t('join_room')+this.$t('success'), {
          title: 'matchvs',
          autoHideDelay: 2000,
        })

        this.roomUserInfoList = Array.from(roomUserInfoList);
        this.roomUserInfoList.push({
          userID: this.registerRsp.userID,
          userProfile: this.playerForm.name,
        });
        this.roomInfo = roomInfo;
        this.playerInfo.show = true;
        this.playerForm.show = false;

        //加入房间通知（SDK有问题，不发通知）
        // this.sendJoinRoomNotify();
      }
    }.bind(this);
    response.joinRoomNotify = function(roomUserInfo) {
      this.receiveJoinRoomNotify(roomUserInfo);
    }.bind(this);
    response.joinOverResponse = function(joinOverRsp) {
      if(joinOverRsp.status == 200){
        this.$bvToast.toast(this.$t('join_over'), {
          title: 'matchvs',
          autoHideDelay: 2000,
        })
        this.joinOver = true;
      }
      
      //结束加入房间通知（SDK有问题，不发通知）
      // this.sendJoinOverNotify();
    }.bind(this);
    response.joinOverNotify = function(joinOverInfo) {
      this.receiveJoinOverNotify(joinOverInfo);
    }.bind(this);
    response.joinOpenResponse = function(joinOpenRsp) {
      if(joinOpenRsp.status == 200){
        this.$bvToast.toast(this.$t('join_open'), {
          title: 'matchvs',
          autoHideDelay: 2000,
        })
      }
    }.bind(this);
    response.joinOpenNotify = function(joinOpenInfo){
      this.$bvToast.toast(this.$t('join_open')+joinOpenInfo.roomID, {
        title: 'matchvs',
        autoHideDelay: 2000,
      })
    }.bind(this);

    response.leaveRoomResponse = function(leaveRoomRsp){
      if(leaveRoomRsp.status == 200){
        this.$bvToast.toast(this.$t('leave_room')+this.$t('success'), {
          title: 'matchvs',
          autoHideDelay: 2000,
        })
      }
    }.bind(this);
    response.leaveRoomNotify = function(leaveRoomInfo) {
      this.onPlayerLeaveRoom(leaveRoomInfo.userID, leaveRoomInfo.owner);
    }.bind(this);

    response.errorResponse = function(errCode,errMsg){
      this.$bvToast.toast(errCode+" "+errMsg, {
        title: 'matchvs',
        autoHideDelay: 5000,
      })
      //网络错误，提示重连
      if(errCode == 1001){
        this.reconnectShow = true;
      }
      //其他错误码无法处理
    }.bind(this);

    response.reconnectResponse = function(status,roomUserInfoList,roomInfo){
      let text;
      switch(status){
        case 200:
          text = "重连成功"
          this.roomUserInfoList = roomUserInfoList;
          this.roomInfo = roomInfo;
          // TODO 进入游戏中
          break;
        case 201:
          text = "重连房间失败，但已登录";
          
          break;
        default:
          text = "未知";
      }
      this.$bvToast.toast(text, {
        title: 'matchvs',
        autoHideDelay: 5000,
      });
    }.bind(this);

    response.networkStateNotify = function(networkStateInfo){
      /**
       * @param {string} roomID 房间号
       * @param {number} userID 用户ID
       * @param {number} state  1-网络异常，正在重连  2-重连成功 3-重连失败，退出房间
       * @param {number} owner  当前房间房主ID
       */
      let text;
      switch(networkStateInfo.state){
        case 1:
          text = "网络异常，正在重连";
          break;
        case 2:
          text = "重连成功";
          break;
        case 3:
          text = "重连失败，退出房间";
          break;
        default:
          text = "未知";
      }
      this.$bvToast.toast(this.getUserNameByuserID(networkStateInfo.userID)+" 状态："+networkStateInfo.state+" 内容："+text, {
        title: 'matchvs',
        autoHideDelay: 5000,
      });
      if(networkStateInfo.state > 2) this.onPlayerLeaveRoom(networkStateInfo.userID,networkStateInfo.owner);
    }.bind(this);

    //发送消息Response
    response.sendEventResponse = function(sendEventResponse) {
      if (sendEventResponse.status == 200) {
        let msg = this.sentMsg[sendEventResponse.sequence];
        delete this.sentMsg[sendEventResponse.sequence];
        this.receiveMsg(msg);
      }
    }.bind(this);

    //发送消息Notify
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
        name: process.env.NODE_ENV == "production" ? "" : randomNum(100,999).toString(),
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
      joinOver: false,
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
      playerRole: 1,
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
        selected: []
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
      waitUsers: [],
      roleSubmit: {},
      voteResult: {},
      voteShow: false,
      reconnectShow: false,
    };
  },
  computed: {
    debugStyle(){
      let display = process.env.NODE_ENV == 'production' ? 'none' : 'block';
      return {display : display};
    },
    playerNumber() {
      return this.roomUserInfoList.length;
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
      if(this.robberForm.selected.length == 0 || this.robberForm.selected.length == 1) return true;
      return false;
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
    },
    orderRoomUserInfoList(){
      let array = Array.from(this.roomUserInfoList)
      array.sort((a,b)=>a.userID-b.userID);
      return array;
    }
  },
  methods: {
    onReconnect(){
      //进行重连
      engine.reconnect();
    },
    onSubmit() {
      noSleep.enable();
      //如果已经登录
      if(this.loginRsp){
        if (this.playerForm.roomSelected == "join") {
          let res = engine.joinRoom(this.playerForm.roomID, this.playerForm.name);
          let text;
          switch(res){
            case 0:
              text="发起登录请求";
              break
            case -1:
              text="失败";
              break
            case -2:
              text="未初始化";
              break
            case -3:
              text="正在初始化";
              break
            case -4:
              text="未登录";
              break
            case -7:
              text="正在创建或者进入房间";
              break
            case -8:
              text="已经在房间中";
              break
            case -21:
              text="已经在房间中";
              break
            default:
              text="未知"
          }
          this.$bvToast.toast(text, {
            title: this.$t('prompt'),
            autoHideDelay: 2000,
          });
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
        this.$bvToast.toast(this.$t('start_game'), {
          title: this.$t('prompt'),
          autoHideDelay: 2000,
        })
      }
      //角色提交
      else if (msg.event == GameEvent.RoleSubmit) {
        //保存结果
        this.roleSubmit[msg.role] = msg.selected;
        //等待列表中剔除角色
        let i = this.waitRoles.indexOf(msg.role);
        this.waitRoles.splice(i, 1);
        this.checkWaitRoles();

        //自己显示通知
        if(msg.role == this.playerRole){
          this.$bvToast.toast(this.$t('submit')+this.$t('success'), {
            title: this.$t('prompt'),
            autoHideDelay: 2000,
          })
        }

      }
      //角色结果
      else if (msg.event == GameEvent.RoleResult) {
        if(msg.roles.indexOf(this.playerRole)>=0) {
          this.playerPanel.text = msg.result;
          this.$bvToast.toast(this.$t('role_result'), {
            title: this.$t('prompt'),
            autoHideDelay: 2000,
          })
        }
      }
      //开始讨论
      else if (msg.event == GameEvent.DiscussStart){
        this.startDiscuss(msg);
        this.$bvToast.toast(this.$t('start_discuss'), {
          title: this.$t('prompt'),
          autoHideDelay: 2000,
        })
      }
      //投票提交
      else if (msg.event == GameEvent.VoteSubmit) {
        //处理投票结果
        if(msg.selected) this.voteResult[msg.userID] = msg.selected;
        this.roleVoted(msg.userID);
        //所有玩家显示通知
        this.$bvToast.toast(this.getUserNameByuserID(msg.userID)+this.$t('vote')+this.$t('success'), {
          title: this.$t('prompt'),
          autoHideDelay: 2000,
        })
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
        this.playerRole = 1;
        this.playerPanel.show = false;
        this.playerPanel.text = "";
        this.wolfForm.options = [];
        this.wolfForm.selected = "";
        this.seerForm.options = [];
        this.seerForm.selected = [];
        this.robberForm.options = [];
        this.robberForm.selected = [];
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
        this.waitUsers = [];
        this.roleSubmit = {};
        this.voteResult = {};
        this.voteShow = false;
      }
      else if(msg.event == GameEvent.JoinRoomNotify){
        this.receiveJoinRoomNotify(msg.roomUserInfo);
      }
      else if(msg.event == GameEvent.JoinOverNotify){
        this.receiveJoinOverNotify(msg.joinOverInfo);
      }
    },
    //角色投票
    roleVoted(userID){
      //等待列表中剔除角色
      let i = this.waitUsers.indexOf(userID);
      this.waitUsers.splice(i, 1);
      //等待列表为空，进行投票结算，通知投票结果
      if (this.waitUsers.length == 0 && this.isOwner) {
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
              result: "这张牌是："+this.$t("role."+RoleList.property[this.getRoleByuserID(selected)].name)+"\n"
            }
            this.sendMsg(msg);
          }
          // 预言家
          else if (role == RoleList.Seer) {
            if(this.roleSubmit[role].length == 0) continue;
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
            //不换身份
            if(this.roleSubmit[role].length == 0) continue;
            //换身份
            let robberID = this.originRoleUserMap[role].userID;
            this.exchangeRole(this.roleSubmit[role],robberID);
            let msg = {
              event: GameEvent.RoleResult,
              roles: [RoleList.Robber],
              result: "你与 "+this.getUserNameByuserID(this.roleSubmit[role]) +" "+ this.$t('role.'+RoleList.property[this.getRoleByuserID(robberID)].name) +" 交换了身份\n"
            };
            this.sendMsg(msg);
          }
          // 捣蛋鬼
          else if(role == RoleList.TroubleMaker){
            //不换身份
            if(this.roleSubmit[role].length == 0) continue;
            //换身份
            this.exchangeRole(this.roleSubmit[role][0],this.roleSubmit[role][1]);
            let msg = {
              event: GameEvent.RoleResult,
              roles: [RoleList.TroubleMaker],
              result: "你交换了 "+this.getUserNameByuserID(this.roleSubmit[role][0])+" 和 "+this.getUserNameByuserID(this.roleSubmit[role][1])+" 的身份\n",
            }
            this.sendMsg(msg);
          }
          // 酒鬼
          else if(role == RoleList.Drunk){
            if(this.roleSubmit[role] == undefined) continue;
            this.exchangeRole(this.roleSubmit[role],this.originRoleUserMap[role].userID);
            let msg = {
              event: GameEvent.RoleResult,
              roles: [RoleList.Drunk],
              result:"你与 "+this.getUserNameByuserID(this.roleSubmit[role])+" 交换了身份\n"
            };
            this.sendMsg(msg);
          }
          // 失眠者
          else if(role == RoleList.Insomanic){
            let msg = {
              event: GameEvent.RoleResult,
              roles: [RoleList.Insomanic],
              result: "你现在的身份是："+ this.$t("role."+RoleList.property[this.getRoleByuserID(this.originRoleUserMap[role].userID)].name)+"\n"
            }
            this.sendMsg(msg);
          }
          // 女巫
          else if(role == RoleList.Witch){
            //不换身份
            if(this.roleSubmit[role].length == 0) continue;
            //换身份
            let noPlayerIndex = this.isPlayer(this.roleSubmit[role][0]) ? 1 : 0;
            let noPlayerRole = this.getRoleByuserID(this.roleSubmit[role][noPlayerIndex]);
            this.exchangeRole(this.roleSubmit[role][0],this.roleSubmit[role][1]);
            let msg = {
              event: GameEvent.RoleResult,
              roles: [RoleList.Witch],
              result: "你将非玩家身份 "+ this.$t('role.'+RoleList.property[noPlayerRole].name) +" 给了 "+this.getUserNameByuserID(this.roleSubmit[role][noPlayerIndex==0?1:0])+"\n",
            }
            this.sendMsg(msg);
          }
        }
        let msg = { event: GameEvent.DiscussStart, num: randomNum(1, this.roomUserInfoList.length+1) };
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
        this.playerPanel.text = "等待黎明到来\n";
      } 
      // 玩家是狼
      else if (
        this.playerRole == RoleList.WereWolf || this.playerRole == RoleList.WereWolf2
      ) {
        let wolfRoles = this.getWolfRoles();
        // 场上只有一狼
        if (wolfRoles.length == 1) {
          this.playerPanel.text = "你没有队友，查看一张非玩家牌\n";
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
          this.playerPanel.text = "场上的狼玩家是：";
          for (let role of wolfRoles) {
            this.playerPanel.text += this.roleUserMap[role].userProfile + " ";
          }
          this.playerPanel.text.trimRight();
          this.playerPanel.text+="\n";
        }
      // 爪牙
      } else if (this.playerRole == RoleList.Minion) {
        let wolfRoles = this.getWolfRoles();
        if(wolfRoles.length == 0){
          this.playerPanel.text = "场上没有狼人\n";
        }
        else{
          this.playerPanel.text = "场上的狼玩家是：";
          for (let role of wolfRoles) {
            this.playerPanel.text += this.roleUserMap[role].userProfile + " ";
          }
          this.playerPanel.text.trimRight();
          this.playerPanel.text+="\n";
        }
      }
      // 玩家是预言家
      else if (this.playerRole == RoleList.Seer) {
        this.playerPanel.text = "夜晚行动\n";
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
        this.playerPanel.text = "夜晚行动\n";
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
        this.playerPanel.text = "夜晚行动\n";
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
        this.playerPanel.text = "夜晚行动\n";
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
        this.playerPanel.text = "夜晚行动\n";
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
    startDiscuss(msg) {
      for (let userInfo of this.roomUserInfoList) {
        this.voteForm.options.push({
          text: userInfo.userProfile,
          value: userInfo.userID
        });
      }
      this.voteForm.show = true;
      // 创建等待玩家列表
      this.waitUsers = [];
      for(let user of this.roomUserInfoList){
        if(!user.offline) this.waitUsers.push(user.userID);
      }
      this.playerPanel.text += "开始讨论吧~\n从玩家列表中第"+ msg.num+"位玩家开始，按顺序发言\n讨论结束后，在下方选择玩家并投票";
    },
    showVoteResult(){
      this.voteShow = true;
    },
    onNewGame(){
      this.settingForm.show = true;
      this.sendMsg({event: GameEvent.New});
      engine.joinOpen("");
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
        userID: this.registerRsp.userID,
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
    getWinner(){
      let userVoted={};
      for(let userID in this.voteResult){
        if(userVoted[userID] == undefined) userVoted[userID] = 1;
        else userVoted[userID]++;
      }
      let maxVotedNum = 0;
      let outUserIDs = [];
      for(let userID in userVoted){
        if(userVoted[userID]>maxVotedNum) {
          maxVotedNum = userVoted.userID;
          outUserIDs = [userID];
        }
        else if(userVoted == maxVotedNum) {
          outUserIDs.push(userID);
        }
      }
      for(let userID in outUserIDs){
        let role = this.getRoleByuserID(userID);
        if(role == RoleList.WereWolf || role == RoleList.WereWolf2) return "村民阵营";
      }
      return "狼人阵营";
    },
    // 刷新或关闭页面时
    updateHandler(){
      //游戏已经开始
      if(this.joinOver){
        this.sentMsg({event: GameEvent.LeaveRoomInGame, userID: this.registerRsp.userID})
      }else{
        engine.leaveRoom("走了");
      }
    },
    sendJoinRoomNotify(){
      this.sendMsg({
        event: GameEvent.JoinRoomNotify,
        roomUserInfo: {
          userID: this.registerRsp.userID,
          userProfile: this.playerForm.name,
        }
      })
    },
    receiveJoinRoomNotify(roomUserInfo){
      let i = this.roomUserInfoList.findIndex(value => {
        return value.userID == roomUserInfo.userID;
      });
      if(i != -1) return;
      this.roomUserInfoList.push(roomUserInfo);

      this.$bvToast.toast(roomUserInfo.userProfile+this.$t('join_room'), {
        title: 'matchvs',
        autoHideDelay: 2000,
      })
    },
    sendJoinOverNotify(){
      this.sendMsg({
        event: GameEvent.JoinOverNotify,
        joinOverInfo: {
          roomID: this.roomInfo.roomID,
          srcUserID: this.registerRsp.userID,
          cpProto: "",
        }
      })
    },
    receiveJoinOverNotify(joinOverInfo){
      if(this.joinOver) return;
      this.joinOver = true;
      this.$bvToast.toast(this.$t('join_over')+joinOverInfo.roomID, {
        title: 'matchvs',
        autoHideDelay: 2000,
      })
    },
    onPlayerLeaveRoom(userID,owner){
      let index = this.roomUserInfoList.findIndex(value => {
        return value.userID == userID;
      });
      if(index == -1) return;
      this.$bvToast.toast(this.roomUserInfoList[index].userProfile+this.$t('leave_room'), {
        title: 'matchvs',
        autoHideDelay: 2000,
      });
      this.roomInfo.owner = owner;

      //已经开始游戏
      if(this.joinOver){
        this.roomUserInfoList[index]["offline"] = true;
        if(this.isOwner){
          let role = this.getRoleByuserID(userID);
          if(this.waitRoles.indexOf(role)>-1) this.sendMsg({event: GameEvent.RoleSubmit, role: role});
          if(this.waitUsers.indexOf(userID)>-1) this.sendMsg({event: GameEvent.VoteSubmit, userID: userID});
        }
      }
      //还在准备阶段
      else{
        this.roomUserInfoList.splice(index, 1);
        if(this.isOwner){
          this.settingForm.show = true;
        }
      }
    }
  }
};
</script>