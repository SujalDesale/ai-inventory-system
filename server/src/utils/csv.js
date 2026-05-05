import { Parser } from 'json2csv'
export function toCSV(json) {
  const parser = new Parser()
  return parser.parse(json)
}
