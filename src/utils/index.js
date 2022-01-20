import { parse } from 'protobufjs'
let messageNameReg = /(message|enum)\s(\S+)\s*{/

export function parseProto(content) {
  let MessageName = content.match(messageNameReg)[2]
  if (!MessageName) {
    return 'message name error'
  }
  // let MessageName = 'LocationEx'
  let proto = `
    package packageName;
    ${content}
`

// console.log(proto, 'proto')

let root = parse(proto).root

let res1 = root.lookup("Greeter")
console.log(res1)

let AwesomeMessage = root.lookupType(`packageName.${MessageName}`)
console.log(AwesomeMessage.fields, 'AwesomeMessage.fields')

let payload = {}
Object.keys(AwesomeMessage.fields).forEach(item => {
  payload[item] = ''
})

console.log(payload, 'payload')

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
  console.log(object, 'object')
}