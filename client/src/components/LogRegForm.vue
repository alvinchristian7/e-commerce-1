<template>
  <form @submit.prevent="submitForm" class="col-4 mx-auto">
    <h1>{{ title }}</h1>
    <slot></slot>
    <div class="form-group">
      <label for="exampleInputEmail1">Email address</label>
      <input v-model="email" type="email" class="form-control" aria-describedby="emailHelp" placeholder="Enter email">
    </div>
    <div class="form-group">
      <label for="exampleInputPassword1">Password</label>
      <input v-model="password" type="password" class="form-control" placeholder="Password">
    </div>
    <button type="submit" class="btn btn-primary">Submit</button>
</form>
</template>
<script>
export default {
  props: ['title'],
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    submitForm(){
      this.$emit('submitted',this.email,this.password)
      this.email = ''
      this.password = ''
    }
  }
};
</script>
