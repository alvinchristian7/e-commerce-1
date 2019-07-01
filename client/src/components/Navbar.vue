<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
    <div class="container">
      <div class="row align-items-center">
        <router-link class="navbar-brand" to="/"><img src="../assets/navbar-brand.jpg" width="50" height="50" alt="E-Kokomerce"><span class="mx-4">E-Kokomerce</span></router-link>
      </div>
      
      <form @submit.prevent="searchProducts" class="form-inline">
        <input
          v-model="searchText"
          class="form-control mr-sm-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
        >
        <button class="btn btn-secondary my-2 my-sm-0" type="submit">Search</button>
      </form>

      <div class="collapse navbar-collapse" id="navbarResponsive">
        <ul class="navbar-nav mx-auto align-items-center">
          
        </ul>
        <ul class="navbar-nav align-items-center">
          <li class="nav-item">
            <router-link to="/products/all" class="nav-link">All Products</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/cart" class="nav-link"><i class="fas fa-shopping-cart white-text"></i></router-link>
          </li>
          <li class="nav-item">
            <div class="dropdown">
              <a @click="getNotif" href="#" class="nav-link dropdown-toggle" role="button" data-toggle="dropdown"><i class="fas fa-bell white-text"></i></a>
              <div class="dropdown-menu light-blue lighten-4">
      <a class="dropdown-item-text font-weight-bold text-center" href="#">Notifications</a>
      <div class="dropdown-divider"></div>
      <div v-show="loadingNotif" class="text-center">
        <div class="spinner-grow" role="status"></div>
      </div>
      <a @click="$router.push('/product/'+notif.product)" v-show="!loadingNotif" v-for="(notif, index) in $store.state.notifications" :key="index" class="dropdown-item" href="#">{{ notif.description }}</a>
    </div>
            </div>
          </li>
          <li class="nav-item">
            <div class="dropdown">
              <a
                    class="nav-link dropdown-toggle"
                    href="#"
                    id="navbarDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <img
                      :src="imgPreview"
                      class="rounded-circle float-right"
                      alt="Your Profile Image"
                      style="height:50px; width: 50px;"
                    >
                  </a>
                  <div class="dropdown-menu" aria-labelledby="navbarDropdown" style="margin-top:25px;">
            <router-link to="/sell" class="dropdown-item">Sell</router-link>
            <div class="dropdown-divider"></div>
            <router-link to="/transaction" class="dropdown-item">My Transaction</router-link>
            <router-link to="/products/me" class="dropdown-item">My Products</router-link>
            <router-link to="/products/favorite" class="dropdown-item">My Favorites</router-link>
            <div class="dropdown-divider"></div>
                    <router-link to="/profile/edit" class="dropdown-item">Edit Profile</router-link>
                    <a class="dropdown-item" href="#">Setting</a>
                    <div class="dropdown-divider"></div>
                    <a @click="logout" class="dropdown-item" href="#">Logout</a>
                  </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script>
export default {
  data() {
    return {
      searchText: "",
      loadingNotif: false
    };
  },
  computed: {
    imgPreview(){
      if(this.$store.state.user.image_url)
        return this.$store.state.user.image_url
      else
        return 'https://via.placeholder.com/150'
    }
  },
  methods: {
    logout() {
      this.$store.commit("logout");
    },
    searchProducts() {
      this.$store.dispatch("getAllProducts", {
        name: this.searchText
      })
      .then(data =>{
        this.$router.push('/products/all')
      })
      .catch(err =>{
        console.log(err);
      })
      // this.$router.push("/products");
    },
    getNotif(){
      this.loadingNotif = true
      this.$store.dispatch('getNotif')
      .then((data)=>{
        this.loadingNotif = false
      })
      .catch(err =>{
        console.log(err);
      })
    }
  }
};
</script>
