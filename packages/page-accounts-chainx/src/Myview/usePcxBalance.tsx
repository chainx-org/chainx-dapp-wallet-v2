import {useEffect, useState} from 'react'
import {useApi} from '../../../react-hooks/src'
import BigNumber from 'bignumber.js'

export const usePcxBalance: (address: string, n: number) =>  {
  usableBalanceNum: number
  totalBalanceNum: number
  unBoundFrozenNum: number
  votingFrozenNum: number
} = (address: string, n: number)  => {
  const {api, isApiReady} = useApi()
  const defaultPcxBalance = JSON.parse(window.localStorage.getItem('pcx_balance') || '{}')

  const [balance, setBalance] = useState({
    usableBalanceNum: defaultPcxBalance.usableBalanceNum || 0,
    totalBalanceNum: defaultPcxBalance.totalBalanceNum || 0,
    unBoundFrozenNum: defaultPcxBalance.unBoundFrozenNum || 0,
    votingFrozenNum: defaultPcxBalance.votingFrozenNum || 0
  })

  const getAccountBalance = async () => {
    const { data } = await api.query.system.account(address);
    const {free, miscFrozen, reserved} = data.toJSON()
    const usableBalanceNum = new BigNumber(free as number).minus(miscFrozen as number).toNumber()
    const totalBalanceNum = new BigNumber(free as number).plus(reserved as number).toNumber()

    const votingResult = await api.query.xStaking?.locks(address)
    const votingFrozenNum = (votingResult.toJSON() as any)?.Bonded || 0
    const unBoundFrozenNum = (votingResult.toJSON() as any)?.BondedWithdrawal || 0

    setBalance({
      usableBalanceNum,
      totalBalanceNum,
      votingFrozenNum,
      unBoundFrozenNum
    })
  }

  useEffect(() => {
    window.localStorage.setItem('pcx_balance', JSON.stringify(balance))
  }, [JSON.stringify(balance)])

  useEffect(() => {
    isApiReady && getAccountBalance()
  }, [isApiReady, api, address, n])

  return balance
}
