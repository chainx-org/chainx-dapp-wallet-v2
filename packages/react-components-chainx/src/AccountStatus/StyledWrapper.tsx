import styled from 'styled-components';

export const StyledWrapper = styled.div`
  padding: 4px 0 0 2rem;
  min-height: 61px;
  margin: 0 -1.5rem;
  display: flex !important;
  align-items: center;
  color: rgba(0,0,0,0.8);
  .ui--AccountStatus-Convert {
    margin-right: 10px;
  }

  .ui--AccountStatus-ChangeAccount {
    margin-right: 0.2em;
    @media only screen and (max-width: 768px) {
      display: none;
    }
  }

  @media (max-width: 768px) {
    min-height: 44px;
    display: flex;
    padding: 0 0.5rem;
    margin: 0 0;

    .ui--AccountStatus-Address{
      display: none;
    }
  }

  .ui--AccountStatus-Box{
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    .usermarks {
      position: absolute;
      width: 40px;
      height: 40px;
      background: transparent;
      border-radius: 50%;
      @media only screen and (min-width: 769px) {
        display: none;
      }
    }
    > .ui--Row {
      display: flex;
      align-items: center;

      .ui--Row-base{
        min-width: 7rem;
        @media only screen and (max-width: 768px) {
          min-width: 0;
        }
      }
      .ui--Row-children{
        @media only screen and (max-width: 768px) {
          display: none;
        }
      }
      .ui--Row-icon{
        display: flex;
        align-items: center;
        margin-right: 8px;
        @media only screen and (max-width: 768px) {
          margin-right: 0;
        }
        > .ui--IdentityIcon{
          background: rgba(242, 242, 242);
          width: 2.8rem;
          height: 2.8rem;
        }

        svg{
          width: 2.8rem;
          height: 2.8rem;
        }
      }

      .ui--Row-details{
        margin-right: 0;
        @media only screen and (max-width: 768px) {
          display: none;
        }
        .ui--Row-name{
          font-size: 14px;
          color: #282828;
          width: 6.6rem;
          padding-right: 0;
        }

        .ui--Row-address{
          font-size: 12px;
          color: #8E8E8E;
          padding-right: 0;
        }
      }
    }
    > button{
      // background: rgba(246, 201, 74);
      background: #ED2B89;
      border-radius: 0.15rem;
      padding: 1em 0.1em 1em 0.1em;

      &:hover{
        background: #ED2B89 !important;
      }

      > svg{
        color: rgba(255, 255, 255) !important;
      }
    }
  }

  .ui--AccountStatus-Network{
    color: #8231D8;
    font-size: 18px;
    font-weight: bold;
    flex: 1;

    span{
      margin-right: .5rem;
    }
  }

  .accounts--Account-buttons{
    padding: 40px;
  }

  .switchBtn{
    margin-left: 16px;
    cursor: pointer;
  }
`;
