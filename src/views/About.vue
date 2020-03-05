<template>
  <div class="about">
    <b-container>
      <b-row>
        <b-col cols="12" lg="12">
          <b-card title="简介">
            <p>为什么叫快乐狼人？一是快，一个黑夜和白天就结束，没有人打酱油；另一个是乐，和狼人杀不同，这不是破案游戏，而是演戏和撕逼游戏。</p>
          </b-card>
        </b-col>
        <b-col class="my-2" cols="12" lg="6">
          <b-list-group>
            <b-list-group-item><h2>游戏特色</h2></b-list-group-item>
            <b-list-group-item>只有一夜，无人酱油</b-list-group-item>
            <b-list-group-item>身份配置，多多尝试</b-list-group-item>
            <b-list-group-item>肆意发挥，狂飙演技</b-list-group-item>
            <b-list-group-item>身份成谜，包括自己</b-list-group-item>
          </b-list-group>
        </b-col>
        <b-col class="my-2" cols="12" lg="6">
          <b-list-group class="text-left">
            <b-list-group-item><h2 class="text-center">详细说明</h2></b-list-group-item>
            <b-list-group-item>创建或加入房间：<br>输入名称，选择创建或者加入，点击提交；创建会新建一个房间并将房间ID复制到剪贴板，方便发送给朋友；加入需要输入一个房间ID。</b-list-group-item>
            <b-list-group-item>房主设置身份：<br>游戏需要设置身份数量比玩家数量多3个，点击提交，系统自动给每个玩家分配一个身份，有3个身份剩余，称为非玩家身份。</b-list-group-item>
            <b-list-group-item>夜晚行动：<br>夜晚行动的玩家按照提示进行操作，点击提交；不需要行动的玩家请等待；全部玩家操作完成后自动进入下一阶段。（身份行动顺序和“本局游戏身份”列表显示的一致）</b-list-group-item>
            <b-list-group-item>白天讨论与投票：<br>白天到来，有能力的身份会显示相应结果；按玩家列表顺序发言，一名玩家发言时，其他玩家请保持安静；讨论时间不宜过长，建议在15到20分钟；决定投票目标后，点击对应的玩家并提交；每个玩家必须投票，全部玩家投票完成后显示结果；获得最多票的玩家出局，平票则同时出局；如果每个玩家都获得1票，则没有人出局。</b-list-group-item>
            <b-list-group-item>获胜条件：<br>1、村民阵营：玩家中有狼人时，至少有一个狼人玩家出局；玩家中没有狼人时，没有人出局。<br>2、狼人阵营：玩家中有狼人且没有狼人玩家出局</b-list-group-item>
            <b-list-group-item>复盘一下，其乐融融，然后开始下一局！</b-list-group-item>
          </b-list-group>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
