import Vue from 'vue';
import Vuex from 'vuex';
import axios from '@/axios';
// import { stat } from 'fs';
import Swal from 'sweetalert2';
import router from '@/router';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    logRegStatus: {
      registered: false,
      loggedIn: localStorage.hasOwnProperty('access-token') && localStorage.getItem('role') !== 'admin',
    },
    products: [],
    query: {
      seller: '',
      favorite: '',
      name: '',
      category: '',
      tags: [],
    },
    categories: [],
    user: {},
    notifications: [],
    transactions: []
  },
  mutations: {
    setNotif(state, payload) {
      state.notifications = [...payload]
    },
    setUserInfo(state, payload) {
      console.log(payload);

      state.user = { ...payload }
    },
    registered(state, payload) {
      state.logRegStatus.registered = true;
      Swal.fire(
        'Registered!',
        'User Registered!',
        'success',
      );
    },
    loggedIn(state, payload) {
      localStorage.setItem('access-token', payload['access-token']);
      localStorage.setItem('name', payload.name);
      localStorage.setItem('role', payload.role);
      if (payload.role == 'admin') {
        state.logRegStatus.loggedIn = false;
        router.push('/admin');
      } else {
        Swal.fire(
          'Logged in!',
          'You have been logged in!',
          'success',
        );
        state.logRegStatus.loggedIn = true;
        router.push('/');
      }
    },
    logout(state) {
      localStorage.removeItem('access-token');
      localStorage.removeItem('name');
      localStorage.removeItem('role');
      state.logRegStatus.loggedIn = false;
      router.push('/auth');
    },
    getAllProducts(state, payload) {
      state.products = [...payload]
    },
    getAllTransactions(state, payload){
      state.transactions = [...payload]
    },
    getAllCategories(state, payload) {
      let categories = payload.map(obj => obj.category)
      console.log(categories);

      state.categories = [...new Set(categories)];
    },
    changeQuery(state, payload) {
      if (payload) {
        for (let key in payload) {
          state.query[key] = payload[key]
        }
      }
      else {
        for (let key in state.query) {
          state.query[key] = ''
        }
      }
    }
  },
  actions: {
    updateTransaction(context,payload) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'patch',
          url: `/transaction/${payload.id}`,
          data: payload,
          headers: {
            'access-token': localStorage.getItem('access-token'),
          },
        })
          .then(({ data }) => {
            context.dispatch('addNotif', {
              id: data._id,
              description: payload.status
            })
            Swal.fire(
              'Transaction Status Changed!',
              payload.status,
              'success',
            );
            resolve(data)
          })
          .catch(({ response }) => {
            Swal.fire(
              'Error!',
              response.data.message,
              'error'
            )
            reject(response.data.message)
          });
      })
    },
    addTransaction(context,payload) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'POST',
          url: `/transaction`,
          data: payload,
          headers: {
            'access-token': localStorage.getItem('access-token'),
          },
        })
          .then(({ data }) => {
            context.dispatch('getAllProducts')
            context.dispatch('addNotif', {
              id: data._id,
              description: `You've successfully paid your transaction, please wait for seller to send the package(s)`
            })
            Swal.fire(
              'Payment success!',
              'Please wait for seller to send the package(s)!',
              'success',
            );
            resolve(data)
          })
          .catch(({ response }) => {
            Swal.fire(
              'Error!',
              response.data.message,
              'error'
            )
            reject(response.data.message)
          });
      })
    },
    getAllTransactions(context,payload) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'GET',
          url: `/transaction`,
          headers: {
            'access-token': localStorage.getItem('access-token'),
          },
        })
          .then(({ data }) => {
            context.commit('getAllTransactions',data)
            resolve(data)
          })
          .catch(({ response }) => {
            Swal.fire(
              'Error!',
              response.data.message,
              'error'
            )
            reject(response.data.message)
          });
      })
    },
    changeFav(context, payload) {
      return new Promise((resolve,reject)=>{
        axios({
          method: 'patch',
          url: `/product/favorite/${payload.id}`,
          data: {
            changeFav: payload.changeFav
          },
          headers: {
            'access-token': localStorage.getItem('access-token'),
          },
        })
          .then(({ data }) => {
            if(!payload.changeFav) {
              context.dispatch('addNotif',{
                id: payload.id,
                description: `You've added ${payload.name} to your favorites`
              })
            }
            else {
              context.dispatch('addNotif',{
                id: payload.id,
                description: `You've removed ${payload.name} from your favorites`
              })
            }
            resolve(data)
          })
          .catch(({ response }) => {
            Swal.fire(
              'Error!',
              response.data.message,
              'error'
            )
            reject(response.data.message)
          });
        })
    },
    addNotif(context, payload) {
      axios({
        method: 'POST',
        url: '/notification',
        data: {
          product: payload.id,
          description: payload.description
        },
        headers: {
          "access-token": localStorage.getItem("access-token")
        }
      })
        .then(({ data }) => {

        })
        .catch(({ response }) => {
          Swal.fire(
            'Error!',
            response.data.message,
            'error',
          );
        });
    },
    getNotif(context) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'GET',
          url: '/notification',
          headers: {
            "access-token": localStorage.getItem("access-token")
          }
        })
          .then(({ data }) => {
            context.commit('setNotif', data);
            resolve(data)
          })
          .catch(({ response }) => {
            Swal.fire(
              'Error!',
              response.data.message,
              'error',
            );
            reject(response.data.message)
          });
      })
    },
    checkLogin(context, payload) {
      if (localStorage.getItem("access-token")) {
        axios({
          method: "GET",
          url: "/user/me",
          headers: {
            "access-token": localStorage.getItem("access-token")
          }
        })
          .then(({ data }) => {
            console.log(data);

            context.commit('setUserInfo', data)
            context.dispatch('getAllProducts')
          })
          .catch(({ response }) => {
            Swal.fire(
              'Error!',
              response.data.message,
              'error',
            );
          });
      } else {
        router.push('/auth')
      }
    },
    register(context, payload) {
      axios({
        method: 'POST',
        url: '/user/register',
        data: payload,
        headers: {
          'content-type': 'multipart/formdata'
        }
      })
        .then(({ data }) => {
          context.commit('registered', data);
          context.dispatch('checkLogin')
        })
        .catch(({ response }) => {
          Swal.fire(
            'Error!',
            response.data.message,
            'error',
          );
        });
    },
    login(context, payload) {
      axios({
        method: 'POST',
        url: '/user/login',
        data: payload,
      })
        .then(({ data }) => {
          context.commit('loggedIn', data);
          context.dispatch('checkLogin')
          router.push('/')
        })
        .catch(({ response }) => {
          Swal.fire(
            'Error!',
            response.data.message,
            'error',
          );
        });
    },
    addProduct(context, payload) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'POST',
          url: '/product',
          data: payload,
          headers: {
            'access-token': localStorage.getItem('access-token'),
          },
        })
          .then(({ data }) => {
            Swal.fire(
              'Added!',
              'Product has been added!',
              'success',
            );
            context.dispatch('addNotif', {
              id: payload.id,
              description: `You've added ${data.name} to your shop`
            })
            resolve(data)
          })
          .catch(({ response }) => {
            Swal.fire(
              'Error!',
              response.data.message,
              'error'
            )
            reject(response.data.message)
          });
      })
    },
    getAllProducts(context, payload) {
      return new Promise((resolve, reject) => {
      context.commit('changeQuery', payload)

      let query = []
      for (let key in context.state.query) {
        if (context.state.query[key]) {
          if (typeof context.state.query[key] == 'object') {
            query.push(key + '=' + context.state.query[key].join(','))
          }
          else
            query.push(key + '=' + context.state.query[key])
        }
      }

      query = query.join('&')
      if (query)
        query = '?' + query
      console.log(query);

      axios({
        method: 'GET',
        url: `/product${query}`,
        headers: {
          'access-token': localStorage.getItem('access-token'),
        },
      })
        .then(({ data }) => {
          context.commit('getAllProducts', data);
          if (!context.state.query['category']) {
            context.commit('getAllCategories', data)
          }
          resolve(data)
        })
        .catch(({ response }) => {
          Swal.fire(
            'Error!',
            response.data.message,
            'error'
          )
          reject(response.data.message)
        });
      })
    },
    addToCart(context, payload) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'POST',
          url: `/cart/upsert/${payload.id}`,
          data: {
            count: payload.count
          },
          headers: {
            'access-token': localStorage.getItem('access-token'),
          },
        })
          .then(({ data }) => {
            context.dispatch('getAllProducts')
            context.dispatch('addNotif', {
              id: payload.id,
              description: `You've added ${payload.name} to your cart`
            })
            Swal.fire(
              'Added!',
              'Product has been added!',
              'success',
            );
            resolve(data)
          })
          .catch(({ response }) => {
            Swal.fire(
              'Error!',
              response.data.message,
              'error'
            )
            reject(response.data.message)
          });
      })
    },
    changeCount(context, payload) {
      axios({
        method: 'POST',
        url: `/cart/upsert/${payload.id}`,
        data: {
          count: payload.count
        },
        headers: {
          'access-token': localStorage.getItem('access-token'),
        },
      })
        .then(({ data }) => {
          context.dispatch('checkLogin');
        })
        .catch(({ response }) => {
          Swal.fire(
            'Error!',
            response.data.message,
            'error'
          )
        });
    },
    deleteCart(context, payload) {
      axios({
        method: 'PUT',
        url: `/cart/delete/${payload.id}`,
        data: {
          count: payload.count
        },
        headers: {
          'access-token': localStorage.getItem('access-token'),
        },
      })
        .then(({ data }) => {
          context.dispatch('checkLogin');
          context.dispatch('addNotif', {
            id: payload.id,
            description: `You've removed ${payload.name} from your cart`
          })
        })
        .catch(({ response }) => {
          Swal.fire(
            'Error!',
            response.data.message,
            'error'
          )
        });
    },
  },
  // getters: {
  //   produksiap: state => {
  //     return state.products
  //   }
  // }
});
