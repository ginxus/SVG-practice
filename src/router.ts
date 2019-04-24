import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import(/* webpackChunkName: "home" */ './views/Home.vue'),
    },
    {
      path: '/snow',
      name: 'snow-page',
      component: () => import(/* webpackChunkName: "snow" */ './views/SnowPage.vue'),
    },
    {
      path: '/clipPath',
      name: 'clipPath-page',
      component: () => import(/* webpackChunkName: "clip-path" */ './views/ClipPathPage.vue'),
    },
    {
      path: '/text',
      name: 'text-page',
      component: () => import(/* webpackChunkName: "clip-path" */ './views/TextPage.vue'),
    },
  ],
});
