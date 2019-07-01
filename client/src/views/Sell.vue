<template>
  <form @submit.prevent="addProduct" enctype="multipart/form-data" class="col-6 mx-auto">
  <h1>Add Product</h1>
    <div class="form-group">
      <label for="formGroupExampleInput">Name</label>
      <input
      v-model="name"
        type="text"
        class="form-control"
        placeholder="Name"
        required
      >
    </div>
    <div class="form-group">
      <label for="formGroupExampleInput">Category</label>
      <input
        v-model="category"
        type="text"
        class="form-control"
        placeholder="Category"
        required
      >
    </div>
    <div class="form-group">
    <label for="exampleFormControlTextarea1">Description</label>
    <textarea v-model="description" class="form-control" id="exampleFormControlTextarea1" placeholder="Description" rows="5" required></textarea>
  </div>
        <img v-show="imagePreview" :src="imagePreview" style="height:300px;width:300px;" alt="Preview Image">
    <div class="custom-file my-3">
                      <input @change="selectFile" type="file" class="custom-file-input" id="customFile">
                      <label class="custom-file-label" for="customFile">Choose file for product</label>
                    </div>
    <div class="form-group">
      <label for="formGroupExampleInput2">Price</label>
      <input
      v-model="price"
        type="number"
        min="1000"
        class="form-control"
        id="formGroupExampleInput2"
        placeholder="Another input"
        required
      >
    </div>
    <div class="form-group">
      <label for="formGroupExampleInput2">Stock</label>
      <input
      v-model="stock"
        type="number"
        min="1"
        max="1000"
        class="form-control"
        id="formGroupExampleInput2"
        placeholder="Another input"
        required
      >
    </div>
    <button type="submit" class="btn btn-primary">Add Product</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      category: '',
      description: '',
      image_url: '',
      price: 1000,
      stock: 100,
      imagePreview: '',
    };
  },
  methods: {
    addProduct() {
      const produk = new FormData();
      produk.append('name', this.name);
      produk.append('category', this.category);
      produk.append('description', this.description);
      produk.append('image_url', this.image_url);
      produk.append('price', this.price);
      produk.append('stock', this.stock);

      this.$store.dispatch('addProduct', produk)
      .then(data =>{
        this.name = ''
        this.category = ''
        this.description = ''
        this.image_url = ''
        this.imagePreview = ''
        this.price = 1000
        this.stock = 100
      })
    },
    selectFile(event) {
      if (event.target.files[0]/* event.target.files &&  */) {
        this.image_url = event.target.files[0];
        const ini = this;
        const reader = new FileReader();
        reader.onload = function (e) {
          ini.imagePreview = e.target.result;
        };
        reader.readAsDataURL(event.target.files[0]);
      }
    },
    logout() {
      this.$store.commit('logout');
    },
  },
};
</script>
