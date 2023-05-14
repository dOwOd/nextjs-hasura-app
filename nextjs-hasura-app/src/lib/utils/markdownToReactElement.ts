import { createElement, Fragment } from 'react'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype/lib'
import rehypeRaw from 'rehype-raw'
import rehypeReact from 'rehype-react'
import { CustomLink } from 'src/components/CustomLink'
import { CustomImage } from 'src/components/CustomImage'

export const markdownToReactElement = (content: string) => {
  return remark()
    .use(remarkGfm) // GFM(https://github.github.com/gfm/)に変換
    .use(remarkRehype, {
      allowDangerousHtml: true,
    }) // mdastをhastに変換
    .use(rehypeRaw) // markdownに直接書かれたタグを表示させる
    .use(rehypeReact, {
      Fragment,
      components: {
        a: CustomLink,
        img: CustomImage,
      },
      createElement,
    }) // hastをReactElementに変換
    .processSync(content).result
}
