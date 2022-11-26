import { updateObject } from '../../Shared/utility';
import {
  CHANGE_USER_STATUS,
  SET_USER,
  SET_USERS,
} from '../Helpers/ActionsConstant';

const initialState = {
  users: null,
  totalRows: 0,
  pageNumber: 1,
  user: null,
};

const setUsers = (state, { users, totalRows, pageNumber }) => {
  return updateObject(state, {
    users: users,
    totalRows: totalRows,
    pageNumber: pageNumber,
  });
};

const setUser = (state, { user }) => {
  return updateObject(state, {
    user: user,
  });
};

const changeStatus = (state, { id, status }) => {
  let updatedRows = [...state.users];
  const index = updatedRows.findIndex((x) => x.id === id);
  updatedRows[index].isActive = status;

  return updateObject(state, {
    users: updatedRows,
  });
};

const UserReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USERS:
      return setUsers(state, action);
    case SET_USER:
      return setUser(state, action);
    case CHANGE_USER_STATUS:
      return changeStatus(state, action);
    default:
      return state;
  }
};

export default UserReducer;
