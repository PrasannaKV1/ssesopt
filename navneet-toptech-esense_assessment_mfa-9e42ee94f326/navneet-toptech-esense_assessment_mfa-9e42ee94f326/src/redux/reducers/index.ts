import { combineReducers } from "redux";
import { qMenuEvent, qMenuEventInterface } from "./assementsReducers/assesmentMenuEvent";
import snackBarReducer from "./snackbarReducers/sanckBarEvent";
import { searchFilterEvents } from "./assementsReducers/searchFilterEvent";
import { studentListEvents } from "./assementsReducers/studentListEvents";
import uploadReducer from "./uploadReducers/uploadReducer";
import { studentOverviewEvent } from "./assementsReducers/studentOverview";
import { onlineQpMenuEvent, onlineQpMenuEventInterface } from "./onlineAssementReducers/onlineAssesmentEventActions";
import { InitialStateInterface, onlineSearchFilterEvents } from "./onlineAssementReducers/onlineSearchFilter";
import mobileMenuStatus,{ mobileFixedMenu } from "./mobileFixedMenu";


export interface ReduxStates {
    qMenuEvent: qMenuEventInterface,
    onlineAssesmentMenuEvent : onlineQpMenuEventInterface,
    onlineSearchFilterEvents : InitialStateInterface
    mobileMenuStatus: mobileFixedMenu

};

const RootReducer = combineReducers({
    qMenuEvent: qMenuEvent,
    snackBarEvent : snackBarReducer,
    searchFilterEvents: searchFilterEvents,
    studentListEvents : studentListEvents,
    upload: uploadReducer,
    studentOverviewEvent : studentOverviewEvent,
    onlineAssesmentMenuEvent : onlineQpMenuEvent,
    onlineSearchFilterEvents,
    mobileMenuStatus
});

export default RootReducer;
