import axios from 'axios';
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
  SALE_UPDATE_REQUEST,
  SALE_UPDATE_SUCCESS,
  SALE_UPDATE_FAIL,
  SALE_REPORT_REQUEST,
  SALE_REPORT_SUCCESS,
  SALE_REPORT_FAIL,
} from '../constants/saleConstants';

// List all sales
export const listSales = () => async (dispatch, getState) => {
  try {
    dispatch({ type: SALE_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get('/api/sales', config);

    dispatch({
      type: SALE_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SALE_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Get sale details
export const getSaleDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: SALE_DETAILS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/sales/${id}`, config);

    dispatch({
      type: SALE_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SALE_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Delete a sale
export const deleteSale = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: SALE_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.delete(`/api/sales/${id}`, config);

    dispatch({ type: SALE_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: SALE_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Create a sale
export const createSale = (sale) => async (dispatch, getState) => {
  try {
    dispatch({ type: SALE_CREATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post('/api/sales', sale, config);

    dispatch({
      type: SALE_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SALE_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Update a sale
export const updateSale = (sale) => async (dispatch, getState) => {
  try {
    dispatch({ type: SALE_UPDATE_REQUEST });

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
      `/api/sales/${sale._id}`,
      sale,
      config
    );

    dispatch({
      type: SALE_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SALE_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Get sales report
export const getSalesReport = (params) => async (dispatch, getState) => {
  try {
    dispatch({ type: SALE_REPORT_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post('/api/sales/report', params || {}, config);

    dispatch({
      type: SALE_REPORT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SALE_REPORT_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
}; 