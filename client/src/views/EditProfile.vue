<template>
  <div class="container mt-4">
    <h1>Edit Profile</h1>
  	<hr>
	<div class="row">
      <!-- left column -->
      <div class="col-md-3">
        <div class="text-center">
          <img :src="imgPreview" class="avatar img-circle" alt="avatar" width="150" height="150">
          <h6>Upload a different photo...</h6>
          
          <div class="custom-file">
                      <input @change="selectFile" type="file" class="custom-file-input" id="customFile">
                      <label class="custom-file-label" for="customFile">Choose file</label>
                    </div>
        </div>
      </div>
      
      <!-- edit form column -->
      <div class="col-md-9 personal-info">
        <!-- <div class="alert alert-info alert-dismissable">
          <a class="panel-close close" data-dismiss="alert">×</a> 
          <i class="fa fa-coffee"></i>
          This is an <strong>.alert</strong>. Use this to show important messages to the user.
        </div> -->
        <h3>Personal info</h3>
        <hr>
        <form class="form-horizontal" role="form">
          <div class="form-group row">
            <label class="col-lg-3 col-form-label">Name:</label>
            <div class="col-lg-8">
              <input v-model="user.name" class="form-control" type="text" required>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-3 col-form-label">Address:</label>
            <div class="col-lg-8">
              <textarea v-model="user.address" class="form-control" id="exampleFormControlTextarea1" rows="3" placeholder="Your Address" required></textarea>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-lg-3 col-form-label">Email:</label>
            <div class="col-lg-8">
              <input v-model="user.email" class="form-control" type="text" required>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-md-3 col-form-label">Old Password:</label>
            <div class="col-md-8">
              <input v-model="user.oldPass" class="form-control" type="password" required>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-md-3 col-form-label">New Password:</label>
            <div class="col-md-8">
              <input v-model="user.password" class="form-control" type="password" required>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-md-3 col-form-label"></label>
            <div class="col-md-8">
              <input @click="updateProfile" type="button" class="btn btn-primary" value="Save Changes">
            </div>
          </div>
        </form>
      </div>
  </div>
</div>
</template>
<script>
import axios from '../axios.js'

export default {
  data(){
    return {
      user: {
        name: '',
        address: '',
        email: '',
        password: '',
        imagePreview: '',
        oldPass: '',
        image: '',
      }
    }
  },
  computed: {
    imgPreview(){
      if(this.user.imagePreview)
        return this.user.imagePreview
      else
        return 'https://via.placeholder.com/150'
    }
  },
  created(){
    this.user.name = this.$store.state.user.name
    this.user.address = this.$store.state.user.address
    this.user.email = this.$store.state.user.email
    this.user.password = this.$store.state.user.password
    this.user.imagePreview = this.$store.state.user.image_url
  },
  methods: {
    selectFile(event) {
      if (event.target.files[0]/* event.target.files &&  */) {
        this.user.image = event.target.files[0]
        // var newVue = this
        var reader = new FileReader()
        reader.onload = (e) => {
          this.user.imagePreview = e.target.result
        }
        reader.readAsDataURL(event.target.files[0])
      }
    },
    updateProfile() {
      let formData = new FormData()
        formData.append('name',this.user.name)
        formData.append('address',this.user.address)
        formData.append('email',this.user.email)
        formData.append('password',this.user.password)
        formData.append('image_url',this.user.image)
      axios({
        method: "patch",
        url: `/user/me`,
        data: formData,
        headers: {
          'content-type': 'multipart/formdata',
          'access-token': localStorage.getItem('access-token'),
        }
      })
        .then(({ data }) => {
          this.$store.dispatch('checkLogin')
          this.user.password = "";
          this.user.oldPass = "";
          Swal.fire({
            type: "success",
            title: "Updated!",
            showConfirmButton: false,
            timer: 2000
          });
        })
        .catch(({ response }) => {
          this.user.password = "";
          this.user.oldPass = "";
          Swal.fire("Error", response.data.message, "error");
        });
    },
  }
}
</script>
