import { useRouter } from "next/router"
import Link from "next/link"

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
              <Link href={ `/${path}` || '/'}>{path || 'Home'}</Link>
            )
          return <li key={path}>{children}</li>
        })}
      </ul>
    </nav>
  )
}