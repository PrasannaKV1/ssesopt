import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import RootReducer from "./reducers/index";
import { apiMiddleware } from "./middleware/apiMiddleware";

const middleware = [thunk,apiMiddleware]; 

const store = createStore(
  RootReducer,
  composeWithDevTools(applyMiddleware(...middleware)) // Spread middleware
);

export type RootStore = ReturnType<typeof RootReducer>;

export default store;
