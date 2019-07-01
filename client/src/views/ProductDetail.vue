<template>
  <div class="container">
    <div v-show="isLoading" class="text-center">
      <div class="spinner-border spinner-border-lg" role="status"></div>
    </div>
    <div v-show="!isLoading">
      <div class="card">
        <div class="row">
          <a class="col-3 m-3" href="#">
            <img class="img-fluid" :src="product.image_url" :alt="product.name" />
          </a>
          <div class="col-8">
            <div class="card-body">
              <h1 class="card-title">{{ product.name }}</h1>
              <h5>Rp. {{ product.price }}</h5>
              <p class="card-text">Qty : {{ product.stock }}</p>
              <number-input v-model="count" :min="1" inline center controls></number-input>
            </div>
            <div class="btn-group" role="group" aria-label="Basic example">
              <button
                @click="changeFav(product.name, product._id)"
                :class="['btn', favorited ? 'btn-danger' : 'btn-outline-danger', 'mr-3']"
                type="button"
                style="width: 230px;"
              >
                <i class="fas fa-heart pink-text"></i>
                {{ favText }}
              </button>
              <button
                v-if="product.seller !== $store.state.user._id"
                @click="addToCart(product.name, product._id)"
                type="button"
                class="btn btn-primary"
                style="width: 230px;"
              >
                <i v-show="!showLoading" class="fas fa-cart-plus mr-3"></i>
                <span v-show="showLoading" class="spinner-border spinner-border-sm" role="status"></span>
                {{ buttonText }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="card h-100">
        <div class="card-body">{{ product.description }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "@/axios";

export default {
  data() {
    return {
      product: {},
      count: 1,
      isLoading: true,
      showLoading: false,
      buttonText: "Add to Cart",
      favText: "Add To Favorite",
      favorited: false
    };
  },
  // computed: {
  //   favorited() {
  //     if (this.product.favorite.indexOf(this.$store.state.user._id) == -1) {
  //       return false;
  //     } else return true;
  //   }
  // },
  watch: {
    $route(to, from) {
      console.log(to, from);
    }
  },
  created() {
    this.isLoading = true;
    this.getProduct();
  },
  methods: {
    getProduct() {
      axios({
        method: "get",
        url: "/product/" + this.$route.params.id,
        headers: {
          "access-token": localStorage.getItem("access-token")
        }
      })
        .then(({ data }) => {
          this.isLoading = false;
          if (data.favorite.indexOf(this.$store.state.user._id) == -1) {
            this.favText = "Add To Favorite";
            this.favorited = false;
          } else {
            this.favText = "Favorited!";
            this.favorited = true;
          }
          this.product = { ...data };
        })
        .catch(({ response }) => {
          Swal.fire("Error!", response.data.message, "error");
        });
    },
    addToCart(name, id) {
      this.buttonText = "";
      this.showLoading = true;
      this.$store
        .dispatch("addToCart", {
          id,
          name,
          count: this.count
        })
        .then(() => {
          this.getProduct();
          this.showLoading = false;
          this.buttonText = "Add to Cart";
        })
        .catch(err => {
          console.log(err);
          this.showLoading = false;
          this.buttonText = "Add to Cart";
        });
    },
    changeFav(name, id) {
      this.$store
        .dispatch("changeFav", {
          id,
          name,
          changeFav: this.favorited
        })
        .then(() => {
          if (this.favorited) {
            this.favText = "Add To Favorite";
            this.favorited = false;
          } else {
            this.favText = "Favorited!";
            this.favorited = true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
