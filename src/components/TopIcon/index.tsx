import Image from 'next/image'
import CaroImage from 'public/images/IMG_4236.png'
import styles from 'src/components/TopIcon/index.module.css'

export const TopIcon = () => (
  <Image src={CaroImage} alt="top icon" className={styles.topIcon} priority/>
)
