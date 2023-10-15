'use client'

import { FC, useEffect, useState } from 'react'

export const Timer: FC = () => {
  const [date, setDate] = useState('')

  const formatDate = (hour: number, minute: number, second: number, millisecond: number) => {
    setDate(`${hour}:${minute}:${second} ${millisecond}`)
  }

  useEffect(() => {
    setInterval(() => {
      const nowDate = new Date()
      const hour = nowDate.getHours()
      const minute = nowDate.getMinutes()
      const second = nowDate.getSeconds()
      const millisecond = nowDate.getMilliseconds()
      formatDate(hour, minute, second, millisecond)
    }, 10)
  }, [date])


  return (
    <>
      {date}
    </>
  )
}