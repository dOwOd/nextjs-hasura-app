import { makeIPInspector } from 'next-fortress'

// 第一引数: 許可するIPアドレス。CIDR形式、および配列で複数のIP指定も可
// 第二引数: 許可IPレンジ外からのアクセスに対しての制御ルール。詳しくはREADMEをどうぞ。https://github.com/aiji42/next-fortress#usage
export const middleware = makeIPInspector(process.env.NEXT_PUBLIC_IP_ADDRESS || '', {
  type: 'redirect',
  destination: '/'
})