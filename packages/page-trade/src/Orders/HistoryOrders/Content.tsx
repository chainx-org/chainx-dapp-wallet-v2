import React, {useContext} from 'react';
// import { TableBody, TableHead, TableRow} from '@chainx/ui';
import {toPrecision} from '../../components/toPrecision';
import {
  FillCell,
  IndexCell,
  NumberCell,
  PairCell,
  TimeCell
} from '../UserOrders/Wrapper';
import moment from 'moment';
import { StatCell} from '../Wrapper';
import {useTranslation} from '../../translate';
import BigNumber from 'bignumber.js';
import {DexContext} from '@polkadot/react-components-chainx/DexProvider';
import { Table } from '@polkadot/react-components';


export default function (): React.ReactElement {
  const {HistoryOrders} = useContext(DexContext);
  const {t} = useTranslation();

  return (
    <Table className="marbot">

      {/* <TableBody> */}
        {HistoryOrders.map((order, index) => {
          const currencyPair = [['KSX', 'BTC']];
          const bgAmount = new BigNumber(toPrecision(Number(order.turnover), 8));
          const amount = bgAmount.toNumber().toFixed(7)
          const bgPrice = new BigNumber(toPrecision(order.price, 9, false));
          const price = bgPrice.toNumber().toFixed(7);
          // const precision = 9;
          // const unitPrecision = 1;
          // const fillPercentage = Number(
          //   (order.remaining / Number(order.turnover)) * 100
          // ).toFixed(2);
          // const showPrecision = precision - unitPrecision;
          // const price = toPrecision(order.props.price, precision, false).toFixed(
          //   showPrecision
          // );
          // const fillAveragePrice = toPrecision(
          //   order.props.price,
          //   precision,
          //   false
          // ).toFixed(showPrecision);
          // // 成交总额
          // const totalFillCurrency = toPrecision(
          //   order.props.price * Number(order.turnover),
          //   2 * 8,
          //   false
          // ).toFixed(8);

          return (
            <tr key={index}>
              <TimeCell style={{width: '19%'}}>
                <div>
                  <span className={order.blockTime.toString()}/>
                  <span className='time'>
                    {moment(order.blockTime).format('YYYY/MM/DD HH:mm')}
                  </span>
                </div>
              </TimeCell>
              <IndexCell style={{width: '12%'}}>{order.tradingHistoryIdx}</IndexCell>
              <PairCell style={{width: '15%'}}>{`${currencyPair[order.pairId][0]} / ${currencyPair[order.pairId][1]
              }`}</PairCell>
              <NumberCell style={{width: '18%'}}>
                {price + ' '}
                <span>{currencyPair[order.pairId][1]}</span>
              </NumberCell>
              <NumberCell style={{width: '21%'}}>
                {amount + ' '}
                <span>{currencyPair[order.pairId][0]}</span>
              </NumberCell>
              {/*<FillCell*/}
              {/*  className={amount <= 0 ? 'zero' : order.props.side}*/}
              {/*  style={{ width: '15%' }}*/}
              {/*>*/}
              {/*  <span className='amount'>{amount}</span>*/}
              {/*  <span className='percentage'> / {fillPercentage}% </span>*/}
              {/*</FillCell>*/}
              {/*<NumberCell style={{ width: '11%' }}>*/}
              {/*  {fillAveragePrice + ' '}*/}
              {/*  <span>{currencyPair[order.props.pairId][1]}</span>*/}
              {/*</NumberCell>*/}
              {/*<NumberCell style={{ width: '15%' }}>*/}
              {/*  {totalFillCurrency + ' '}*/}
              {/*  <span>{currencyPair[order.props.pairId][1]}</span>*/}
              {/*</NumberCell>*/}
              <StatCell>
                {t('Completed')}
              </StatCell>
            </tr>
          );
        })}
      {/* </TableBody> */}
    </Table>
  );
}
