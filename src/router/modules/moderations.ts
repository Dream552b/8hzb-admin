const Layout = () => import("@/layout/index.vue");

export default {
  path: "/moderations",
  name: "Moderations",
  component: Layout,
  redirect: "/moderations/index",
  meta: {
    icon: "grid",
    title: "敏感词管理",
    rank: 99
  },
  children: [
    {
      path: "/moderations/index",
      name: "ModerationsIndex",
      component: () => import("@/views/moderations/index.vue"),
      // component: () => import("@/views/welcome/index.vue"),
      meta: {
        title: "敏感词管理",
        keepAlive: true
      }
    }
  ]
} as RouteConfigsTable;
