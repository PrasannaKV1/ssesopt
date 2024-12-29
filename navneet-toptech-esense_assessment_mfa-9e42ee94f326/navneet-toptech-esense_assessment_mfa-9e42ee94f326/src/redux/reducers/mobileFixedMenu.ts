import { dispatchType as TYPES } from "../dispatchTypes";

export type Action = {
  type: string;
  payload?: any;
};

export type mobileFixedMenu = {
  mobileMenuStatus: boolean;
  isMobileView?: boolean
};

const initstate = {
  mobileMenuStatus : false,
  isMobileView:false
};

const mobileMenuStatus = (state = initstate, action: Action) => {
  switch (action.type) {
    case TYPES.mobileFixed.getMobileFixed: {
      return {
        ...state,
        ...(action.payload || {}),
      };
    }
    case TYPES.mobileFixed.isMobileView:{
      return {
        ...state,
        isMobileView : action.payload
      }
    }
    case TYPES.revoke:
      return initstate;

    default:
      return state;
  }
};

export default mobileMenuStatus;
