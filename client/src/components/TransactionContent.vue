<template>
  <div class="row">
    <div class="col-4">
      <div v-show="isLoading" class="text-center">
        <div class="spinner-border spinner-border-lg" role="status"></div>
      </div>
      <div v-show="!isLoading" class="list-group">
        <router-link :to="'/transaction/'+transaction._id" v-for="transaction in transactions" :key="transaction._id" :class="statusColor(transaction.confirmation) + ' lighten-3'" class="list-group-item list-group-item-action flex-column align-items-start">
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-3 h5">{{ transaction[showAs].name }}</h5>
            <small class="grey-text">{{ createdAt(transaction.createdAt) }}</small>
          </div>
          <ul>
            <li v-for="keranjang in transaction.products" :key="keranjang.product._id">
              <router-link :to="'/product/'+keranjang.product._id">
                {{ keranjang.product.name }}
              </router-link>
            </li>
          </ul>
          <small>Total : Rp. {{ transaction.subTotal }}</small>
        </router-link>
      </div>
    </div>
    <div class="col-8">
      <router-view />
    </div>
  </div>
</template>

<script>
import moment from "moment";
moment.locale('id')

export default {
  props: ["as"],
  data() {
    return {
      showAs: '',
      isLoading: true
    };
  },
  computed: {
    transactions() {
      if(this.as == 'buyer')
        this.showAs = 'seller'
      else
        this.showAs = 'buyer'

      let temp = this.$store.state.transactions.filter(
        obj => obj[this.as]._id == this.$store.state.user._id
      );
      return temp;
    },
    
  },
  created() {
    this.$store
      .dispatch("getAllTransactions")
      .then(data => {
        this.isLoading = false;
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    statusColor(confirmation){
  if(confirmation == this.as) return 'yellow'
  else if(confirmation == 'none') return 'green' 
  else return 'grey'
    },
    createdAt(date){
      return moment(date).format('LLL')
    }
  }
};
</script>

<style>
</style>
