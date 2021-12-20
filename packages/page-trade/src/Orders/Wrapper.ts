
import styled from 'styled-components';
import { BaseCell } from './UserOrders/Wrapper';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 18px;
  padding-top: 12px;
  background: #ffffff;
  border: 1px solid #dce0e2;

  border-radius: 10px;
  .marbot {
    margin-bottom: 0;
  }
`;

export default Wrapper;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
  margin-bottom: 0;
  ul {
    display: flex;
    justify-content: space-around;
    margin: 0;
    padding-left: 0;
    li {
      opacity: 0.32;
      font-weight: 600;
      font-size: 14px;
      color: #000000;
      letter-spacing: 0.12px;
      line-height: 20px;
      padding-bottom: 9px;
      list-style: none;
      cursor: pointer;
      &.active {
        border-bottom: 3px solid #ED2B89;
        opacity: 0.72;
      }

      &:last-of-type {
        margin-left: 24px;
      }
    }
  }
`;

export const HeadCell = styled(BaseCell)`
  opacity: 0.72 !important;
  font-weight: 600 !important;
`;

export const StatCell = styled.td`
  opacity: 0.72 !important;
  text-align: right !important;
`;
