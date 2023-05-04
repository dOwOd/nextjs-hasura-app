import TwitterIcon from 'public/images/logos/TwitterSocialIcons-circle-white.svg'
import GitHubIcon from 'public/images/logos/github-mark-white.svg'
import QiitaIcon from 'public/images/logos/QiitaFavicon.png'
import style from 'src/components/Accounts/index.module.css'
import { AccountLink } from 'src/components/AccountLink'

export const Accounts = () => (
  <nav className={style.navbar}>
    <ul>
      <li>
        <AccountLink href="https://twitter.com/shikasun" text="Twitter" imageSrc={TwitterIcon} />
      </li>
      <li>
        <AccountLink href="https://github.com/dOwOd" text="GitHub" imageSrc={GitHubIcon}/>
      </li>
      <li>
        <AccountLink href="https://qiita.com/l_dOwOd_l" text="Qiita" imageSrc={QiitaIcon}/>
      </li>
    </ul>
  </nav>
)
