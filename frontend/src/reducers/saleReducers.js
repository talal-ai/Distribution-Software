import {
  SALE_LIST_REQUEST,
  SALE_LIST_SUCCESS,
  SALE_LIST_FAIL,
  SALE_DETAILS_REQUEST,
  SALE_DETAILS_SUCCESS,
  SALE_DETAILS_FAIL,
  SALE_DELETE_REQUEST,
  SALE_DELETE_SUCCESS,
  SALE_DELETE_FAIL,
  SALE_CREATE_REQUEST,
  SALE_CREATE_SUCCESS,
  SALE_CREATE_FAIL,
  SALE_CREATE_RESET,
  SALE_UPDATE_REQUEST,
  SALE_UPDATE_SUCCESS,
  SALE_UPDATE_FAIL,
  SALE_UPDATE_RESET,
  SALE_REPORT_REQUEST,
  SALE_REPORT_SUCCESS,
  SALE_REPORT_FAIL,
} from '../constants/saleConstants';

export const saleListReducer = (state = { sales: [] }, action) => {
  switch (action.type) {
    case SALE_LIST_REQUEST:
      return { loading: true, sales: [] };
    case SALE_LIST_SUCCESS:
      return { loading: false, sales: action.payload };
    case SALE_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const saleDetailsReducer = (
  state = { sale: { items: [], customer: {}, payment: {}, user: {} } },
  action
) => {
  switch (action.type) {
    case SALE_DETAILS_REQUEST:
      return { loading: true, ...state };
    case SALE_DETAILS_SUCCESS:
      return { loading: false, sale: action.payload };
    case SALE_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const saleDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case SALE_DELETE_REQUEST:
      return { loading: true };
    case SALE_DELETE_SUCCESS:
      return { loading: false, success: true };
    case SALE_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const saleCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case SALE_CREATE_REQUEST:
      return { loading: true };
    case SALE_CREATE_SUCCESS:
      return { loading: false, success: true, sale: action.payload };
    case SALE_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case SALE_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const saleUpdateReducer = (state = { sale: {} }, action) => {
  switch (action.type) {
    case SALE_UPDATE_REQUEST:
      return { loading: true };
    case SALE_UPDATE_SUCCESS:
      return { loading: false, success: true, sale: action.payload };
    case SALE_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case SALE_UPDATE_RESET:
      return { sale: {} };
    default:
      return state;
  }
};

export const saleReportReducer = (state = {}, action) => {
  switch (action.type) {
    case SALE_REPORT_REQUEST:
      return { loading: true };
    case SALE_REPORT_SUCCESS:
      return { 
        loading: false, 
        dailySales: action.payload.dailySales,
        monthlySales: action.payload.monthlySales
      };
    case SALE_REPORT_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}; 