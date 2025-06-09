import {
  FINANCE_TRANSACTION_LIST_REQUEST,
  FINANCE_TRANSACTION_LIST_SUCCESS,
  FINANCE_TRANSACTION_LIST_FAIL,
  FINANCE_TRANSACTION_DETAILS_REQUEST,
  FINANCE_TRANSACTION_DETAILS_SUCCESS,
  FINANCE_TRANSACTION_DETAILS_FAIL,
  FINANCE_TRANSACTION_DELETE_REQUEST,
  FINANCE_TRANSACTION_DELETE_SUCCESS,
  FINANCE_TRANSACTION_DELETE_FAIL,
  FINANCE_TRANSACTION_CREATE_REQUEST,
  FINANCE_TRANSACTION_CREATE_SUCCESS,
  FINANCE_TRANSACTION_CREATE_FAIL,
  FINANCE_TRANSACTION_CREATE_RESET,
  FINANCE_TRANSACTION_UPDATE_REQUEST,
  FINANCE_TRANSACTION_UPDATE_SUCCESS,
  FINANCE_TRANSACTION_UPDATE_FAIL,
  FINANCE_TRANSACTION_UPDATE_RESET,
  FINANCE_REPORT_REQUEST,
  FINANCE_REPORT_SUCCESS,
  FINANCE_REPORT_FAIL,
} from '../constants/financeConstants';

export const financeTransactionListReducer = (state = { transactions: [] }, action) => {
  switch (action.type) {
    case FINANCE_TRANSACTION_LIST_REQUEST:
      return { loading: true, transactions: [] };
    case FINANCE_TRANSACTION_LIST_SUCCESS:
      return { loading: false, transactions: action.payload };
    case FINANCE_TRANSACTION_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const financeTransactionDetailsReducer = (
  state = { transaction: {} },
  action
) => {
  switch (action.type) {
    case FINANCE_TRANSACTION_DETAILS_REQUEST:
      return { loading: true, ...state };
    case FINANCE_TRANSACTION_DETAILS_SUCCESS:
      return { loading: false, transaction: action.payload };
    case FINANCE_TRANSACTION_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const financeTransactionDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case FINANCE_TRANSACTION_DELETE_REQUEST:
      return { loading: true };
    case FINANCE_TRANSACTION_DELETE_SUCCESS:
      return { loading: false, success: true };
    case FINANCE_TRANSACTION_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const financeTransactionCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case FINANCE_TRANSACTION_CREATE_REQUEST:
      return { loading: true };
    case FINANCE_TRANSACTION_CREATE_SUCCESS:
      return { loading: false, success: true, transaction: action.payload };
    case FINANCE_TRANSACTION_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case FINANCE_TRANSACTION_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const financeTransactionUpdateReducer = (state = { transaction: {} }, action) => {
  switch (action.type) {
    case FINANCE_TRANSACTION_UPDATE_REQUEST:
      return { loading: true };
    case FINANCE_TRANSACTION_UPDATE_SUCCESS:
      return { loading: false, success: true, transaction: action.payload };
    case FINANCE_TRANSACTION_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case FINANCE_TRANSACTION_UPDATE_RESET:
      return { transaction: {} };
    default:
      return state;
  }
};

export const financeReportReducer = (state = {}, action) => {
  switch (action.type) {
    case FINANCE_REPORT_REQUEST:
      return { loading: true };
    case FINANCE_REPORT_SUCCESS:
      return { loading: false, cashflow: action.payload };
    case FINANCE_REPORT_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}; 