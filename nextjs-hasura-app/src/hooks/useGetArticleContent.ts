import { useState } from 'react'
import { remark } from 'remark';
import html from 'remark-html';


const markdownToHtml = async (content: string) => {
  const result = await remark().use(html).process(content)

  return result.value.toString()
}

export const useGetArticleContent = (markdonw: string) => {
  const [content, setContent] = useState<string>('')
  markdownToHtml(markdonw).then((value) => {
    setContent(value)
  })

  return content
}