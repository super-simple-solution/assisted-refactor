<template>
  <div>
    <a-row :gutter="10">
      <a-col :span="12" class="input-text">
        <monaco-editor url="https://fe-modules.oss-cn-beijing.aliyuncs.com/monaco-editor-0.20.0/min" @editorDidMount="editorDidMount" :options="data.editOption" :style="data.editStyle" class="editor" ref="source" v-model="data.text" theme="vs-dark" language="proto" />
        <a-button danger icon="a-icon-delete" class="bt-op" @click="clear">清空</a-button>
        <a-button type="primary" icon="a-icon-document" class="bt-op" @click="format">格式化</a-button>
      </a-col>
      <a-col span="12" class="input-text">
        <monaco-editor url="https://fe-modules.oss-cn-beijing.aliyuncs.com/monaco-editor-0.20.0/min" :options="data.editOption" :style="data.editStyle" class="editor" v-model="data.result" theme="vs-dark" language="js" />
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import MonacoEditor from 'vue-monaco-cdn'
import { ref, reactive } from "vue"
let data = reactive({
  loading: true,
  text: '',
  result: '',
  editOption: {
    automaticLayout: true
  },
  editStyle: {
    height: window.innerHeight - 150 + 'px'
  },
})
let source = ref(null)
let editor = null
function editorDidMount() {
  editor = source.value.getMonaco()
  data.loading = false
}
function format() {
  editor.getAction('editor.action.formatDocument').run()
}
function clear() {
  data.text = ''
  data.result = ''
}
</script>

<style lang="scss" scoped>

</style>