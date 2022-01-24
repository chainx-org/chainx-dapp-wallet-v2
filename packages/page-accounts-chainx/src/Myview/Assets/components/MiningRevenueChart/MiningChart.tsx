
import React, { useEffect, useRef } from 'react';
import { useLoadingDelay } from '@polkadot/react-hooks';
import Detail from './Detail';
import { useTranslation } from '@polkadot/app-accounts/translate';
import {ChainStatus, Hr} from './MiningChartWrapper'

type Option = {
  canvas: HTMLCanvasElement,
  colors: string[],
  width: number,
}
class Piechart {
  constructor(options: Option) {
    this.options = options;
    this.canvas = options.canvas;
    this.ctx = this.canvas.getContext('2d');
    this.colors = options.colors;
  }

  drawPieSlice = (
    ctx: HTMLCanvasElement,
    centerX,
    centerY,
    radius,
    startAngle,
    endAngle,
    color
  ) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fill();
  }

  draw = (data = []) => {
    if (data.length <= 0) {
      return;
    }

    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const ctx = this.ctx;
    const radius = Math.min(centerX, centerY);

    const totalValue = data.reduce((result, item) => result + item, 0);
    let colorIndex = 0;
    let startAngle = Math.PI;

    for (const categ in data) {
      const val = data[categ];
      const sliceAngle = (2 * Math.PI * val) / totalValue;

      this.drawPieSlice(
        ctx,
        centerX,
        centerY,
        radius,
        startAngle,
        startAngle + sliceAngle,
        this.colors[colorIndex % this.colors.length]
      );
      startAngle += sliceAngle;
      colorIndex++;
    }

    this.drawPieSlice(
      ctx,
      centerX,
      centerY,
      radius - this.options.width,
      0,
      2 * Math.PI,
      '#ffffff'
    );

    ctx.fillStyle = 'black';
    ctx.font = '16px serif';
    ctx.textAlign = 'center';
  }
}

export default function (): React.ReactElement {
  const { t } = useTranslation();
  const isLoading = useLoadingDelay();
  const detailList = [
    {
      color: 'yellow',
      type: 'PCX',
      data: '77.6%'
    },
    {
      color: 'orange',
      type: 'X-BTC',
      data: '0.5%'
    },
    {
      color: 'blue',
      type: 'TR',
      data: '21.9%'
    },
    // {
    //   color: 'grey',
    //   type: 'PolkaX',
    //   data: '20%'
    // }
  ];
  const canvasRef = useRef(null);
  const colors = [
    '#F6C94A',
    // '#C2C2C2',
    '#46AEE2',
    '#F7931B'
  ];

  const power = [{ power: 77.6 }, { power: 21.9 }, { power: 0.5 }];

  useEffect(() => {
    if (power) {
      const canvas = canvasRef.current;

      canvas.height = 148;

      const chart = new Piechart({
        canvas: canvas,
        colors,
        width: 40
      });

      const percents = power.map((p) => p.power);

      chart.draw(percents);
    }
  }, [power, colors]);

  return (
    <ChainStatus>
      <p>{t('Share of mining revenue')}</p>
      <Hr />
      <div className='canvas'>
        <canvas ref={canvasRef} />
      </div>
      <div className='details'>
        {
          isLoading ? undefined : detailList.map(({ color, data, type }) =>
            (
              <Detail color={color}
                data={data}
                type={type} 
                key={color}
              />
            ))
        }
      </div>
    </ChainStatus>
  );
}
