(function(root){
  const stations=[
    {id:'s1',name:'青山服务区',road:'G60 沪昆高速 · 杭州方向',km:28,minutes:24,score:96,green:82,parking:32,charging:6,quiet:38,temp:25,humidity:56,updated:Date.now(),source:'演示传感器',slots:8,tag:'绿荫环抱 · 安静好眠'},
    {id:'s2',name:'临溪服务区',road:'G60 沪昆高速 · 杭州方向',km:65,minutes:52,score:91,green:74,parking:18,charging:3,quiet:42,temp:26,humidity:60,updated:Date.now(),source:'演示工作人员',slots:5,tag:'亲子友好 · 风雨连廊'},
    {id:'s3',name:'云栖服务区',road:'G60 沪昆高速 · 杭州方向',km:102,minutes:83,score:88,green:68,parking:5,charging:1,quiet:44,temp:24,humidity:58,updated:Date.now(),source:'演示用户反馈',slots:2,tag:'山间歇脚 · 温暖补给'}
  ];
  const services=[{id:'sleep',name:'睡眠舱',price:25,unit:'30分钟',icon:'休'},{id:'shower',name:'温暖淋浴',price:15,unit:'20分钟',icon:'淋'},{id:'family',name:'母婴室',price:0,unit:'30分钟',icon:'亲'},{id:'parking',name:'货车车位',price:0,unit:'2小时',icon:'P'}];
  const extraServices=[
    {id:'laundry',name:'洗衣代取送',group:'司机服务',wait:25,icon:'洗',desc:'洗衣完成后本地提醒，演示不连接真实服务台'},
    {id:'wake',name:'安心叫醒',group:'司机服务',wait:0,icon:'醒',desc:'设置本机演示叫醒记录，不产生系统闹钟'},
    {id:'meal',name:'餐食预留',group:'补给服务',wait:8,icon:'餐',desc:'预留热餐取餐时段，演示不产生付款'},
    {id:'tire',name:'轮胎检测',group:'车辆服务',wait:15,icon:'检',desc:'登记检测意向，现场能力需服务区确认'},
    {id:'accessible',name:'无障碍协助',group:'关怀服务',wait:5,icon:'助',desc:'登记坡道、轮椅或陪同行走需求'},
    {id:'familycart',name:'婴儿车借用',group:'亲子服务',wait:3,icon:'借',desc:'登记借用意向，库存为示例'}
  ];
  const facilities=[
    {id:'rest',name:'司机之家',x:27,y:23,desc:'位于综合服务楼西侧，提供饮水、阅读与短时休息',accessible:true},
    {id:'shower',name:'淋浴间',x:39,y:23,desc:'紧邻司机之家，面向长途驾驶员提供基础洗浴服务',accessible:true},
    {id:'restaurant',name:'餐厅',x:44,y:34,desc:'位于综合服务楼中部，与停车区之间设有人行通道',accessible:true},
    {id:'market',name:'便利超市',x:57,y:34,desc:'提供饮水、简餐和常用出行物资',accessible:true},
    {id:'family',name:'母婴室',x:57,y:23,desc:'设温奶、尿布台与相对独立的哺乳空间',accessible:true},
    {id:'toilet',name:'无障碍卫生间',x:70,y:23,desc:'位于公共卫生间入口侧，采用平层到达路线',accessible:true},
    {id:'aid',name:'服务台 / AED',x:70,y:34,desc:'问询、失物招领、应急联络及AED示意点位',accessible:true},
    {id:'garden',name:'休憩绿地',x:13,y:39,desc:'靠近综合服务楼西侧，设短时步行和舒展空间',accessible:true},
    {id:'cars',name:'小客车区',x:38,y:54,desc:'靠近综合服务楼主入口，步行到站更便捷',accessible:true},
    {id:'charge',name:'充电区',x:66,y:53,desc:'新能源小客车补能示意区，实际开放状态以现场为准',accessible:true},
    {id:'trucks',name:'货车停车区',x:28,y:70,desc:'与小客车区域分流，靠近司机服务设施',accessible:true},
    {id:'repair',name:'车辆维修',x:66,y:70,desc:'基础车辆检查与应急维修示意点位',accessible:false},
    {id:'fuel',name:'加油站',x:82,y:68,desc:'位于离场侧车行流线上，人车动线分离',accessible:false}
  ];
  function initial(){return {version:2,bookings:[],tickets:[],reviews:[],points:120,redemptions:[],favorites:[],queues:[],serviceRequests:[],greenActions:[],guards:{vehicle:false,child:false},persona:'综合出行',settings:{large:false,night:false,incognito:false,weather:false,peak:false},driveStart:null,offline:null};}
  function restore(raw){try{const x=typeof raw==='string'?JSON.parse(raw):raw;if(x&&[1,2].includes(x.version)&&['bookings','tickets','reviews','redemptions','favorites'].every(k=>Array.isArray(x[k]))&&Number.isFinite(x.points))return {...initial(),...x,version:2,queues:Array.isArray(x.queues)?x.queues:[],serviceRequests:Array.isArray(x.serviceRequests)?x.serviceRequests:[],greenActions:Array.isArray(x.greenActions)?x.greenActions:[],guards:{...initial().guards,...x.guards},settings:{...initial().settings,...x.settings}};}catch{}return initial();}
  function id(prefix){return prefix+Date.now().toString(36)+Math.random().toString(36).slice(2,7);}
  function reserve(state,input,now=Date.now()){
    const station=stations.find(s=>s.id===input.stationId), service=services.find(s=>s.id===input.serviceId);
    if(!station||!service)throw Error('请选择有效的服务区和设施');
    if(!input.consent)throw Error('请同意保存本次预约所需信息');
    const at=Date.parse(input.at);if(!Number.isFinite(at)||at<now+60000||at>now+7*86400000)throw Error('请选择未来7天内的预约时间，至少提前1分钟');
    const active=state.bookings.filter(b=>b.status==='confirmed');
    if(active.some(b=>b.stationId===input.stationId&&b.serviceId===input.serviceId&&Math.abs(Date.parse(b.at)-at)<1800000))throw Error('该时段已有相同预约，请勿重复提交');
    if(active.filter(b=>b.stationId===input.stationId&&b.serviceId===input.serviceId&&Math.abs(Date.parse(b.at)-at)<1800000).length>=station.slots)throw Error('该时段已满，请选择其他服务区');
    const booking={id:id('ZZ'),stationId:station.id,serviceId:service.id,at:new Date(at).toISOString(),status:'confirmed',price:service.price,proxy:!!input.proxy,code:String(Math.floor(100000+Math.random()*900000)),created:now};state.bookings.unshift(booking);return booking;
  }
  function cancel(state,bid){const b=state.bookings.find(b=>b.id===bid);if(!b||b.status!=='confirmed')throw Error('该预约无法取消');b.status='cancelled';}
  function reschedule(state,bid,stationId){const b=state.bookings.find(b=>b.id===bid);if(!b||b.status!=='confirmed'||Date.parse(b.at)<=Date.now())throw Error('仅可改签尚未到时的有效预约');if(b.stationId===stationId)throw Error('请选择其他站点');const next=reserve(state,{...b,stationId,consent:true});b.status='rescheduled';return next;}
  function complete(state,bid){const b=state.bookings.find(b=>b.id===bid);if(!b||b.status!=='confirmed')throw Error('该预约不能核销');b.status='completed';state.points+=20;}
  function ticket(state,input){if(!stations.some(s=>s.id===input.stationId))throw Error('请选择服务区');const text=(input.text||'').trim();if(text.length<5||text.length>300)throw Error('请填写5至300字的问题描述');const t={id:id('GD'),stationId:input.stationId,text,kind:input.kind||'设施故障',status:'待处理',created:Date.now()};state.tickets.unshift(t);return t;}
  function progress(state,tid){const t=state.tickets.find(t=>t.id===tid);if(!t)throw Error('工单不存在');t.status=t.status==='待处理'?'处理中':'已解决';}
  function redeem(state,name,cost){const catalog={'咖啡兑换券':80,'睡眠舱折扣券':100,'生态林公益捐赠':50};if(catalog[name]!==cost)throw Error('兑换项目无效');if(state.points<cost)throw Error('积分不足，完成低碳休息可获得积分');state.points-=cost;const item={id:id('LP'),name,cost,created:Date.now()};state.redemptions.unshift(item);return item;}
  function takeQueue(state,input){const station=stations.find(s=>s.id===input.stationId),service=extraServices.find(s=>s.id===input.serviceId);if(!station||!service)throw Error('请选择有效的服务区和服务');if(state.queues.some(q=>q.status==='等待中'&&q.stationId===station.id&&q.serviceId===service.id))throw Error('该服务已有等待中的号码');const ahead=Math.max(0,Math.min(12,Number(input.ahead)||Math.floor(Math.random()*5)));const item={id:id('Q'),stationId:station.id,serviceId:service.id,number:'A'+String(20+state.queues.length+1).padStart(3,'0'),ahead,eta:ahead*service.wait,status:'等待中',created:Date.now()};state.queues.unshift(item);return item;}
  function cancelQueue(state,qid){const q=state.queues.find(q=>q.id===qid);if(!q||q.status!=='等待中')throw Error('该号码无法取消');q.status='已取消';}
  function requestService(state,input){const station=stations.find(s=>s.id===input.stationId),service=extraServices.find(s=>s.id===input.serviceId);if(!station||!service)throw Error('请选择有效服务');const note=(input.note||'').trim();if(note.length>120)throw Error('备注不能超过120字');const r={id:id('SR'),stationId:station.id,serviceId:service.id,note,status:'已登记',created:Date.now()};state.serviceRequests.unshift(r);return r;}
  function progressService(state,rid){const r=state.serviceRequests.find(r=>r.id===rid);if(!r)throw Error('服务记录不存在');r.status=r.status==='已登记'?'准备中':'已完成';}
  function toggleGuard(state,key){if(!['vehicle','child'].includes(key))throw Error('守护类型无效');state.guards[key]=!state.guards[key];return state.guards[key];}
  function greenAction(state,key,now=Date.now()){const catalog={cup:{name:'自带水杯',points:5},plate:{name:'光盘行动',points:8},green:{name:'绿电休息',points:10},walk:{name:'步行舒展',points:3}};const item=catalog[key];if(!item)throw Error('低碳行为无效');const day=new Date(now).toISOString().slice(0,10);if(state.greenActions.some(a=>a.key===key&&a.day===day))throw Error('该行为今天已经记录');const record={id:id('GA'),key,day,name:item.name,points:item.points,created:now};state.greenActions.unshift(record);state.points+=item.points;return record;}
  function carbon(kwh,green){if(!Number.isFinite(kwh)||kwh<0||!Number.isFinite(green)||green<0||green>100)throw Error('碳核算输入无效');const baseline=kwh*0.5306,actual=baseline*(1-green/100);return {baseline,actual,saved:baseline-actual};}
  function confidence(s,now=Date.now()){if(now-s.updated>15*60000)return '状态可能变化，请现场确认';return s.source==='演示用户反馈'?'待核实':s.source==='演示工作人员'?'工作人员确认':'设备数据';}
  function plan(input){if(!(input.origin||'').trim()||!(input.destination||'').trim())throw Error('请填写起点与终点');if(input.origin.trim()===input.destination.trim())throw Error('起点与终点不能相同');const selected=stations.filter(s=>!input.avoidBusy||s.parking>=10);return input.quiet?selected.slice().sort((a,b)=>b.score-a.score):selected;}
  const api={stations,services,extraServices,facilities,initial,restore,reserve,cancel,reschedule,complete,ticket,progress,redeem,takeQueue,cancelQueue,requestService,progressService,toggleGuard,greenAction,carbon,confidence,plan};if(typeof module!=='undefined')module.exports=api;else root.Zhizhi=api;
})(typeof globalThis!=='undefined'?globalThis:this);
