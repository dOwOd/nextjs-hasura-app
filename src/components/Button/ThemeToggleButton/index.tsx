'use client'

import { FiSun, FiMoon } from 'react-icons/fi'
import { useTheme } from 'src/lib/context/ThemeContext'
import style from './index.module.css'

export const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme()

  // Hydration中はプレースホルダーを表示してレイアウトシフトを防ぐ
  if (!theme) {
    return (
      <div className={style.themeToggleButton}>
        <button
          className="secondary"
          disabled
          aria-label="テーマ読み込み中"
        >
          <span className={style.icon}>
            <FiSun />
          </span>
        </button>
      </div>
    )
  }

  return (
    <div className={style.themeToggleButton}>
      <button
        className="secondary"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
      >
        <span className={style.icon}>
          {theme === 'dark' ? <FiSun /> : <FiMoon />}
        </span>
      </button>
    </div>
  )
}
