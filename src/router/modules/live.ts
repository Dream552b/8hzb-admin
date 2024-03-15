const Layout = () => import("@/layout/index.vue");

export default {
  path: "/live",
  name: "Live",
  component: Layout,
  redirect: "/live/index",
  meta: {
    icon: "grid",
    title: "直播室管理",
    rank: 99
  },
  children: [
    {
      path: "/live/index",
      name: "LiveIndex",
      component: () => import("@/views/live/index.vue"),
      // component: () => import("@/views/welcome/index.vue"),
      meta: {
        title: "直播室管理",
        keepAlive: true
      }
    }
  ]
} as RouteConfigsTable;
