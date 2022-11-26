import React from 'react';
import BaseDialog from "../BaseDialog/BaseDialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {useDispatch, useSelector} from "react-redux";
import {confirmError} from "../../../Store/Errors/ErrorActions";
import {DialogContentText} from "@mui/material";

const ErrorDialog = () => {
    const dispatch = useDispatch();
    const {isConfirmError, errorMessage} = useSelector(({error}) => {
        return error;
    });

    const confirmErrorHandler = () => {
        dispatch(confirmError());
    }
    return (
       <BaseDialog open={!isConfirmError} onClosed={confirmErrorHandler}>
           <DialogTitle id="error-title">
               <span className='text-danger'>Error!</span>
           </DialogTitle>
           <DialogContent>
               <DialogContentText id='error' className='text-danger'>
                   {errorMessage}
               </DialogContentText>
           </DialogContent>
           <DialogActions>
               <Button variant='contained' color={'success'} onClick={confirmErrorHandler}>OK</Button>
           </DialogActions>
       </BaseDialog>
    );
};

export default ErrorDialog;