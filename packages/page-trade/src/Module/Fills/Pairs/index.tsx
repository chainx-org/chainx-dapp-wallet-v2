
import React, { useContext } from 'react';
import Wrapper, { Header, SymbolCell } from './Wrapper';
// import { Table, TableBody, TableHead, TableRow } from '@chainx/ui';
import { HeadTitle } from '../../components/HeadCell';
import {
  PairPriceAriseCell,
  PairPriceDownCell
} from '../../components/PriceCell';
import { toPrecision } from '../../../components/toPrecision';
import { useTranslation } from '../../../translate';
import {DexContext} from '@polkadot/react-components-chainx/DexProvider';
import { Table } from '@polkadot/react-components';


export default function (): React.ReactElement {
  const { fills } = useContext(DexContext);
  const latest = fills[0]?.price || toPrecision(0, 7);
  const currencies = ['KSX'];
  const precision = 9;
  const showPrecision = 7;
  const { t } = useTranslation();

  return (
    <Wrapper>
      <Header>
        <ul>
          <li className={'active'}>
            {currencies[0]}
          </li>
        </ul>
      </Header>

      <Table className="marbot">
        {/* <TableHead> */}
          <tr>
            <HeadTitle>{t('Token')}</HeadTitle>
            <HeadTitle style={{ textAlign: 'right' }}>
              {t('Price')}
            </HeadTitle>
          </tr>
        {/* </TableHead> */}
        {/* <TableBody> */}
          <tr style={{background: "#fff"}}>
            <SymbolCell>{currencies[0]}</SymbolCell>
            {latest && latest.arise ? (
              <PairPriceAriseCell style={{ textAlign: 'right' }}>
                {Number(toPrecision(latest, precision)).toFixed(
                  showPrecision
                )}
              </PairPriceAriseCell>
            ) : (
                <PairPriceDownCell style={{ textAlign: 'right' }}>
                  {Number(toPrecision(latest, precision)).toFixed(
                    showPrecision
                  )}
                </PairPriceDownCell>
              )}
          </tr>

        {/* </TableBody> */}
      </Table>
    </Wrapper>
  );
}
