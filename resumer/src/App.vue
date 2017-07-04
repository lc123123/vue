<template>
  <div class="page">
    <header>
      <Topbar/>
    </header>
    <main>
      <ResumeEditor/>
      <ResumePreview/>
    </main>
  </div>
</template>

<script>
import 'normalize.css/normalize.css'
import './assets/reset.css'
import Topbar from './components/Topbar.vue'
import ResumeEditor from './components/ResumeEditor.vue'
import ResumePreview from './components/ResumePreview.vue'
export default {
  name: 'app',
  data: function () {
    return {
      text: '你好'
    }
  },
  components: { Topbar, ResumeEditor, ResumePreview }
}
</script>

<style>
.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #EAEBEC;
}

.page>main {
  flex-grow: 1;
}

.page>main {
  min-width: 1024px;
  max-width: 1440px;
  margin-top: 16px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
  width: 100%;
  align-self: center;
}

#resumeEditor {
  width: 35%;
  background: #444;
}

#resumePreview {
  flex-grow: 1;
  margin-left: 16px;
  background: #777;
}
</style>