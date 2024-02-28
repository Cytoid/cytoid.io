export function compressRecordId(chartId: number, recordId: number) {
  const base36Num1 = chartId.toString(36)
  const base36Num2 = recordId.toString(36)

  return `${base36Num1}-${base36Num2}`
}

export function decompressRecordId(compressedId: string) {
  const [base36Num1, base36Num2] = compressedId.split('-')
  const chartId = Number.parseInt(base36Num1, 36)
  const recordId = Number.parseInt(base36Num2, 36)

  return { chartId, recordId }
}
