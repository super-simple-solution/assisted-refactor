<template>
  <div class="proto-container">
    <div class="m10 flex">
      <div>
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
      <a-select v-model:value="language" style="width: 120px">
        <a-select-option value="javascript"> JavaScript </a-select-option>
        <a-select-option value="java"> Java </a-select-option>
      </a-select>
    </div>
    <a-row :gutter="10">
      <a-col :span="12" class="input-text">
        <monaco-editor
          ref="source1"
          v-model="data.text"
          url="https://fe-modules.oss-cn-beijing.aliyuncs.com/monaco-editor-0.20.0/min"
          :options="data.editOption"
          :style="data.halfEditStyle"
          class="editor"
          theme="vs-dark"
          language="protobuf"
          @editor-did-mount="editor1DidMount"
        />
        <monaco-editor
          ref="source2"
          v-model="data.template"
          url="https://fe-modules.oss-cn-beijing.aliyuncs.com/monaco-editor-0.20.0/min"
          :options="data.editOption"
          :style="data.halfEditStyle"
          class="editor mt10"
          theme="vs-dark"
          :language="language"
          @editor-did-mount="editor2DidMount"
        />
      </a-col>
      <a-col span="12" class="input-text">
        <monaco-editor
          v-model="data.result"
          url="https://fe-modules.oss-cn-beijing.aliyuncs.com/monaco-editor-0.20.0/min"
          :options="data.editOption"
          :style="data.editStyle"
          class="editor"
          theme="vs-dark"
          :language="language"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import MonacoEditor from 'vue-monaco-cdn'
import registerProtobuf from 'monaco-proto-lint'
import { parseProto } from '@/utils'
import { formatJavaScriptResultData, formatJavaResultData } from './index'
import { watch } from 'vue'

// parseProto(csontent)
let language = ref('javascript')
let data = reactive({
  loading: true,
  text: '',
  template: '',
  result: '',
  editOption: {
    automaticLayout: true,
    tabSize: 2,
  },
  editStyle: {
    height: window.innerHeight - 60 + 'px',
  },
  halfEditStyle: {
    height: (window.innerHeight - 70) / 2 + 'px',
  },
})
let source1 = ref(null)
let source2 = ref(null)
let editor1 = null
let editor2 = null
window.editor2 = editor2
function editor1DidMount() {
  editor1 = source1.value.getMonaco()
  window.editor1 = editor1
  editor1.focus()
  // support protobuf syntax
  registerProtobuf(window.monaco)
  data.loading = false
}
function editor2DidMount() {
  editor2 = source2.value.getMonaco()
  window.editor2 = editor2
}
function format() {
  editor1.getAction('editor.action.formatDocument').run()
  editor2.getAction('editor.action.formatDocument').run()
}
function clear() {
  data.text = ''
  data.template = ''
  data.result = ''
}
watch(language, () => {
  dataResFun(data.text)
})
watch(
  () => data.text,
  (value) => {
    dataResFun(value)
  },
)

function dataResFun(value) {
  let objectRes = parseProto(value)
  let dataRes = ''
  if (language.value === 'javascript') {
    dataRes = formatJavaScriptResultData(objectRes)
  } else if (language.value === 'java') {
    dataRes = formatJavaResultData(objectRes)
  }
  data.result = dataRes
  editor2.getAction('editor.action.formatDocument').run()
}
</script>
