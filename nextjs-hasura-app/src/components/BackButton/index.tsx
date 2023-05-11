import Link from 'next/link'
import style from 'src/components/BackButton/index.module.css'

export const BackButton = () => (
  <div className={style.backButton}>
    <Link href="/articles" className="secondary" role="button">
      Back
    </Link>
  </div>
)
