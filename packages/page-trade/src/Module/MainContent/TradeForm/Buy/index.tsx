import React, {useContext, useEffect, useState} from 'react';
import Wrapper from './Wrapper';
import Free from '../components/Free';
// import {AmountInput, Slider} from '@chainx/ui';
import Label from '../components/Label';
import {marks} from '../constants';
import {TxButton} from '@polkadot/react-components';
import {AssetsInfo, TradingPairs} from '@polkadot/react-hooks-chainx/types';
import {useTranslation} from '../../../../translate';
import {toPrecision} from '../../../../components/toPrecision';
import BigNumber from 'bignumber.js';
import {api} from '@polkadot/react-api';
import {DexContext} from '@polkadot/react-components-chainx/DexProvider';
import {AccountContext} from '@polkadot/react-components-chainx/AccountProvider';
import valueToText from '@polkadot/react-params/valueToText';
import InputDex from '@polkadot/react-components-chainx/InputDex';
// import Input from '@polkadot/react-components-chainx/Input';

type Props = {
  assetsInfo: AssetsInfo | undefined;
  tradingPairsInfo: TradingPairs | undefined;
}

export default function ({assetsInfo, tradingPairsInfo}: Props): React.ReactElement<Props> {
  const {fills, isLoading, setLoading} = useContext(DexContext);
  const {currentAccount} = useContext(AccountContext);
  const {t} = useTranslation();

  const fillPrice: number = fills[0]?.price || 0;
  const defaultValue: string = new BigNumber(toPrecision(fillPrice, 9)).toFixed(7);
  const [price, setPrice] = useState<number | string>(toPrecision(0, 7));
  const [amount, setAmount] = useState<number | string>(toPrecision(0, 7));
  const [percentage, setPercentage] = useState<number>(0);
  const [max, setMax] = useState<number>(0);
  const [disabled, setDisabled] = useState<boolean>(true);
  const bgAmount: BigNumber = new BigNumber(amount);
  const bgPrice: BigNumber = new BigNumber(price);
  const volume: BigNumber = new BigNumber((bgAmount.multipliedBy(bgPrice)).toFixed(7));
  const [maxValidBidData, setMaxValidBidData] = useState<number>(0)
  const [errDisplay, setErrDisplay] = useState<boolean>(false)

  useEffect(()=> {
    if(tradingPairsInfo){
      const bgMaxValidBid: BigNumber = new BigNumber(toPrecision(tradingPairsInfo.maxValidBid, 9))
      setMaxValidBidData(bgMaxValidBid.toNumber())
    }
  }, [tradingPairsInfo, isLoading])

  useEffect(() => {
    const bgFillPrice = new BigNumber(toPrecision(fillPrice, 9));
    if (fillPrice) {
      setPrice(bgFillPrice.toFixed(7));
    }
  }, [fillPrice]);

  useEffect(() => {
    if (bgAmount.toNumber() <= 0) {
      setDisabled(true);
    } else if (bgPrice.toNumber() <= 0 || bgPrice.toNumber() > maxValidBidData) {
      setDisabled(true);
      setErrDisplay(true)

      // alert(`买入价格需低于${maxValidBidData}`)
    } else {
      setDisabled(false);
      setErrDisplay(false)
    }

    const bgAssetsInfoUsable = new BigNumber(toPrecision(Number(assetsInfo?.Usable), 8));
    setMax(bgAssetsInfoUsable.dividedBy(bgPrice).toNumber());
  }, [amount, price, assetsInfo, errDisplay, isLoading]);

  // useEffect(() => {
  //   async function judgeNet() {
  //     const testOrMain = await api.rpc.system.properties();
  //     const testOrMainNum = JSON.parse(testOrMain);
  //     if (testOrMainNum.ss58Format !== 42) {
  //       setDisabled(true);
  //     }
  //   }
  //
  //   judgeNet();
  // });
  return (
    <Wrapper>
      <div className='info'>
        <Free
          asset='sBTC'
          free={assetsInfo?.Usable || '0'}
          precision={8}
        />
        {errDisplay ? <div className='tip'>{t('The purchase price needs to be lower than')}{` ${maxValidBidData}`}</div>: ''}
        {errDisplay ? <div className='arrows'/>: ''}
      </div>

      <div className='price input'>
        {/* <PriceWrapper */}
        {/*  data-tip={t('Max buying price', {price})} */}
        {/* > */}
        <Label htmlFor='buy-price'>{t('Price')}</Label>
        {/*<img alt='info' src={infoIcon} />*/}
        {/* </PriceWrapper> */}
        <div>
          <InputDex
            id='buy-price'
            onChange={(value: string | number) => {
              setPrice(() => value);
            }}
            tokenName={'BTC'}
            value={price}
            maxLength={13}
          />
        </div>
      </div>
      <div className='amount input'>
        <Label>{t('Quantity')}</Label>
        <InputDex
          id='buy-amount'
          onChange={(value: number) => {
            if (value > max) {
              setAmount(max.toFixed(7));
              // setPercentage(100);
            } else {
              setAmount(value);
              // setPercentage((value / max) * 100);
            }
          }}
          autoFocus   
          isZeroable
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
          setPercentage(() => value);
          const calcMax = ((max * value) / 100).toFixed(7);
          setAmount(() => isFinite(Number(calcMax)) ? calcMax : defaultValue);
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
            label={t('Buy KSX')}
            params={[0, 'Limit', 'Buy',
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
