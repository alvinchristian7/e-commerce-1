<template>
  <div class="container">
    <h1 class="mt-4">Featured Products</h1>
    <div class="row">

      <div class="col-lg">

        <div class="card">
          <div id="carouselExampleIndicators" class="carousel slide my-4" data-ride="carousel">
            <ol class="carousel-indicators">
              <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
              <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
              <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
            </ol>
            <div class="carousel-inner" role="listbox">
              <div class="carousel-item active">
                <router-link :to="'/product/'+ products[0]._id"><img class="d-block" :src="products[0].image_url" alt="First slide" width="900" height="350"></router-link>
              </div>
              <div class="carousel-item">
                <router-link :to="'/product/'+ products[1]._id"><img class="d-block" :src="products[1].image_url" alt="Second slide" width="900" height="350"></router-link>
              </div>
              <div class="carousel-item">
                <router-link :to="'/product/'+ products[2]._id"><img class="d-block" :src="products[2].image_url" alt="Third slide" width="900" height="350"></router-link>
              </div>
            </div>
            <div>
              <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                <span class="fas fa-caret-left fa-5x cyan-text" aria-hidden="true"></span>
                <span class="sr-only">Previous</span>
              </a>
              <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                <span class="fas fa-caret-right fa-5x cyan-text" aria-hidden="true"></span>
                <span class="sr-only">Next</span>
              </a>
            </div>
          </div>
        </div>

        <div class="row mt-4">
          <h1>Popular Products</h1>
          <Products/>

        </div>
        <!-- /.row -->

      </div>
      <!-- /.col-lg-9 -->

    </div>
    <!-- /.row -->

  </div>
</template>

<script>
// @ is an alias to /src
import Products from '@/components/Products.vue';
import { mapState } from 'vuex'

export default {
  name: 'home',
  components: {
    Products,
  },
  computed: mapState(['products']),
  created() {
    if (!this.$store.state.logRegStatus.loggedIn) {
      this.$router.push('/auth');
    }
  },
};
</script>
