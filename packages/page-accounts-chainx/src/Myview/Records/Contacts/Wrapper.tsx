import styled from 'styled-components';

export const Wrapper = styled.div`
  .ui--Row{
    .ui--Row-base{
      padding: 1em 2em;
      display: flex;
      justify-content: center;
      align-items: center;

      .ui-Row-icon{
        display: flex;
      }

      .ui--Row-details{
        .ui--Row-name{
          font-size: 14px;
        }

        .ui--Row-address{
          font-size: 12px;
        }
      }
    }

    .ui--Row-children{
      display: none;
    }
  }

  .addAccountBtn{
    width: 100%;
    background: #ED2B89;
    border: none;
    height: 1.7em;
    cursor: pointer;

    &:focus{
      border: none;
      outline: none;
    }

    > svg{
      color: white;
      margin-right: 0;
    }
  }

  .empty{
    margin-top: 120px;
  }
`

export const AccountWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #EFEFEF;

  > svg{
    margin-right: 2em;
    cursor: pointer;
  }
`
