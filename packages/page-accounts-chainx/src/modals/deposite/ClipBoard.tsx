
import React, { useEffect } from 'react';
import ClipboardJS from 'clipboard';
import uniqid from 'uniqid';
import copyIcon from './copy.svg';
import styled from 'styled-components';

const Wrapper = styled.span`
  word-break: break-all;
  word-wrap: break-word;

  i {
    margin-left: 4px;
    img {
      width: 11px;
      cursor: pointer;
    }
  }
`;

interface Props {
  id: string,
  children: string,
  className: string,
  onClick?: () => void,
}

export default function ClipBoard({ children, className, id, onClick }: Props): React.ReactElement<Props> {
  useEffect(() => {
    const clipBoard = new ClipboardJS('.clipboard');

    return function () {
      clipBoard.destroy();
    };
  }, []);

  const uid = id || uniqid('clipboard_');

  return (
    <Wrapper>
      <span className={className}
        id={uid}>
        {children}
      </span>
      <i className='clipboard' onClick={onClick}
        data-clipboard-target={`#${uid}`}>
        <img alt='Copy'
          src={copyIcon} />
      </i>
    </Wrapper>
  );
}
