import { remark } from 'remark'
import stripMarkdown from 'strip-markdown'

export const extractDescription = (
  markdown: string,
  length: number = 120,
): string => {
  const plainText = remark()
    .use(stripMarkdown)
    .processSync(markdown)
    .toString()
    .replace(/\n+/g, ' ')
    .trim()

  if (plainText.length <= length) return plainText
  return plainText.slice(0, length) + '…'
}
