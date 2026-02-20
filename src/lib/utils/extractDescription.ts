export const extractDescription = (
  markdown: string,
  length: number = 120,
): string => {
  const plainText = markdown
    .replace(/```[\s\S]*?```/g, '') // コードブロック除去
    .replace(/`[^`]*`/g, '') // インラインコード除去
    .replace(/!\[.*?\]\(.*?\)/g, '') // 画像除去
    .replace(/\[([^\]]*)\]\(.*?\)/g, '$1') // リンク → テキスト
    .replace(/#{1,6}\s+/g, '') // 見出し記号除去
    .replace(/[*_~>]+/g, '') // 装飾記号除去
    .replace(/\n+/g, ' ') // 改行 → スペース
    .trim()

  if (plainText.length <= length) return plainText
  return plainText.slice(0, length) + '…'
}
