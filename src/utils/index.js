import { parse } from 'protobufjs'
let messageNameReg = /(message|enum)\s+(\S+)\s*{/

const normalFields = [
  'double', 'float', 'int32', 'int64', 'uint32', 'uint64', 'sint32', 'sint64', 'fixed32', 'fixed64', 'sfixed32', 'sfixed64', 'bool', 'string', 'bytes'
]

function parseRoot(content, MessageName) {
  let proto = `
    syntax = "proto3";
    package packageName;
    ${content}
  `
  let AwesomeMessage
  try {
    let root = parse(proto, {
      keepCase: true,
      alternateCommentMode: true,
    }).root
    AwesomeMessage = root.lookupType(`packageName.${MessageName}`)
  } catch(e) {
    console.log(e)
    return ''
  }
  return AwesomeMessage
}

function regGene(name) {
  return new RegExp(`[^\n]+${name}[^\n]+`, 'gm')
}

function uniqArray(arr) {
  return Array.from(new Set(arr))
}

export function parseProto(content) {
  if (!content) return ''
  let MessageNameMatch = content.match(messageNameReg)
  if (!MessageNameMatch) {
    return 'message name error'
  }
  let MessageName = MessageNameMatch[2]
  let AwesomeMessage = parseRoot(content, MessageName)

  if (!AwesomeMessage) return ''

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

  console.log(nestedMap, 'nestedMap')

  let unknowFieldList = fieldsArray.filter(item => !normalFields.includes(item.type) && !nestedMap[item.type])
  let unknowNameList = unknowFieldList.map(item => item.name)
  let unknowTypeList = uniqArray(unknowFieldList.map(item => item.type))
  console.log(unknowTypeList, 'unknowTypeList')
  if (unknowTypeList.length) {
    unknowTypeList.forEach(item => {
      content = content.replace(regGene(item), '')
    })
    AwesomeMessage = parseRoot(content, MessageName)
  }

  let payload = {}
  // ignore unknow type
  fieldsArray.forEach(item => {
    if (!unknowNameList.includes(item.name)) {
      payload[item.name] = ''
    }
  })

  let errMsg = AwesomeMessage.verify(payload)
  if (errMsg) console.log(errMsg, 'verify error')

  let message = AwesomeMessage.create(payload)

  let buffer = AwesomeMessage.encode(message).finish();

  let messageRes = AwesomeMessage.decode(buffer)
  let finalRes = {}
  let object = AwesomeMessage.toObject(messageRes, {
    longs: String,
    enums: Number,
    bytes: String,
    int32: String,
    int64: String,
    // see ConversionOptions
  })
  if (unknowNameList.length) {
    unknowNameList.forEach(item => {
      object[item] = ''
    })
  }
  finalRes.data = object
  let nestResList = []
  Object.keys(nestedMap).forEach(key => {
    let nestRes = {}
    let cur = nestedMap[key]
    let {
      valuesById,
      comments
    } = cur
    for (let nKey in valuesById) {
      nestRes[nKey] = comments[valuesById[nKey]]
    }
    nestResList.push({
      name: cur.name,
      data: nestRes
    })
  })
  finalRes.nestResList = nestResList
  console.log(finalRes, 'finalRes')
  return finalRes
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