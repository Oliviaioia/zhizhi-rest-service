(function(root){
  const stations=[
    {id:'s1',name:'青山服务区',road:'G60 沪昆高速 · 杭州方向',km:28,minutes:24,score:96,green:82,parking:32,charging:6,quiet:38,temp:25,humidity:56,updated:Date.now(),source:'演示传感器',slots:8,tag:'绿荫环抱 · 安静好眠'},
    {id:'s2',name:'临溪服务区',road:'G60 沪昆高速 · 杭州方向',km:65,minutes:52,score:91,green:74,parking:18,charging:3,quiet:42,temp:26,humidity:60,updated:Date.now(),source:'演示工作人员',slots:5,tag:'亲子友好 · 风雨连廊'},
    {id:'s3',name:'云栖服务区',road:'G60 沪昆高速 · 杭州方向',km:102,minutes:83,score:88,green:68,parking:5,charging:1,quiet:44,temp:24,humidity:58,updated:Date.now(),source:'演示用户反馈',slots:2,tag:'山间歇脚 · 温暖补给'}
  ];
  const routeTemplates={
    '上海>杭州':{road:'G60 沪昆高速',totalKm:178,stations:[
      ['fengjing','枫泾服务区',58,46,90,26,10,5,'沪浙交界 · 适合首次短休'],
      ['jiaxing','嘉兴服务区',101,78,94,34,18,7,'综合补给 · 新能源友好'],
      ['changan','长安服务区',148,112,91,22,12,5,'临近杭州 · 餐饮补给']
    ]},
    '杭州>宁波':{road:'G92 杭州湾环线高速',totalKm:156,stations:[
      ['shaoxing','绍兴服务区',55,44,93,30,14,6,'短休用餐 · 司机关怀'],
      ['yuyao','余姚服务区',119,91,90,24,16,4,'补能整备 · 临近宁波']
    ]},
    '杭州>金华':{road:'G60 沪昆高速',totalKm:176,stations:[
      ['xiaoshan','萧山服务区',34,30,89,25,10,4,'离杭首站 · 补水检查'],
      ['zhuji','诸暨服务区',87,68,95,36,16,7,'司机休息 · 餐饮补给'],
      ['jinhua','金华服务区',151,116,93,31,20,6,'亲子休憩 · 地方餐食']
    ]},
    '杭州>衢州':{road:'G60 沪昆高速',totalKm:229,stations:[
      ['xiaoshan','萧山服务区',34,30,89,25,10,4,'离杭首站 · 补水检查'],
      ['zhuji','诸暨服务区',87,68,95,36,16,7,'司机休息 · 餐饮补给'],
      ['lanxi','兰溪服务区',164,123,96,38,18,8,'司机之家 · 淋浴洗衣'],
      ['quzhou','衢州服务区',211,158,91,27,14,5,'到达前整备 · 综合补给']
    ]},
    '杭州>温州':{road:'S26 诸永高速 / G15 沈海高速',totalKm:305,stations:[
      ['zhuji','诸暨服务区',82,64,94,35,16,7,'长途首休 · 餐饮补给'],
      ['dongyang','东阳服务区',142,108,96,40,68,9,'司机之家 · 集中补能'],
      ['tiantai','天台服务区',214,159,92,29,18,6,'山区路段前休整'],
      ['qingjiang','清江服务区',278,207,90,24,14,5,'临近温州 · 到达前整备']
    ]},
    '杭州>南京':{road:'G25 长深高速',totalKm:280,stations:[
      ['taihu','太湖服务区',82,64,93,32,18,6,'湖州段补给 · 充分短休'],
      ['changxing','长兴服务区',121,93,90,25,12,5,'浙苏交界前检查'],
      ['yixing','宜兴服务区',178,133,92,30,16,6,'跨省休整 · 餐饮补能'],
      ['lishui','溧水服务区',248,185,89,22,12,4,'抵达南京前整备']
    ]},
    '杭州>台州':{road:'G1522 常台高速',totalKm:235,stations:[
      ['shengzhou','嵊州服务区',105,80,92,28,14,5,'山路前休整 · 热餐'],
      ['xinchang','新昌服务区',147,111,94,31,18,6,'山区补能 · 充分休息'],
      ['tiantai','天台服务区',203,151,91,26,16,5,'到达前短休 · 地方补给']
    ]}
  };
  const routeCities=[
    ['北京',39.9042,116.4074],['上海',31.2304,121.4737],['广州',23.1291,113.2644],['深圳',22.5431,114.0579],['天津',39.0842,117.2009],
    ['重庆',29.5630,106.5516],['成都',30.5728,104.0668],['杭州',30.2741,120.1551],['南京',32.0603,118.7969],['武汉',30.5928,114.3055],
    ['西安',34.3416,108.9398],['苏州',31.2989,120.5853],['郑州',34.7466,113.6254],['长沙',28.2282,112.9388],['青岛',36.0671,120.3826],
    ['合肥',31.8206,117.2272],['宁波',29.8683,121.5440],['厦门',24.4798,118.0894],['福州',26.0745,119.2965],['济南',36.6512,117.1201],
    ['沈阳',41.8057,123.4315],['大连',38.9140,121.6147],['长春',43.8171,125.3235],['哈尔滨',45.8038,126.5350],['石家庄',38.0428,114.5149],
    ['太原',37.8706,112.5489],['南昌',28.6820,115.8579],['南宁',22.8170,108.3665],['昆明',25.0389,102.7183],['贵阳',26.6470,106.6302],
    ['兰州',36.0611,103.8343],['银川',38.4872,106.2309],['西宁',36.6171,101.7782],['乌鲁木齐',43.8256,87.6168],['海口',20.0440,110.1999],
    ['三亚',18.2528,109.5119],['呼和浩特',40.8426,111.7492],['拉萨',29.6520,91.1721],['无锡',31.4912,120.3119],['常州',31.8107,119.9741],
    ['温州',27.9949,120.6994],['金华',29.0792,119.6474],['绍兴',30.0303,120.5802],['嘉兴',30.7461,120.7555],['台州',28.6564,121.4208],
    ['衢州',28.9359,118.8742],['南通',31.9802,120.8943],['徐州',34.2044,117.2858],['泉州',24.8741,118.6757],['佛山',23.0215,113.1214]
  ].map(([name,lat,lng])=>({name,lat,lng}));
  const routePairCount=routeCities.length*(routeCities.length-1)/2;
  const routeCityMap=Object.fromEntries(routeCities.map(city=>[city.name,city]));
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
  function confidence(s,now=Date.now()){if(s.routeReference)return '路线参考数据';if(now-s.updated>15*60000)return '状态可能变化，请现场确认';return s.source==='演示用户反馈'?'待核实':s.source==='演示工作人员'?'工作人员确认':'设备数据';}
  function normalizeCity(value){return String(value||'').trim().replace(/\s+/g,'').replace(/^.*?(省|自治区)/,'').replace(/^(北京市|上海市|天津市|重庆市)/,m=>m.slice(0,2)).replace(/(市|城区)$/,'');}
  function routeStation(raw,road,direction){const [id,name,km,minutes,score,parking,charging,slots,tag]=raw;return {id:'route-'+id,name,road:`${road} · ${direction}方向`,km,minutes,score,parking,charging,slots,tag,green:72,quiet:42,temp:25,humidity:58,updated:Date.now(),source:'路线规划演示',routeReference:true,accessible:true,busy:parking<24};}
  function routeSeed(text){let seed=2166136261;for(const c of text){seed^=c.charCodeAt(0);seed=Math.imul(seed,16777619);}return seed>>>0;}
  function geoKm(a,b){const rad=n=>n*Math.PI/180,dLat=rad(b.lat-a.lat),dLng=rad(b.lng-a.lng),x=Math.sin(dLat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dLng/2)**2;return 6371*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));}
  function nearestRouteCity(lat,lng,excluded){let best=null,bestDistance=Infinity;for(const city of routeCities){if(excluded.has(city.name))continue;const d=(city.lat-lat)**2+(city.lng-lng)**2;if(d<bestDistance){best=city;bestDistance=d;}}return best;}
  function nationalRoute(origin,destination){const start=routeCityMap[origin],end=routeCityMap[destination];if(!start||!end)return null;const key=[origin,destination].sort().join('>'),seed=routeSeed(key),factor=1.12+(seed%13)/100,totalKm=Math.max(80,Math.round(geoKm(start,end)*factor)),count=Math.max(1,Math.min(5,Math.ceil(totalKm/190))),used=new Set([origin,destination]),result=[];for(let i=1;i<=count;i++){const ratio=i/(count+1),lat=start.lat+(end.lat-start.lat)*ratio,lng=start.lng+(end.lng-start.lng)*ratio,near=nearestRouteCity(lat,lng,used),name=near?.name||'沿途';if(near)used.add(near.name);const km=Math.round(totalKm*ratio),stationSeed=routeSeed(`${origin}>${destination}>${i}`);result.push({id:`route-cn-${stationSeed}-${i}`,name:`${name}周边服务区候选点`,road:'全国高速公路网 · 规划估算',km,minutes:Math.round(km/1.18),score:86+stationSeed%11,parking:18+stationSeed%29,charging:4+stationSeed%17,slots:2+stationSeed%8,tag:i===1?'建议首次休息 · 需导航核验':'沿途补给候选 · 需导航核验',green:68,quiet:44,temp:25,humidity:58,updated:Date.now(),source:'全国城市组合估算',routeReference:true,accessible:true,busy:stationSeed%5===0});}return {road:'全国高速公路网 · 规划估算',totalKm,stations:result,recognized:true,curated:false};}
  function fallbackRoute(origin,destination){let seed=0;for(const c of origin+'>'+destination)seed=(seed*31+c.charCodeAt(0))>>>0;const totalKm=160+seed%241,count=totalKm>300?3:2,road='待接入地图导航 · 路线估算';const result=[];for(let i=1;i<=count;i++){const km=Math.round(totalKm*i/(count+1)),score=86+(seed+i*7)%10;result.push({id:`route-est-${seed}-${i}`,name:`途中候选休息点 ${i}`,road,km,minutes:Math.round(km/1.28),score,parking:18+(seed+i*5)%19,charging:4+(seed+i*3)%13,slots:2+(seed+i)%6,tag:i===1?'建议首次休息 · 需导航核验':'备用停靠 · 需导航核验',green:68,quiet:44,temp:25,humidity:58,updated:Date.now(),source:'路线规划演示',routeReference:true,accessible:true,busy:false});}return {road,totalKm,stations:result,recognized:false};}
  function plan(input){const origin=normalizeCity(input.origin),destination=normalizeCity(input.destination);if(!origin||!destination)throw Error('请填写起点与终点');if(origin===destination)throw Error('起点与终点不能相同');const direct=routeTemplates[`${origin}>${destination}`],reverse=routeTemplates[`${destination}>${origin}`];let route;if(direct){route={...direct,stations:direct.stations.map(s=>routeStation(s,direct.road,destination)),recognized:true,curated:true};}else if(reverse){route={...reverse,stations:reverse.stations.slice().reverse().map(s=>{const station=routeStation(s,reverse.road,destination);station.km=Math.max(1,reverse.totalKm-station.km);station.minutes=Math.round(station.km/1.28);return station;}),recognized:true,curated:true};}else route=nationalRoute(origin,destination)||fallbackRoute(origin,destination);let selected=route.stations.slice();if(input.avoidBusy){const filtered=selected.filter(s=>!s.busy);if(filtered.length)selected=filtered;}if(input.accessible){const filtered=selected.filter(s=>s.accessible);if(filtered.length)selected=filtered;}const recommended=input.quiet?selected.reduce((best,s)=>!best||s.score>best.score?s:best,null):selected[0];selected=selected.map(s=>({...s,recommended:s.id===recommended?.id}));const dataMode=route.curated?'重点走廊参考库':route.recognized?'全国城市组合库':'个性化里程估算',note=route.curated?'服务区名称按常用高速走廊配置；里程、时长和余量为规划演示。':route.recognized?'已覆盖该城市组合；里程与候选节点为差异化估算，不代表实际服务区名称，请用实时导航核验。':'暂未收录该城市组合；候选点为差异化估算，不代表实际服务区名称。';return {origin,destination,road:route.road,totalKm:route.totalKm,recognized:route.recognized,curated:!!route.curated,stations:selected,dataMode,note};}
  const api={stations,routeTemplates,routeCities,routePairCount,services,extraServices,facilities,initial,restore,reserve,cancel,reschedule,complete,ticket,progress,redeem,takeQueue,cancelQueue,requestService,progressService,toggleGuard,greenAction,carbon,confidence,plan};if(typeof module!=='undefined')module.exports=api;else root.Zhizhi=api;
})(typeof globalThis!=='undefined'?globalThis:this);
