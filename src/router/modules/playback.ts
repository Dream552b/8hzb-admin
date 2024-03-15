const Layout = () => import("@/layout/index.vue");

export default {
  path: "/video_back",
  name: "Video_back",
  component: Layout,
  redirect: "/video_back/index",
  meta: {
    icon: "grid",
    title: "视频回放",
    rank: 99
  },
  children: [
    {
      path: "/video_back/index",
      name: "Video_backIndex",
      component: () => import("@/views/video_back/index.vue"),
      // component: () => import("@/views/welcome/index.vue"),
      meta: {
        title: "视频回放",
        keepAlive: true
      }
    }
  ]
} as RouteConfigsTable;
