<template>
  <div class="col-lg-9">
    <div class="row mt-4">
      <ProductItem v-for="product in products" :product="product" :key="product._id"/>
    </div>
  </div>
</template>
<script>
import ProductItem from "@/components/Product.vue";
import { mapState } from "vuex";

export default {
  components: {
    ProductItem
  },
  // props: ['products'],
  computed:{
    products(){
        if(this.$route.params.me){
          let temp = []
          this.$store.state.products.forEach(product => {
        if(product.seller == this.$store.state.user.id){
          temp.push()
            }
         });
          return temp
        }
        else{
           return this.$store.state.products}
      },
  },
  created() {
  }
};
</script>
