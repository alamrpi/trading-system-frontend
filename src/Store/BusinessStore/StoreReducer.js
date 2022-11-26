import {
  CHANGE_STORE_STATUS,
  SET_STORE,
  SET_STORES,
  STORE_DDL_LOADING,
  STORE_DDL_SET_DATA,
} from '../Helpers/ActionsConstant';
import { updateObject } from '../../Shared/utility';

const initialState = {
  stores: null,
  totalRows: 0,
  pageNumber: 1,
  store: null,
  dropdown: {
    loading: true,
    data: null,
  },
};

const setStores = (state, { stores, totalRows, pageNumber }) => {
  return updateObject(state, {
    isLoading: false,
    stores: stores,
    totalRows: totalRows,
    pageNumber: pageNumber,
  });
};

const setStore = (state, { store }) => {
  return updateObject(state, {
    store: store,
  });
};

const changeStatus = (state, { id, status }) => {
  let updatedRows = [...state.stores];
  const index = updatedRows.findIndex((x) => x.id === id);
  updatedRows[index].isActive = status;

  return updateObject(state, {
    isLoading: false,
    stores: updatedRows,
  });
};

const setStoreDdlDataLoading = (state, { isLoading }) => {
  let updatedDdl = { ...state.dropdown };
  updatedDdl.loading = isLoading;

  return updateObject(state, {
    dropdown: updatedDdl,
  });
};

const setStoreDdlData = (state, { data }) => {
  let updatedDdl = { ...state.dropdown };

  updatedDdl.loading = false;
  updatedDdl.data = data;

  return updateObject(state, {
    dropdown: updatedDdl,
  });
};

const StoreReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_STORES:
      return setStores(state, action);
    case SET_STORE:
      return setStore(state, action);
    case CHANGE_STORE_STATUS:
      return changeStatus(state, action);
    case STORE_DDL_LOADING:
      return setStoreDdlDataLoading(state, action);
    case STORE_DDL_SET_DATA:
      return setStoreDdlData(state, action);
    default:
      return state;
  }
};

export default StoreReducer;
