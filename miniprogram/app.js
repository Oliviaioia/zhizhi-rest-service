App({onLaunch(){},onHide(){if(this.globalData.incognito)wx.removeStorageSync('zhizhi-v1');},globalData:{incognito:false}});
