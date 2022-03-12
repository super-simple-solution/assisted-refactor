import { formInitGene, columnsGene, enumGene, mockDataGene } from '@/utils/format'
export function formatJavaScriptResultData(objectRes) {
  let dataRes = ''
  dataRes += '\n' + columnsGene(objectRes.data, objectRes.commentMap)
  dataRes += '\n' + formInitGene(objectRes.data)
  dataRes += '\n' + mockDataGene(objectRes.data)
  dataRes += '\n' + objectRes.nestResList.map((item) => enumGene(item)).join('\n')
  return dataRes
}

import { java2Proto, proto2Java } from '@/utils/java'
export function formatJavaResultData(objectRes) {
  let dataRes = ''
  dataRes += '\n' + java2Proto(objectRes.data, objectRes.MessageName, objectRes.repeatedMap)
  dataRes += '\n' + proto2Java(objectRes.data, objectRes.MessageName, objectRes.repeatedMap, objectRes.typeMap)
  return dataRes
}
