// import { dispatchType } from "../dispatchTypes";
import {dispatchType} from "./dispatchTypes"
// import { mobileFixedMenu } from "./reducers/mobileFixedMenu";
import {mobileFixedMenu} from "./reducers/mobileFixedMenu"
export const mobileMenuFixed = (data: mobileFixedMenu) => ({
  type: dispatchType.mobileFixed.getMobileFixed,
  payload: data,
});


export const isMobileViewAction = (data: boolean) => ({
  type: dispatchType.mobileFixed.isMobileView,
  payload: data,
});