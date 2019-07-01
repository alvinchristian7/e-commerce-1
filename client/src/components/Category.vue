<template>
  <router-link :to="'/products/' + category" class="list-group-item">{{category}}</router-link>
</template>
<script>
export default {
  
  props: ['category']
  // methods: {
  //   fetchCategory(){
  //     this.$store.dispatch('getCategory',this.$route.params.category)
  //   }
  // },
  // created() {
  //   this.fetchCategory();
  // },
  // watch: {
  //   $route() {
  //     this.fetchCategory();
  //   }
  // }
}
</script>
