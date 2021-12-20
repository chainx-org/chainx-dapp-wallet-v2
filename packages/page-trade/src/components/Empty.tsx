
import React from 'react';
import noneLogo from '../Orders/svg/none.svg';
import shap from '../Orders/svg/shap.svg'
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;

  section {
    text-align: center;
  }

  img {
    width: 56px;
  }

  p {
    margin-top: 8px;
    opacity: 0.24;
    font-size: 14px;
    color: #000000;
    letter-spacing: 0.12px;
    text-align: center;
    line-height: 20px;
  }
`;

type Props = {
  text: string,
  style?: string,
  className?: string
}

export default function ({ className, style, text }: Props): React.ReactElement<Props> {
  return (
    <Wrapper className={className}
      style={style}>
      <section>
        <img alt='empty'
          src={shap} />
      </section>
      <p>{text}</p>
    </Wrapper>
  );
}
