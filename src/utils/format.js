import ejs from 'ejs'

export function columnsGene(data) {
  // TODO: ejs用法有问题
  let template = `<% for(var i = 0; i < Object.keys(data).length; ++i) {%>
    { prop: '<%=fruits[key]%>s', label: '' }<% } %>`
  let inject = ejs.render(data, template)
  
  return `export const columns = [
    {
      label: '序号',
      attr: { type: 'index' },
    },
    ${inject}
  ]`
}

const defaultForm = `
export function formInit(data = {}) {
  return {`


export function formatResult(objectRes) {
  return toColumns(objectRes) + toFormInit(objectRes)
}

function  columnsItemTemp(value) {
  return `,
  {
    prop: ${value},
    label: ''
  }`
}

function toColumns(objectRes = {}) {
  let columnsTemplate = defaultColumns
  Object.keys(objectRes).forEach(item => {
    columnsTemplate += columnsItemTemp(item)
  })
  return columnsTemplate + `
]`
}

function toFormInit(objectRes = {}) {
  let formTemplate = defaultForm
  Object.keys(objectRes).forEach(item => {
    formTemplate += `
    ${item}: '', `
  })
  return formTemplate + `
      ...data
    }
  }
  `
}