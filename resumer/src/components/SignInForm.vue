<template>
  <div>
    <form @submit.prevent="signIn"  class="form">
      <div class="row">
        <label>用户名</label>
        <br>
        <input type="text" required v-model="formData.username">
      </div>
      <div class="row">
        <label>密码</label>
        <br>
        <input type="password" required v-model="formData.password">
      </div>
      <div class="actions">
        <input type="submit" value="登录">
        <span>{{errorMessage}}</span>
      </div>
    </form>
  </div>
</template>

<script>
import AV from '../lib/leancloud'
import getErrorMessage from '../lib/getErrorMessage'
import getAVUser from '../lib/getAVUser'
export default {
  name: 'SignInForm',
  data(){
    return {
      formData: {
        username: '',
        password: ''
      },
      errorMessage: ''
    }
  },
  methods: {
    signIn(){
      let {username, password} = this.formData
      AV.User.logIn(username,password).then(()=> {
        this.$emit('success', getAVUser())
      }, (error)=> {
        this.errorMessage = getErrorMessage(error)
      });
    }
  }
}
</script>

<style lang="scss">
  .form{
    display: flex;
    flex-direction: column;
    input{
      margin-top: 5px;
      margin-bottom: 5px;
    }
    .actions{
      align-self: flex-end;
      >span{
        color: red;
      }
    }
  }
</style>