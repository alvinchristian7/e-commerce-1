<template>
  <div class="container">
    <div v-show="isLoading" class="text-center">
      <div class="spinner-border spinner-border-lg" role="status"></div>
    </div>
    <div v-show="!isLoading">
      <div v-for="keranjang in transaction.products" :key="keranjang.product._id" class="card mb-3">
      <router-link :to="'/product/'+keranjang.product._id">
        <div class="row no-gutters">
          <div class="col-md-4">
            <img :src="keranjang.product.image_url" class="card-img" :alt="keranjang.product.name" />
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">Product Name: {{ keranjang.product.name }}</h5>
              <p class="card-text">Qty : {{ keranjang.totalCount }}</p>
              <p class="card-text">
                <small class="text-muted">Total : Rp. {{ keranjang.totalPrice }}</small>
              </p>
            </div>
          </div>
        </div>
      </router-link>
      </div>
      <div class="row">
        <div :class="statusColor + ' lighten-3'" class="card col-8">
          <div class="card-body">
            Status : {{ transaction.status }}
          </div>
        </div>
        <div class="card col-4">
          <div class="card-body">
          Subtotal : Rp. {{ transaction.subTotal }}
          </div>
        </div>
      </div>
      <button v-show="transaction.confirmation == isWho" @click="statusChange" class="btn btn-success">{{ statusAction }}</button>
    </div>
  </div>
</template>

<script>
import axios from "@/axios";

export default {
  data() {
    return {
      isLoading: true,
      transaction: {
        status: ''
      }
    };
  },
  computed:{
    statusColor(){
      if(this.transaction.status.search(/waiting/i) !== -1) return 'yellow'
      if(this.transaction.status.search(/sent/i) !== -1) return 'grey'
      if(this.transaction.status.search(/completed/i) !== -1) return 'green'
      else return 'red'
    },
    isWho(){
      if(this.transaction.seller._id == this.$store.state.user._id){
        return 'seller'
      }
      else
        return 'buyer'
    },
    statusAction(){
      if(this.isWho == 'seller'){
        return 'I have sent the package(s)'
      }
      else {
        return 'I have received the package(s)'
      }
    }
  },
  created() {
    this.getTransaction();
  },
  methods: {
    statusChange(){
      let confirmation = '', status = ''
      if(this.isWho == 'buyer'){
        confirmation = 'none'
        status = `Transaction Completed`
        }
      else{
        confirmation = 'buyer'
        status = `Package has been sent by seller, please confirm when your package(s) arrived`
        }

      this.$store.dispatch('updateTransaction', {
        id: this.$route.params.id,
        confirmation,
        status
      })
      .then(data =>{
        this.transaction = { ...data };
      })
      .catch(err =>{
        console.log(err);
        
      })
    },
    getTransaction() {
      axios({
        method: "get",
        url: "/transaction/" + this.$route.params.id,
        headers: {
          "access-token": localStorage.getItem("access-token")
        }
      })
        .then(({ data }) => {
          this.isLoading = false;
          this.transaction = { ...data };
        })
        .catch(({ response }) => {
          Swal.fire("Error!", response.data.message, "error");
        });
    }
  }
};
</script>

<style>
</style>
