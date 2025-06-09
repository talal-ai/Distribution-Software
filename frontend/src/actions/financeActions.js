import axios from 'axios';
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
  FINANCE_TRANSACTION_UPDATE_REQUEST,
  FINANCE_TRANSACTION_UPDATE_SUCCESS,
  FINANCE_TRANSACTION_UPDATE_FAIL,
  FINANCE_REPORT_REQUEST,
  FINANCE_REPORT_SUCCESS,
  FINANCE_REPORT_FAIL,
} from '../constants/financeConstants';

// List all finance transactions
export const listFinanceTransactions = () => async (dispatch, getState) => {
  try {
    dispatch({ type: FINANCE_TRANSACTION_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get('/api/finance/transactions', config);

    dispatch({
      type: FINANCE_TRANSACTION_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FINANCE_TRANSACTION_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Get finance transaction details
export const getFinanceTransactionDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: FINANCE_TRANSACTION_DETAILS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/finance/transactions/${id}`, config);

    dispatch({
      type: FINANCE_TRANSACTION_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FINANCE_TRANSACTION_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Delete a finance transaction
export const deleteFinanceTransaction = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: FINANCE_TRANSACTION_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.delete(`/api/finance/transactions/${id}`, config);

    dispatch({ type: FINANCE_TRANSACTION_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: FINANCE_TRANSACTION_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Create a finance transaction
export const createFinanceTransaction = (transaction) => async (dispatch, getState) => {
  try {
    dispatch({ type: FINANCE_TRANSACTION_CREATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post('/api/finance/transactions', transaction, config);

    dispatch({
      type: FINANCE_TRANSACTION_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FINANCE_TRANSACTION_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Update a finance transaction
export const updateFinanceTransaction = (transaction) => async (dispatch, getState) => {
  try {
    dispatch({ type: FINANCE_TRANSACTION_UPDATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(
      `/api/finance/transactions/${transaction._id}`,
      transaction,
      config
    );

    dispatch({
      type: FINANCE_TRANSACTION_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FINANCE_TRANSACTION_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Get finance report
export const getFinanceReport = (params) => async (dispatch, getState) => {
  try {
    dispatch({ type: FINANCE_REPORT_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post('/api/finance/report', params || {}, config);

    dispatch({
      type: FINANCE_REPORT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FINANCE_REPORT_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
}; 