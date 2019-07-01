<template>
  <div class="container my-2">
    <div class="card-deck mb-4">
      <div v-show="checkout" class="card">
        <div class="card-body">
          <h1>Your Information</h1>
          <div class="form-group row">
              <label class="col-lg-3 col-form-label">Name:</label>
              <div class="col-lg-8">
                <input v-model="user.name" class="form-control" type="text" disabled>
              </div>
            </div>
            <div class="form-group row">
              <label class="col-lg-3 col-form-label">Address:</label>
              <div class="col-lg-8">
                <textarea v-model="user.address" class="form-control" id="exampleFormControlTextarea1" placeholder="Address" rows="5" disabled></textarea>
              </div>
            </div>
            <div class="form-group row">
              <label class="col-lg-3 col-form-label">Email:</label>
              <div class="col-lg-8">
                <input v-model="user.email" class="form-control" type="text" disabled>
              </div>
            </div>
        </div>
      </div>
      <div v-for="(kart, sellerID, index) in cart" :key="index" class="card" >
        <h1 class="green lighten-4"><i class="fas fa-city"></i> {{ shopName(sellerID) }}</h1>
      <ul class="list-group">
        <li v-for="keranjang in kart" class="list-group-item list-group-item-action d-flex flex-row" :key="keranjang._id">
          <router-link :to="'/product/'+keranjang.product._id" class="ml-4 my-auto">
          <img
            class="my-auto"
            :src="keranjang.product.image_url"
            :alt="keranjang.product.name"
            height="60"
            width="60"
          />
          {{ keranjang.product.name }}</router-link>
          <div v-show="checkout" class="row align-items-center ml-auto mr-3">
            <p class="col-4">Qty: {{ keranjang.totalCount }}</p>
            <p class="col-8">
              Rp. {{ keranjang.totalPrice }}
            </p>
            </div>
          <div v-show="!checkout" class="row ml-auto">
            <!-- <p>Total barang : {{ keranjang.totalCount }}</p> -->
            <div class="col">
              <div class="form-group">
                <number-input
                  :value="keranjang.totalCount"
                  @change="onChange($event, keranjang.totalCount,keranjang.product._id)"
                  :min="1"
                  inline
                  center 
                  controls
                ></number-input>
                <!-- <select class="form-control" @change="onChange($event,keranjang.totalCount,keranjang.product._id)" id="exampleFormControlSelect1">
                  <option v-for="index in keranjang.product.stock" :selected="index===keranjang.totalCount" :key="index">{{ index }}</option>
                </select>-->
              </div>
              <p>Total harga : {{ keranjang.totalPrice }}</p>
            </div>
            <a
              @click.prevent="deleteCart(keranjang.product.name, keranjang.product._id,keranjang.totalCount)"
              href="#"
              class="my-auto mx-3"
            >
              <i class="fas fa-trash-alt fa-2x red-text"></i>
            </a>
          </div>
        </li>
      </ul>
      </div>
    </div>
    <h3>SubTotal : {{ subTotal }}</h3>
    <h3>Total Product : {{ totalProduct }}</h3>
    <button @click="confirm" :class="['btn', checkout ? 'btn-success' : 'btn-info']">{{ confirmText }}</button>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      value: 1,
      checkout: false,
      confirmText: 'Proceed to checkout'
    };
  },
  computed:{
    subTotal(){
      let temp = 0
      for(let keranjang of this.user.cart){
        temp += keranjang.totalPrice
      }
      return temp
    },
    totalProduct(){
      let temp = 0
      for(let keranjang of this.user.cart){
        temp += keranjang.totalCount
      }
      return temp
    },
    cart(){
      let temp = {}
      for(let keranjang of this.user.cart){
        if(!temp[keranjang.product.seller._id])
          temp[keranjang.product.seller._id] = []
        temp[keranjang.product.seller._id].push(keranjang)
      }
      return temp
    },
    ...mapState(['user'])
  },
  created() {
    this.$store.dispatch("checkLogin");
  },
  methods: {
    shopName(sellerID){
      let keranjang = this.user.cart.find(keranjang => keranjang.product.seller._id == sellerID)
      return keranjang.product.seller.name
    },
    confirm(){
      if(this.checkout == false){
        this.checkout = true
        this.confirmText = 'Confirm Payment'
      }
      else {
        let promiseAll = []
        for(let sellerID in this.cart){
          promiseAll.push(this.$store.dispatch('addTransaction',{
            seller: sellerID,
            products: this.cart[sellerID],
            subTotal: this.subTotal
          }))
        }
        Promise.all(promiseAll).then(results =>{
          this.$router.push('/transaction')
        })
        .catch(err =>{
          console.log(err);
          
        })
      }
    },
    onChange(event, countBefore, id) {
      console.log(event, countBefore, id);
      
      this.$store.dispatch("changeCount", {
        count: event - countBefore,
        id
      });
    },
    deleteCart(name, id, count) {
      this.$store.dispatch("deleteCart", { name, id, count });
    }
  }
};
</script>
