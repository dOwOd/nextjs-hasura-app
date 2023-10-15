import { cdate } from 'cdate'

// hydration-faildが発生するためタイムゾーンを設定
export const dateFromat = (date: string, separator: '-' | '.') => {

  const format = `YYYY${separator}MM${separator}DD`
  return (
    cdate(date).tz('Asia/Tokyo').format(format)
  )
}