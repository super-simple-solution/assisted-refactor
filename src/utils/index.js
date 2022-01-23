import { parse } from 'protobufjs'
let messageNameReg = /(message|enum)\s+(\S+)\s*{/

const normalFields = [
  'double', 'float', 'int32', 'int64', 'uint32', 'uint64', 'sint32', 'sint64', 'fixed32', 'fixed64', 'sfixed32', 'sfixed64', 'bool', 'string', 'bytes'
]

export function parseProto(content) {
  if (!content) return ''
  let MessageNameMatch = content.match(messageNameReg)
  if (!MessageNameMatch) {
    return 'message name error'
  }
  let MessageName = MessageNameMatch[2]
  let proto = `
    syntax = "proto3";
    package packageName;
    ${content}
`
let root = null
try {
  root = parse(proto, {
    keepCase: true,
  }).root
} catch(e) {
  console.log(e)
  return ''
}

let AwesomeMessage = root.lookupType(`packageName.${MessageName}`)

let {
  nestedArray,
  fieldsArray
} = AwesomeMessage

let fieldsMap = {}
fieldsArray.forEach(item => {
  fieldsMap[item.name] = item.type
})
let nestedMap = {}
nestedArray.forEach(item => {
  nestedMap[item.name] = item
})

let unknowTypeNameList = fieldsArray.filter(item => !normalFields.includes(item.type) && !nestedMap[item.type]).map(item => item.name)

let payload = {}
// ignore unknow type
fieldsArray.forEach(item => {
  if (!unknowTypeNameList.includes(item.name)) {
    payload[item.name] = ''
  }
})

let errMsg = AwesomeMessage.verify(payload)
if (errMsg) console.log(errMsg, 'verify error')

let message = AwesomeMessage.create(payload)

let buffer = AwesomeMessage.encode(message).finish();

let messageRes = AwesomeMessage.decode(buffer)
let object = AwesomeMessage.toObject(messageRes, {
      longs: String,
      enums: Number,
      bytes: String,
      int32: String,
      int64: String,
      // see ConversionOptions
  })
  let res = format(object)
  console.log(res, 'res')
  return res
}

function format(obj) {
    let str = JSON.stringify(obj, 0, 2)
    let arr = str.match(/".*?":/g)
    for(var i = 0; i < arr.length; i++) {
      str = str.replace(arr[i], arr[i].replace(/"/g,''))
    }
    return str
}

export function jsonStringify(obj) {
  return JSON.stringify(obj, function(k, v) {
    if (typeof v === 'function' || v instanceof RegExp) {
      return v.toString()
    }
    return v
  })
}

export function jsonParse(string) {
  return JSON.parse(string, function(k, v) {
    try {
      if (typeof v === 'string') {
        if (v.indexOf('=>') !== -1) {
          v = new Function(` return (${v}).apply(null, arguments)`)
        }
        // TODO regex format check
        // not /www
        if (v.match && v.match(/^\/|\/$/) && v.length > 1) {
          let lastIndex = v.lastIndexOf('/')
          let flag = v.slice(lastIndex + 1)
          v = new RegExp(v.slice(1, lastIndex), flag)
        }
      }
      return v
    } catch (e) {
      console.log(string, '\n', e.message)
    }
  })
}