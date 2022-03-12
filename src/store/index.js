import { createStore, applyMiddleware, compose } from "redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistStore, persistReducer } from "redux-persist";
import { composeWithDevTools } from "redux-devtools-extension";

// middlewares
import thunkMiddleware from "redux-thunk";
import logger from "redux-logger";

// Import custom components
import rootReducer from "./reducers/rootReducer";

// const saveToLocalStorage = async state => {
//   try {
//     const serializedState = JSON.stringify(state);
//     // AsyncStorage.setItem("state", serializedState);
//     await AsyncStorage.setItem("state", serializedState);
//   } catch (e) {
//     console.log(e);
//   }
// };

// const loadFromLocalStorage = async () => {
//   try {
//     // const serializedState = AsyncStorage.getItem("state");
//     const serializedState = await AsyncStorage.getItem("state");
//     if (serializedState === null) return undefined;
//     const data = JSON.parse(serializedState);
//     console.log(data);
//     return data;
//     // return serializedState;
//   } catch (e) {
//     console.log(e);
//     return undefined;
//   }
// };

// const persistedState = loadFromLocalStorage();

// /**
//  * Create a Redux store that holds the app state.
//  */
// const store = createStore(
//   rootReducer,
//   persistedState,
//   compose(
//     applyMiddleware(thunkMiddleware),

//     //For working redux dev tools in chrome (https://github.com/zalmoxisus/redux-devtools-extension)
//     window.__REDUX_DEVTOOLS_EXTENSION__
//       ? window.__REDUX_DEVTOOLS_EXTENSION__()
//       : function(f) {
//           return f;
//         }
//   )
// );

// const unsubscribe = store.subscribe(() => {
//   const state = store.getState();
//   saveToLocalStorage(state);
// });

// export default store;

const persistConfig = {
  key: "root",
  storage: AsyncStorage
  // whitelist: ["auth"]
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = createStore(
//   rootReducer,
//   composeWithDevTools(applyMiddleware(thunkMiddleware))
// );
// export const persistor = persistStore(store);

// export default () => {
//   let store = createStore(persistedReducer);
//   let persistor = persistStore(store);
//   return { store, persistor };
// };
export const store = createStore(
  persistedReducer,
  applyMiddleware(thunkMiddleware)
);
export const persistor = persistStore(store);
