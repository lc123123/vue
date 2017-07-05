import Vue from 'vue'
import AV from 'leancloud-storage'

var APP_ID = 'yOEvjXRJ4WIx63WJvlI1FWtn-gzGzoHsz';
var APP_KEY = 'ggwuekoxBB63uLtlLN93C0zh';
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

var app = new Vue({
  el: '#app',
  data: {
    actionType: 'login',
    formData: {
      username: '',
      password: '',
    },
    newTodo: '',
    todoList: [],
    currentUser: null,
  },
  created: function () {
    this.currentUser = this.getCurrentUser();
    this.fetchTodos()
  },
  methods: {
    toggleFinish: function (todo) {
      todo.isFinished = !todo.isFinished
      this.saveOrUpdateTodos()
    },

    fetchTodos: function () {
      if (this.currentUser) {
        var query = new AV.Query('AllTodos');
        query.find()
          .then((todos) => {
            let avAllTodos = todos[0]
            let id = avAllTodos.id
            this.todoList = JSON.parse(avAllTodos.attributes.content)
            this.todoList.id = id
          }, function (error) {
            console.log(error)
          })
      }
    },
    updateTodos: function () {
      let dataString = JSON.stringify(this.todoList)
      let avTodos = AV.Object.createWithoutData('AllTodos', this.todoList.id)
      avTodos.set('content', dataString)
      avTodos.save().then(() => {
        console.log('更新成功')
      })
    },
    saveTodos: function () {
      let dataString = JSON.stringify(this.todoList)
      var AVTodos = AV.Object.extend('AllTodos');
      var avTodos = new AVTodos();
      var acl = new AV.ACL()
      acl.setReadAccess(AV.User.current(), true)
      acl.setWriteAccess(AV.User.current(), true)

      avTodos.set('content', dataString);
      avTodos.setACL(acl)
      avTodos.save().then((todo) => {
        this.todoList.id = todo.id
        console.log('保存成功')
      }, function (error) {
        alert('保存失败')
      });
    },
    saveOrUpdateTodos: function () {
      if (this.todoList.id) {
        this.updateTodos()
      } else {
        this.saveTodos()
      }
    },
    saveOldList: function () {
      this.oldList = this.todoList
    },
    filterAll: function () {
      if (this.oldList === undefined) {
        return
      } else {
        this.todoList = this.oldList
      }
    },
    filterTodo: function () {
      this.filterAll()
      this.saveOldList()
      let tdList = []
      for (var i = 0; i < this.todoList.length; i++) {
        let result = this.todoList[i]
        if (result.isFinished === false) {
          tdList.push(result)
        }
      }
      this.todoList = tdList
    },
    filterFinished: function () {
      this.filterAll()
      this.saveOldList()
      let finList = []
      for (var i = 0; i < this.todoList.length; i++) {
        let result = this.todoList[i]
        if (result.isFinished === true) {
          finList.push(result)
        }
      }
      this.todoList = finList
    },
    addTodo: function () {
      if (this.newTodo === '') {
        alert('输入内容不能为空')
        return
      }
      this.todoList.push({
        title: this.newTodo,
        createdAt: new Date().toLocaleString(),
        isFinished: false
      })
      this.newTodo = ''
      this.saveOrUpdateTodos()
    },
    removeTodo: function (todo) {
      let index = this.todoList.indexOf(todo)
      this.todoList.splice(index, 1)
      this.saveOrUpdateTodos()
    },
    signUp: function () {
      let user = new AV.User();
      user.setUsername(this.formData.username);
      user.setPassword(this.formData.password);
      user.signUp().then((loginedUser) => {
        this.currentUser = this.getCurrentUser()
      }, (error) => {
        alert('注册失败')
        console.log(error)
      });
    },
    login: function () {
      AV.User.logIn(this.formData.username, this.formData.password).then((loginedUser) => {
        this.currentUser = this.getCurrentUser()
        this.fetchTodos()
      }, function (error) {
        alert('登录失败')
        console.log(error)
      });
    },
    getCurrentUser: function () {
      let current = AV.User.current()
      if (current) {
        let { id, createdAt, attributes: { username } } = current
        return { id, username, createdAt } 
      } else {
        return null
      }
    },
    logout: function () {
      AV.User.logOut()
      this.currentUser = null
      window.location.reload()
    }
  }
})                                                               
