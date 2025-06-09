import {
  INVENTORY_TRANSACTION_LIST_REQUEST,
  INVENTORY_TRANSACTION_LIST_SUCCESS,
  INVENTORY_TRANSACTION_LIST_FAIL,
  INVENTORY_TRANSACTION_DETAILS_REQUEST,
  INVENTORY_TRANSACTION_DETAILS_SUCCESS,
  INVENTORY_TRANSACTION_DETAILS_FAIL,
  INVENTORY_TRANSACTION_DELETE_REQUEST,
  INVENTORY_TRANSACTION_DELETE_SUCCESS,
  INVENTORY_TRANSACTION_DELETE_FAIL,
  INVENTORY_TRANSACTION_CREATE_REQUEST,
  INVENTORY_TRANSACTION_CREATE_SUCCESS,
  INVENTORY_TRANSACTION_CREATE_FAIL,
  INVENTORY_TRANSACTION_CREATE_RESET,
  INVENTORY_TRANSACTION_UPDATE_REQUEST,
  INVENTORY_TRANSACTION_UPDATE_SUCCESS,
  INVENTORY_TRANSACTION_UPDATE_FAIL,
  INVENTORY_TRANSACTION_UPDATE_RESET,
  INVENTORY_STOCK_REQUEST,
  INVENTORY_STOCK_SUCCESS,
  INVENTORY_STOCK_FAIL,
  INVENTORY_REPORT_REQUEST,
  INVENTORY_REPORT_SUCCESS,
  INVENTORY_REPORT_FAIL,
} from '../constants/inventoryConstants';

export const inventoryTransactionListReducer = (state = { transactions: [] }, action) => {
  switch (action.type) {
    case INVENTORY_TRANSACTION_LIST_REQUEST:
      return { loading: true, transactions: [] };
    case INVENTORY_TRANSACTION_LIST_SUCCESS:
      return { loading: false, transactions: action.payload };
    case INVENTORY_TRANSACTION_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const inventoryTransactionDetailsReducer = (
  state = { transaction: {} },
  action
) => {
  switch (action.type) {
    case INVENTORY_TRANSACTION_DETAILS_REQUEST:
      return { loading: true, ...state };
    case INVENTORY_TRANSACTION_DETAILS_SUCCESS:
      return { loading: false, transaction: action.payload };
    case INVENTORY_TRANSACTION_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const inventoryTransactionDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case INVENTORY_TRANSACTION_DELETE_REQUEST:
      return { loading: true };
    case INVENTORY_TRANSACTION_DELETE_SUCCESS:
      return { loading: false, success: true };
    case INVENTORY_TRANSACTION_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const inventoryTransactionCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case INVENTORY_TRANSACTION_CREATE_REQUEST:
      return { loading: true };
    case INVENTORY_TRANSACTION_CREATE_SUCCESS:
      return { loading: false, success: true, transaction: action.payload };
    case INVENTORY_TRANSACTION_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case INVENTORY_TRANSACTION_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const inventoryTransactionUpdateReducer = (state = { transaction: {} }, action) => {
  switch (action.type) {
    case INVENTORY_TRANSACTION_UPDATE_REQUEST:
      return { loading: true };
    case INVENTORY_TRANSACTION_UPDATE_SUCCESS:
      return { loading: false, success: true, transaction: action.payload };
    case INVENTORY_TRANSACTION_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case INVENTORY_TRANSACTION_UPDATE_RESET:
      return { transaction: {} };
    default:
      return state;
  }
};

export const inventoryStockReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case INVENTORY_STOCK_REQUEST:
      return { loading: true, products: [] };
    case INVENTORY_STOCK_SUCCESS:
      return { 
        loading: false, 
        products: action.payload.products,
        lowStock: action.payload.lowStock 
      };
    case INVENTORY_STOCK_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const inventoryReportReducer = (state = {}, action) => {
  switch (action.type) {
    case INVENTORY_REPORT_REQUEST:
      return { loading: true };
    case INVENTORY_REPORT_SUCCESS:
      return { loading: false, report: action.payload };
    case INVENTORY_REPORT_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}; 