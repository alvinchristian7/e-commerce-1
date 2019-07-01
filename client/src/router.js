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
      component: () => import(/* webpackChunkName: "about" */ './views/Home.vue'),
    },
    {
      path: '/transaction',
      name: 'transaction',
      component: () => import(/* webpackChunkName: "about" */ './views/Transaction.vue'),
      children: [
        {
          path: ':id',
          component: () => import(/* webpackChunkName: "about" */ './components/TransactionDetail.vue'),
        }
      ]
    },
    {
      path: '/product/:id',
      name: 'productDetail',
      component: () => import(/* webpackChunkName: "about" */ './views/ProductDetail.vue'),
    },
    {
      path: '/products',
      name: 'allproducts',
      component: () => import(/* webpackChunkName: "about" */ './views/ProductPage.vue'),
      children: [
        {
          path: '/me',
          component: () => import(/* webpackChunkName: "about" */ './components/Products.vue'),
        },
        {
          path: '/all',
          component: () => import(/* webpackChunkName: "about" */ './components/Products.vue'),
        },
        {
          path: '/favorite',
          component: () => import(/* webpackChunkName: "about" */ './components/Products.vue'),
        },
        {
        path: ':category',
        component: () => import(/* webpackChunkName: "about" */ './components/Products.vue'),
      }]
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import(/* webpackChunkName: "about" */ './views/Cart.vue'),
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import(/* webpackChunkName: "about" */ './views/Auth.vue'),
    },
    {
      path: '/profile/edit',
      name: 'editprofile',
      component: () => import(/* webpackChunkName: "about" */ './views/EditProfile.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import(/* webpackChunkName: "about" */ './views/Auth.vue'),
      children: [
        
      ]
    },
    {
      path: '/sell',
      name: 'sell',
      component: () => import(/* webpackChunkName: "about" */ './views/Sell.vue'),
    },
    {
      path: '*',
      name: 'notfound',
      component: () => import(/* webpackChunkName: "about" */ './views/NotFound.vue'),
    },
  ],
});
