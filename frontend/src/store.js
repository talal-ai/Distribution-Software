import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

// Reducers
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
  userListReducer,
  userDeleteReducer,
  userUpdateReducer,
} from './reducers/userReducers';

import {
  productListReducer,
  productDetailsReducer,
  productDeleteReducer,
  productCreateReducer,
  productUpdateReducer,
} from './reducers/productReducers';

import {
  inventoryTransactionListReducer,
  inventoryTransactionDetailsReducer,
  inventoryTransactionDeleteReducer,
  inventoryTransactionCreateReducer,
  inventoryTransactionUpdateReducer,
  inventoryStockReducer,
  inventoryReportReducer,
} from './reducers/inventoryReducers';

import {
  saleListReducer,
  saleDetailsReducer,
  saleDeleteReducer,
  saleCreateReducer,
  saleUpdateReducer,
  saleReportReducer,
} from './reducers/saleReducers';

import {
  financeTransactionListReducer,
  financeTransactionDetailsReducer,
  financeTransactionDeleteReducer,
  financeTransactionCreateReducer,
  financeTransactionUpdateReducer,
  financeReportReducer,
} from './reducers/financeReducers';

const reducer = combineReducers({
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userUpdate: userUpdateReducer,
  
  productList: productListReducer,
  productDetails: productDetailsReducer,
  productDelete: productDeleteReducer,
  productCreate: productCreateReducer,
  productUpdate: productUpdateReducer,
  
  inventoryTransactionList: inventoryTransactionListReducer,
  inventoryTransactionDetails: inventoryTransactionDetailsReducer,
  inventoryTransactionDelete: inventoryTransactionDeleteReducer,
  inventoryTransactionCreate: inventoryTransactionCreateReducer,
  inventoryTransactionUpdate: inventoryTransactionUpdateReducer,
  inventoryStock: inventoryStockReducer,
  inventoryReport: inventoryReportReducer,
  
  saleList: saleListReducer,
  saleDetails: saleDetailsReducer,
  saleDelete: saleDeleteReducer,
  saleCreate: saleCreateReducer,
  saleUpdate: saleUpdateReducer,
  saleReport: saleReportReducer,
  
  financeTransactionList: financeTransactionListReducer,
  financeTransactionDetails: financeTransactionDetailsReducer,
  financeTransactionDelete: financeTransactionDeleteReducer,
  financeTransactionCreate: financeTransactionCreateReducer,
  financeTransactionUpdate: financeTransactionUpdateReducer,
  financeReport: financeReportReducer,
});

// Get user info from localStorage
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store; 