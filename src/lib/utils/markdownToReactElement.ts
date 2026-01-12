import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeReact from 'rehype-react'
import { CustomLink } from 'src/components/CustomLink'
import { CustomImage } from 'src/components/CustomImage'
import * as prod from 'react/jsx-runtime'

const production = { Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs }

export const markdownToReactElement = (content: string) => {
  return remark()
    .use(remarkGfm) // GFM(https://github.github.com/gfm/)に変換
    .use(remarkRehype, {
      allowDangerousHtml: true,
    }) // mdastをhastに変換
    .use(rehypeRaw) // markdownに直接書かれたタグを表示させる
    .use(rehypeReact, {
      ...production,
      components: {
        a: CustomLink,
        img: CustomImage,
      },
    } as any) // hastをReactElementに変換.
    // 型定義の互換性がないためanyを使用
    .processSync(content).result
}
