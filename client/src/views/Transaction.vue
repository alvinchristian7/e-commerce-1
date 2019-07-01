<template>
  <div class="container">
    <nav>
  <div class="nav nav-tabs" id="nav-tab" role="tablist">
    <a @click="$router.push('/transaction')" class="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">Buyer</a>
    <a @click="$router.push('/transaction')" class="nav-item nav-link" id="nav-profile-tab" data-toggle="tab" href="#nav-profile" role="tab" aria-controls="nav-profile" aria-selected="false">Seller</a>
  </div>
</nav>
<div class="tab-content" id="nav-tabContent">
  <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
    <TransactionContent :as="'buyer'"/>
  </div>
  <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
    <TransactionContent :as="'seller'"/>
  </div>
</div>
  </div>
</template>

<script>
import TransactionContent from '@/components/TransactionContent.vue'
export default {
  components: {
    TransactionContent
  },
}
</script>

<style>

</style>
