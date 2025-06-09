import axios from 'axios';
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
  INVENTORY_TRANSACTION_UPDATE_REQUEST,
  INVENTORY_TRANSACTION_UPDATE_SUCCESS,
  INVENTORY_TRANSACTION_UPDATE_FAIL,
  INVENTORY_STOCK_REQUEST,
  INVENTORY_STOCK_SUCCESS,
  INVENTORY_STOCK_FAIL,
  INVENTORY_REPORT_REQUEST,
  INVENTORY_REPORT_SUCCESS,
  INVENTORY_REPORT_FAIL,
} from '../constants/inventoryConstants';

// List all inventory transactions
export const listInventoryTransactions = () => async (dispatch, getState) => {
  try {
    dispatch({ type: INVENTORY_TRANSACTION_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get('/api/inventory/transactions', config);

    dispatch({
      type: INVENTORY_TRANSACTION_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: INVENTORY_TRANSACTION_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Get inventory transaction details
export const getInventoryTransactionDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: INVENTORY_TRANSACTION_DETAILS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/inventory/transactions/${id}`, config);

    dispatch({
      type: INVENTORY_TRANSACTION_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: INVENTORY_TRANSACTION_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Delete an inventory transaction
export const deleteInventoryTransaction = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: INVENTORY_TRANSACTION_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.delete(`/api/inventory/transactions/${id}`, config);

    dispatch({ type: INVENTORY_TRANSACTION_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: INVENTORY_TRANSACTION_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Create an inventory transaction
export const createInventoryTransaction = (transaction) => async (dispatch, getState) => {
  try {
    dispatch({ type: INVENTORY_TRANSACTION_CREATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post('/api/inventory/transactions', transaction, config);

    dispatch({
      type: INVENTORY_TRANSACTION_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: INVENTORY_TRANSACTION_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Update an inventory transaction
export const updateInventoryTransaction = (transaction) => async (dispatch, getState) => {
  try {
    dispatch({ type: INVENTORY_TRANSACTION_UPDATE_REQUEST });

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
      `/api/inventory/transactions/${transaction._id}`,
      transaction,
      config
    );

    dispatch({
      type: INVENTORY_TRANSACTION_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: INVENTORY_TRANSACTION_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Get current inventory stock
export const getInventoryStock = () => async (dispatch, getState) => {
  try {
    dispatch({ type: INVENTORY_STOCK_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get('/api/inventory/stock', config);

    dispatch({
      type: INVENTORY_STOCK_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: INVENTORY_STOCK_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Get inventory report
export const getInventoryReport = (params) => async (dispatch, getState) => {
  try {
    dispatch({ type: INVENTORY_REPORT_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post('/api/inventory/report', params, config);

    dispatch({
      type: INVENTORY_REPORT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: INVENTORY_REPORT_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
}; 