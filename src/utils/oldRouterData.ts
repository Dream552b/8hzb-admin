export const oldMenuPathDataMap = [
  {
    name: "用户管理",
    path: "/user"
  },
  {
    name: "用户列表",
    path: "/user/list/index",
    cname: "UserList"
  },
  {
    name: "短信记录",
    path: "/user/smsRecord",
    cname: "UserSmsRecord"
  },
  {
    name: "系统管理",
    path: "/sys"
  },
  {
    name: "角色管理",
    path: "/sys/role/index",
    cname: "SysRole"
  },
  {
    name: "账号管理",
    path: "/sys/account/index",
    cname: "SysAccount"
  },
  {
    name: "赛事管理",
    path: "/competition"
  },
  {
    name: "足球数据",
    path: "/competition/football",
    cname: "Football"
  },
  {
    name: "篮球数据",
    path: "/competition/basketball",
    cname: "Basketball"
  },
  {
    name: "热门赛事",
    path: "/competition/hotEvent",
    cname: "HotEvent"
  },
  {
    name: "赛事列表",
    path: "/competition/hotTeam",
    cname: "HotTeam"
  },
  {
    name: "比赛管理",
    path: "/competitionList"
  },
  {
    name: "视频管理",
    path: "/video"
  },
  {
    name: "视频回放",
    path: "/video/playback",
    cname: "Playback",
    showParent: true
  },
  {
    name: "广告配置",
    path: "/advert"
  },
  {
    name: "直播室广告",
    path: "/advert/liveadvert/index",
    cname: "Liveadvert"
  },
  {
    name: "聊天室广告",
    path: "/advert/chatadvert/index",
    cname: "Chatadvert"
  }
];

export const formatMenu = arr => {
  const menuMap = {};
  const result = [];

  arr.forEach(menu => {
    // menu.children = [];
    menuMap[menu.menuId] = menu;
    const parentId = menu.parentId;
    const type = ~~menu.type; // 转成number类型
    if (parentId !== null && type === 0) {
      // console.log("menuMap[parentId]:", menuMap[parentId].children);
      if (!menuMap[parentId].children) {
        menuMap[parentId].children = [];
      }
      const oldMenu = oldMenuPathDataMap.find(
        item => item.name === menu.menuName
      );
      menu.path = oldMenu?.path;
      menu.name = oldMenu?.cname;
      menu.meta = {};
      menu.meta.title = menu.menuName;
      menu.meta.showParent = oldMenu?.showParent;
      menuMap[parentId].children.push(menu);
      menuMap[parentId].children.sort((a, b) => a - b);
    } else {
      menu.meta = {};
      menu.meta.title = menu.menuName;
      menu.path = oldMenuPathDataMap.find(
        item => item.name === menu.menuName
      )?.path;
      result.push(menu);
    }
  });
  return result.sort((a, b) => a - b);
};
