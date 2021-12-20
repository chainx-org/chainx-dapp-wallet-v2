
import styled from 'styled-components';
import SideCard from '../../../components/SideCard';
// import { TableCell } from '@chainx/ui';

const Wrapper = styled(SideCard)`
  padding: 16px 0;
  .marbot {
    margin-bottom: 0;
  }
`;

export const Header = styled.header`
  margin-bottom: 0;
  ul {
    display: flex;
    justify-content: space-around;
    padding-left: 0;
    margin: 0;
    li {
      flex: 1;
      text-align: center;
      padding-bottom: 13px;
      list-style: none;
      opacity: 0.32;
      font-size: 14px;
      font-weight: 600;
      color: #000000;
      letter-spacing: 0.12px;
      line-height: 20px;

      cursor: pointer;
      &.active {
        border-bottom: 3px solid #ED2B89;
        opacity: 0.72;
      }
    }
  }
`;

export const SymbolCell = styled.td`
  opacity: 0.72;
  font-size: 14px !important;
  font-weight: 600 !important;
  color: rgba(0, 0, 0, .74);
  letter-spacing: 0.12px;
  line-height: 20px;
  border-bottom: 0 !important;
  width: 50%;
  padding: 12px !important;
`;

export default Wrapper;
