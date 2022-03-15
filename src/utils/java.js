import { toHump, normalFields } from './index'
function java2Proto(data, MessageName, repeatedMap) {
  const paramName = MessageName.includes('Item') ? MessageName.replace('Item', '') : MessageName
  let dataKeys = Object.keys(data)
  const repeatedKeys = dataKeys.filter((item) => repeatedMap[item])
  const keys = dataKeys
    .filter((item) => item !== 'id')
    .filter((item) => !repeatedKeys.includes(item))
    .map((item) => toHump(item))
  let template = ''
  repeatedKeys.forEach((item) => {
    const humpKey = toHump(item).replace(/s([^s]*)$/, '')
    item = item.replace(/s([^s]*)$/, '')
    template += `List<String> ${item}JsonList = JSON.parseArray(entity.get${humpKey}s(), String.class);
      List<${humpKey}> ${item}List = new ArrayList<>();
      for (String ${item}Json : ${item}JsonList) {
        ${humpKey}.Builder ${item}Builder = ${humpKey}.newBuilder();
        JsonFormat.parser().ignoringUnknownFields().merge(${item}Json, ${item}Builder);
        ${item}List.add(${item}Builder.build());
      }
      builder.addAll${humpKey}s(${item}List);\n\t\t\t`
  })
  keys.forEach(
    (item) => (template += `if (entity.get${item}() != null) builder.set${item}(entity.get${item}()); \n\t\t\t`),
  )
  return `public static ${MessageName} model2pb(${paramName} entity) {
  try {
      ${MessageName}.Builder builder = ${MessageName}.newBuilder();
      builder.setId(entity.getId());
      ${template}
      return builder.build();
  } catch (Exception ex) {
    ex.printStackTrace();
    log.info("model2pb error: {}", entity);
    return null;
  }
}
  `
}

function proto2Java(data, MessageName, repeatedMap, ruleMap) {
  let dataKeys = Object.keys(data)
  const repeatedKeys = dataKeys.filter((item) => repeatedMap[item])
  const ruleKeys = dataKeys
    .filter((item) => !normalFields.includes(ruleMap[item]))
    .filter((item) => !repeatedKeys.includes(item))
  const keys = dataKeys
    .filter((item) => !repeatedKeys.includes(item))
    .filter((item) => !ruleKeys.includes(item))
    .map((item) => toHump(item))
  let template = ''
  keys.forEach((item) => (template += `entity.set${item}(pbEntity.get${item}()) \n\t\t`))
  ruleKeys.forEach((item) => {
    item = toHump(item)
    template += `entity.set${item}(pbEntity.get${item}Value());\n\t\t`
  })
  // 数组字段
  repeatedKeys.forEach((item) => {
    const humpKey = toHump(item).replace(/s([^s]*)$/, '')
    item = item.replace(/s([^s]*)$/, '')
    template += `List<String> ${item}JsonList = new ArrayList<>();
    for (${humpKey} ${item} : pbEntity.get${humpKey}sList()) {
      ${item}JsonList.add(toJson(${item}));
    }
    entity.set${humpKey}s(JSON.toJSONString(${item}JsonList));\n\t\t`
  })

  const paramName = MessageName.includes('Item') ? MessageName.replace('Item', '') : MessageName
  return `public static ${paramName} pb2model(${MessageName} pbEntity, Integer createUser) {
  try {
    ${template}
    return entity;
  } catch (Exception ex) {
    ex.printStackTrace();
    log.info("pb2model error: {}", toJson(pbEntity));
    return null;
  }
}
    `
}
export { java2Proto, proto2Java }
