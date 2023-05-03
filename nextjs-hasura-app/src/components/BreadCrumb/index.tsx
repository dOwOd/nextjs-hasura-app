import { useRouter } from "next/router"

export const BreadCrumb = () => {
  const router = useRouter()
  const fullPath = `${router.asPath}`.split('/')
  return (
    <nav aria-label="breadcrumb">
      <ul>
        {fullPath.map((path, i) => {
          const children =
            fullPath.length === i + 1 ? (
              path
            ) : (
              <a href={ `/${path}` || '/'}>{path || 'Home'}</a>
            )
          return <li key={path}>{children}</li>
        })}
      </ul>
    </nav>
  )
}