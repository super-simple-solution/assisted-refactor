<template>
  <div class="proto-container">
    <a-row :gutter="10">
      <a-col :span="12" class="input-text">
        <monaco-editor
          url="https://fe-modules.oss-cn-beijing.aliyuncs.com/monaco-editor-0.20.0/min"
          @editorDidMount="editorDidMount"
          :options="data.editOption"
          :style="data.editStyle"
          class="editor"
          ref="source"
          v-model="data.text"
          theme="vs-dark"
          language="protobuf" />
        <div class="m10">
          <a-button danger class="mr10" @click="clear">
            <template #icon>
              <clear-outlined />
            </template>
            清空
          </a-button>
          <a-button type="primary" @click="format">
            <template #icon>
              <format-painter-outlined />
            </template>
            格式化
          </a-button>
        </div>
      </a-col>
      <a-col span="12" class="input-text">
        <monaco-editor
          url="https://fe-modules.oss-cn-beijing.aliyuncs.com/monaco-editor-0.20.0/min"
          :options="data.editOption"
          :style="data.editStyle"
          class="editor"
          v-model="data.result"
          theme="vs-dark"
          language="javascript" />
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { parseProto } from '@/utils'
import MonacoEditor from 'vue-monaco-cdn'
import registerProtobuf from 'monaco-proto-lint'
import { ref, reactive } from 'vue'

parseProto(content)

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
  registerProtobuf(monaco)
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