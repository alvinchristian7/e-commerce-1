<template>
  <div id="landing-page">
    <div class="card" style="margin-left:400px;margin-right:400px;">
      <div>
        <button @click="showRegisterPage=true" ref="register" type="button" class="btn btn-success">Register</button>
        <button @click="showRegisterPage=false" ref="login" type="button" class="btn btn-primary">Login</button>
      </div>
      <LogRegForm v-show="showRegisterPage" @submitted="register" title="Register">
        <div class="form-group">
          <label for="exampleInputName1">Name</label>
          <input
            v-model="name"
            type="text"
            class="form-control"
            id="exampleInputName1"
            placeholder="Enter name"
          />
        </div>
        <textarea v-model="address" class="form-control" id="exampleFormControlTextarea1" placeholder="Address" rows="3" required></textarea>
        <div class="custom-file my-3">
          <input @change="selectFile" type="file" class="custom-file-input" id="inputRegisterImage" />
          <label class="custom-file-label" for="inputRegisterImage">Choose file</label>
        </div>
      </LogRegForm>
      <LogRegForm v-show="!showRegisterPage" @submitted="login" title="Login" />
    </div>
  </div>
</template>
<script>
import LogRegForm from "@/components/LogRegForm.vue";

export default {
  name: "logreg",
  components: {
    LogRegForm
  },
  // computed: mapState(['logRegStatus']),
  data() {
    return {
      showRegisterPage: true,
      name: "",
      image: '',
      address: ''
    };
  },
  watch:{
    '$store.state.logRegStatus.registered'(newVal){
      if(newVal)
        this.$refs.login.click()
    }
  },
  created() {
    if (localStorage.getItem("role") == "admin") {
      this.$router.push("/admin");
    }
  },
  methods: {
    selectFile() {
      if (event.target.files[0])
        this.image = event.target.files[0];
    },
    register(email, password) {
      let formData = new FormData()
      formData.append('name',this.name)
      formData.append('address',this.address)
      formData.append('email',email)
      formData.append('password',password)
      formData.append('image_url',this.image)
      this.$store.dispatch("register", formData);
      this.name = "";
      this.address = "";
      this.image = ''
      document.getElementById("inputRegisterImage").value = null;
    },
    login(email, password) {
      this.$store.dispatch("login", {
        email,
        password
      });
    }
  }
};
</script>
<style scoped>
#landing-page {
  position: relative;
  background: url("../assets/background.jpg") no-repeat center center fixed;
  height: 100vh;
  top: -70px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
