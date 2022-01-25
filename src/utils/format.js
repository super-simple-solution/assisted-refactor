import ejs from 'ejs'
import { formatObj } from './index'

// TODO 根据使用场景生成不同模板gene template

function columnsGene(data) {
  let keys = Object.keys(data)
  let template = `<% for(let i = 0; i < keys.length; ++i) {%>
    { prop: '<%=keys[i]%>', label: '' },<% } %>`
  let inject = ejs.render(template, { keys })
  
  return `export const columns = [
    {
      label: '序号',
      attr: { type: 'index' },
    },${inject}
  ]`
}

function formInitGene(data) {
  let keys = Object.keys(data)
  let template = `<% for(let i = 0; i < keys.length; ++i) {%>
    <%=keys[i]%>: '', <% } %>`
  let inject = ejs.render(template, { keys })
  return `export function formInit(data = {}) {
    data = data || {}
    return {${inject}
      ...data
    }
  }`
}

function enumGene(data) {
  return `export const ${data.name} = ${formatObj(data.data)}`
}

function mockDataGene(data) {
  let keys = Object.keys(data)
  let template = `<% for(let i = 0; i < keys.length; ++i) {%>
    <%=keys[i]%>: '', <% } %>`
    let inject = ejs.render(template, { keys })
  return `export const mockData = {
    ${inject}
  }`
}

export {
  columnsGene,
  formInitGene,
  enumGene,
  mockDataGene
}
