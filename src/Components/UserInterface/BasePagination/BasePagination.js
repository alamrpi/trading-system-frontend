import React from 'react';
import { Pagination } from '@mui/material';

const BasePagination = ({ totalRows, pageSize, currentPage, onChanged }) => {
  return (
    <Pagination
      count={Math.ceil(totalRows / pageSize)}
      defaultPage={1}
      className={'float-end'}
      page={currentPage}
      shape={'rounded'}
      showFirstButton={true}
      showLastButton={true}
      onChange={(e, page) => onChanged(page)}
      variant='outlined'
      color='primary'
    />
  );
};

export default BasePagination;
