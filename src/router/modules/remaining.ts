const Layout = () => import("@/layout/index.vue");

export default [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "登录",
      showLink: false,
      rank: 101
    }
  },
  {
    path: "/user",
    // redirect: "/user/record-list",
    meta: {
      title: "用户列表"
    },
    component: Layout,
    children: [
      {
        meta: {
          title: "记录列表",
          showLink: false,
          activePath: "/user/list/index",
          keepAlive: true
        },
        name: "UserRecordList",
        path: "/user/user-list/record-list",
        component: () => import("@/views/user/recordList/index.vue")
      }
    ]
  },
  {
    path: "/sys",
    meta: {
      title: "系统管理"
    },
    component: Layout,
    children: [
      {
        meta: {
          title: "消息中心",
          showLink: false,
          keepAlive: true
        },
        name: "SysMessage",
        path: "/sys/message/index",
        component: () => import("@/views/sys/message/index.vue")
      }
    ]
  },
  {
    path: "/redirect",
    component: Layout,
    meta: {
      title: "加载中...",
      showLink: false,
      rank: 102
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        name: "Redirect",
        component: () => import("@/layout/redirect.vue")
      }
    ]
  }
] as Array<RouteConfigsTable>;
