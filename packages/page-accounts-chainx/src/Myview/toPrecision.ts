
import BigNumber from 'bignumber.js';

export function toPrecision(value: number, precision = 0, paddingZero = true): number | string {
  precision = Number(precision);
  const big = new BigNumber(value).dividedBy(Math.pow(10, precision));

  if (paddingZero) {
    return parseFloat(big.toPrecision(precision));
  } else {
    return big.toNumber();
  }
}
