/** @format */

import React from 'react'
import styled from 'styled-components'
import copy from 'copy-to-clipboard'
import Icon from '../assets/copy.svg'

const Wrapper = styled.div`
  display: inline-flex;
  width: 100%;
  > :first-child {
    margin-right: 8px;
  }
`
interface CopyTextProps {
  children?: any
  text: string
  showText?: boolean
}

// @ts-ignore
export default function CopyText({children, text, showText}: CopyTextProps) {
  const onCopy = () => {
    if (text && copy(text)) {
      // message.success({content: t('copy success')})
      alert('copy sucess')
    }
  }

  return (
    <Wrapper>
      {!showText ? <div style={{margin: 'auto 0',display:'inline-block'}}>{children}</div> : ''}
        <img
          src={Icon}
          alt=""
          onClick={onCopy}
          className="cursor-pointer"
          style={{maxWidth: 'none', marginLeft: '8px'}}
        />
    </Wrapper>
  )
}
