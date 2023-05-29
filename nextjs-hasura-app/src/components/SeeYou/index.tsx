import { useEffect } from 'react'
import styles from 'src/components/SeeYou/index.module.css'

export const SeeYou = () => {
  useEffect(() => {
    setTimeout(() => {
      window.location.href = '/'
    }, 3000)
  }, [])

  return (
    <>
      <p className={styles.text}>SeeYou &#x1F44B;</p>
    </>
  )
}
