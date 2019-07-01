<template>
  <div class="col-lg-4 col-md-6 mb-4">
    <div class="card h-100">
        <a @click="changeFav(product.name, product._id)" href="#" :class="favorited ? 'fas' : 'far'" class="pink-text fa-heart fa-2x m-4 position-absolute"></a>
      <router-link :to="'/product/'+product._id">
        <img class="card-img-top" :src="product.image_url" :alt="product.name" height="200">
      </router-link>
      <div class="card-body">
        <h4 class="card-title">
          <router-link :to="'/product/'+product._id">{{ product.name }}</router-link>
        </h4>
        <h5>Rp. {{ product.price }}</h5>
        <p class="card-text">Qty : {{ product.stock }}</p>
      </div>
      <div class="btn-group" role="group" aria-label="Basic example">
        <button v-if="product.seller !== $store.state.user._id" @click="addToCart(product.name, product._id)" type="button" :class="['btn', product.stock > 0 ? 'btn-primary' : 'btn-secondary disabled']">
          <i class="fas fa-cart-plus mr-3"></i>
          <span v-show="showLoading" class="spinner-border spinner-border-sm" role="status"></span>{{ buttonText }}
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showLoading: false,
      favorited: false
    };
  },
  props: ['product'],
  computed:{
    buttonText(){
      if(this.showLoading){
        return ''
      }
      else {
        if(this.product.stock == 0) {
        return 'Out of Stock'
      }
      else {
        return 'Add to Cart'
      }
      }
    }
  },
  created(){
    if(this.product.favorite.indexOf(this.$store.state.user._id) == -1){
      this.favorited = false
    }
    else
      this.favorited = true
  },
  methods: {
    changeFav(name, id) {
      this.$store
        .dispatch("changeFav", {
          id,
          name,
          changeFav: this.favorited
        })
        .then(() => {
          if (this.favorited) {
            this.favorited = false;
          } else {
            this.favorited = true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    addToCart(name, id){
      this.showLoading = true
      this.$store.dispatch('addToCart',{
        id,
        name,
        count: 1
        })
      .then(()=>{
        this.showLoading = false
      })
      .catch((err)=>{
        console.log(err)
        this.showLoading = false
      })
    }
  }
};
</script>
