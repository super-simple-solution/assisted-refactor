<template>
  <div class="proto-container">
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
          language="javascript"
          @editor-did-mount="editor2DidMount"
        />
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
          v-model="data.result"
          url="https://fe-modules.oss-cn-beijing.aliyuncs.com/monaco-editor-0.20.0/min"
          :options="data.editOption"
          :style="data.editStyle"
          class="editor"
          theme="vs-dark"
          language="javascript"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { formInitGene, columnsGene, enumGene, mockDataGene } from '@/utils/format'
import MonacoEditor from 'vue-monaco-cdn'
import registerProtobuf from 'monaco-proto-lint'
import { parseProto } from '@/utils'

// parseProto(csontent)
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

watch(
  () => data.text,
  (value) => {
    let objectRes = parseProto(value)
    let dataRes = columnsGene(objectRes.data)
    dataRes += '\n' + formInitGene(objectRes.data)
    dataRes += '\n' + mockDataGene(objectRes.data)
    dataRes += '\n' + objectRes.nestResList.map((item) => enumGene(item)).join('\n')
    data.result = dataRes
    editor2.getAction('editor.action.formatDocument').run()
  },
)
</script>
