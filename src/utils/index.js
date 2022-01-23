import { parse } from 'protobufjs'
let messageNameReg = /(message|enum)\s(\S+)\s*{/

export function parseProto(content) {
  let MessageName = content.match(messageNameReg)[2]
  if (!MessageName) {
    return 'message name error'
  }
  let proto = `
    syntax = "proto3";
    package packageName;
    ${content}
`

let root = parse(proto).root

let res1 = root.lookup("Greeter")

let AwesomeMessage = root.lookupType(`packageName.${MessageName}`)

let payload = {}
Object.keys(AwesomeMessage.fields).forEach(item => {
  payload[item] = ''
})

let errMsg = AwesomeMessage.verify(payload)
if (errMsg) console.log(errMsg, 'verify error')

let message = AwesomeMessage.create(payload)

let buffer = AwesomeMessage.encode(message).finish();

let messageRes = AwesomeMessage.decode(buffer)
let object = AwesomeMessage.toObject(messageRes, {
      longs: String,
      enums: String,
      bytes: String,
      // see ConversionOptions
  })
  let res = jsonStringify(object)
  console.log(res, 'res')
  return jsonStringify(res)
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