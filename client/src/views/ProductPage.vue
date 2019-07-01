<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-3">
        <h1 class="my-4">{{ title }}</h1>
        <div class="list-group">
          <Category v-for="category in categories" :category="category" :key="category" />
        </div>
      </div>
      <router-view />
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
// import Product from '@/components/Product.vue';
import Category from '@/components/Category.vue';
import axios from '@/axios'

export default {
  name: 'allproducts',
  components: {
    // Product,
    Category,
  },
  data() {
    return {
      title: 'All Products'
      // products: []
    };
  },
    computed: {
      ...mapState(['categories'])
      },
  watch: {
    $route(to, from){
      if(this.$route.path == '/products/me'){
          this.title = 'My Products'
          this.getProducts({
            id: this.$store.state.user._id
            })
          }
    else if(this.$route.path == '/products/favorite'){
          this.title = 'Favorite Products'
          this.getProducts({
            favorite: this.$store.state.user._id
          })
          }
          else {
this.title = 'All Products'
          this.getProducts()
          }
    }
  },
  created() {
    if (!this.$store.state.logRegStatus.loggedIn) {
      this.$router.push('/auth');
    }
  },
  methods: {
    getProducts(query){
      if(query){
        if(query.id){
        this.$store.dispatch('getAllProducts',{
          seller: query.id
        })
      }
      else if(query.favorite) {
        this.$store.dispatch('getAllProducts',{
          favorite: query.favorite
        })
      }
      }
      else {
        if(this.$route.params.category == 'all')
          this.$store.dispatch('getAllProducts')
        else
          this.$store.dispatch('getAllProducts',{
            category: this.$route.params.category
            })
      }
    }
  }
};
</script>
