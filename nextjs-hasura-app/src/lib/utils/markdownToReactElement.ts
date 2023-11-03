import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeReact from 'rehype-react'
import { CustomLink } from 'src/components/CustomLink'
import { CustomImage } from 'src/components/CustomImage'
import * as prod from 'react/jsx-runtime'

// @see https://github.com/rehypejs/rehype-react
// @ts-expect-error: the react types are missing.
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
    }) // hastをReactElementに変換
    .processSync(content).result
}
