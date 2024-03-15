const Layout = () => import("@/layout/index.vue");

export default {
  path: "/publicize",
  name: "Publicize",
  component: Layout,
  redirect: "/publicize/index",
  meta: {
    icon: "grid",
    title: "广告推送",
    rank: 99
  },
  children: [
    {
      path: "/publicize/index",
      name: "PublicizeIndex",
      component: () => import("@/views/publicize/index.vue"),
      // component: () => import("@/views/welcome/index.vue"),
      meta: {
        title: "广告推送",
        keepAlive: true
      }
    }
  ]
} as RouteConfigsTable;
