import { cdate } from 'cdate'

// hydration-faildが発生するためタイムゾーンを設定
export const dateFromat = (date: string, formta = 'YYYY-MM-DD') =>
  cdate(date).tz('Asia/Tokyo').format(formta)