import axios from "axios";
import { errorHandler } from "../../Shared/utility";
import { setError } from "../Errors/ErrorActions";
import { CHANGE_USER_STATUS, SET_USER, SET_USERS } from "../Helpers/ActionsConstant";

export const setUsers = (users, totalRows, currentPage) => {
  return {
    type: SET_USERS,
    users: users,
    totalRows: totalRows,
    pageNumber: currentPage,
  };
};

export const setUser = (user) => {
  return {
    type: SET_USER,
    user: user,
  };
};

export const changeUserStatus = (id, status) => {
  return {
    type: CHANGE_USER_STATUS,
    id: id,
    status: status,
  };
};

export const getUser = (id, token) => {
  return (dispatch) => {
    axios
      .get(`/v1/business-admin/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ status, data }) => {
        if (status === 200) {
          dispatch(setUser(data));
        }
      })
      .catch((error) => {
        dispatch(setError(errorHandler(error)));
      });
  };
};
