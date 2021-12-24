import React, {useContext, useEffect, useState} from 'react';
import Wrapper from './Wrapper';
import Free from '../components/Free';
import Label from '../components/Label';
// import {AmountInput, Slider} from '@chainx/ui';
import {marks} from '../constants';
import {toPrecision} from '../../../../components/toPrecision';
import {TxButton} from '@polkadot/react-components';
import usePcxFree from '@polkadot/react-hooks-chainx/usePcxFree';
import {useTranslation} from '../../../../translate';
import BigNumber from 'bignumber.js';
import {useAccounts} from '@polkadot/react-hooks';
import {api} from '@polkadot/react-api';
import {DexContext} from '@polkadot/react-components-chainx/DexProvider';
import {AccountContext} from '@polkadot/react-components-chainx/AccountProvider';
import BN from 'bn.js';
import {AssetsInfo, TradingPairs} from '@polkadot/react-hooks-chainx/types';
import LabelHelp from '@polkadot/react-components/LabelHelp';
import Tooltip from '@polkadot/react-components/Tooltip';
import InputDex from '@polkadot/react-components-chainx/InputDex';

type Props = {
  tradingPairsInfo: TradingPairs | undefined;
}

export default function ({tradingPairsInfo}: Props): React.ReactElement<Props> {

  const {t} = useTranslation();
  const {hasAccounts} = useAccounts();
  const {fills, isLoading, setLoading} = useContext(DexContext);
  const {currentAccount} = useContext(AccountContext);
  const pcxFree = usePcxFree(currentAccount);
  const bgUsableBalance = new BN(Number(pcxFree.free) - Number(pcxFree.feeFrozen));


  const [price, setPrice] = useState<number | string>(toPrecision(0, 7));
  const [disabled, setDisabled] = useState<boolean>(true);
  const [amount, setAmount] = useState<number | string>(toPrecision(0, 7));
  const [max, setMax] = useState<number>(0);
  const [percentage, setPercentage] = useState<number>(0);
  const bgAmount = new BigNumber(amount);
  const bgPrice = new BigNumber(price);
  const volume = new BigNumber((bgAmount.multipliedBy(bgPrice)).toFixed(7));
  const [minValidAskData, setMinValidAskData] = useState<number>(0);
  const [errDisplay, setErrDisplay] = useState<boolean>(false)

  useEffect(() => {
    if (tradingPairsInfo) {
      const bgMinValidAsk: BigNumber = new BigNumber(toPrecision(tradingPairsInfo.minValidAsk, 9));
      setMinValidAskData(bgMinValidAsk.toNumber());
    }
  }, [tradingPairsInfo, isLoading]);


  useEffect(() => {
    if (fills[0]?.price) {
      const bgPrice = new BigNumber(toPrecision(fills[0]?.price, 9));
      setPrice(bgPrice.toNumber().toFixed(7));
    }
  }, [fills[0]?.price]);

  useEffect(() => {
    if (bgAmount.toNumber() <= 0) {
      setDisabled(true);
    } else if (bgPrice.toNumber() <= 0 || bgPrice.toNumber() < minValidAskData) {
      setDisabled(true);
      setErrDisplay(true)
      // alert(`卖出价格应高于${minValidAskData.toFixed(7)}`);
    } else {
      setErrDisplay(false)
      setDisabled(false);
    }
    const bgPcxFree = new BigNumber(toPrecision(pcxFree.free, 8));
    setMax(bgPcxFree.toNumber());

  }, [amount, price, pcxFree.free, errDisplay, isLoading]);


  // useEffect(() => {
  //   async function judgeNet(){
  //     const testOrMain = await api.rpc.system.properties();
  //     const testOrMainNum = JSON.parse(testOrMain);
  //     if (testOrMainNum.ss58Format !== 42) {
  //       setDisabled(true)
  //     }
  //   }
  //   judgeNet()
  // })

  return (
    <Wrapper>
      <div className='info'>
        <Free asset={'KSX'}
              free={hasAccounts ? bgUsableBalance.toNumber().toString() : Number(toPrecision(0, 7)).toString()}
              precision={8}/>

        {errDisplay ? <div className={`tip ${errDisplay}`}>{t('The selling price should be higher than')}{ ` ${minValidAskData.toFixed(7)}`}</div>: ''}
        {errDisplay ? <div className={`arrows ${errDisplay}`}/>: ''}
      </div>
      <div className='price input'>
        {/*<PriceWrapper data-tip={t(`Min selling price：${Number(pcxFree.free)}`)}>*/}
        <Label htmlFor='sell-price'>{t('Price')}</Label>
        {/* <img src={infoIcon} alt="info" /> */}
        {/*</PriceWrapper>*/}

        <InputDex
          id='sell-price'
          onChange={(value: string | number) => {
            setPrice(value);
          }}
          tokenName={'BTC'}
          value={price}
          maxLength={13}
        />
      </div>

      <div className='amount input'>
        <Label>{t('Quantity')}</Label>
        <InputDex
          id='sell-amount'
          onChange={(value: string | number) => {
            if (value > max) {
              setAmount(max.toFixed(7));
              // setPercentage(100);
            } else {
              setAmount(value);
              // setPercentage((value / max) * 100);
            }
          }}
          maxLength={13}
          tokenName={'KSX'}
          value={amount}
        />
      </div>

      {/* <Slider
        className='percentage'
        marks={marks}
        max={100}
        min={0}
        onChange={(value: number) => {
          const bgMax = new BigNumber(max);
          setPercentage(value);
          const calcMax = bgMax.multipliedBy(value).dividedBy(100).toFixed(7);
          setAmount(isFinite(Number(calcMax)) ? calcMax : Number(toPrecision(0, 7)).toFixed(7));
        }}
        value={percentage}
        valueLabelDisplay='off'
      /> */}

      <div className='volume'>
        <span>{t('Volume')} </span>
        <span>
          {volume.toNumber() ? volume.toNumber().toFixed(7) : toPrecision(0, 7)} {'BTC'}
        </span>
      </div>

      <div className='button'>
        <div>
          <TxButton
            accountId={currentAccount}
            isDisabled={disabled}
            label={t('Sell KSX')}
            params={[0, 'Limit', 'Sell',
              bgAmount.multipliedBy(Math.pow(10, 8)).toNumber(),
              bgPrice.multipliedBy(Math.pow(10, 9)).toNumber()]}
            tx='xSpot.putOrder'
            onSuccess={() => setLoading(true)}
            // onClick={sign}
          />
        </div>
      </div>
    </Wrapper>
  );
}
