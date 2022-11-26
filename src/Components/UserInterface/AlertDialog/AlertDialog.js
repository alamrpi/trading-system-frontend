import React from 'react';
import BaseDialog from "../BaseDialog/BaseDialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import {DialogContentText} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

const AlertDialog = ({ open, alertMessage, onClosed, onConfirm}) => {
    return (
        <BaseDialog onClosed={onClosed} open={open}>
            <DialogTitle id="alert-dialogue-title">
                <span className='text-danger'>Confirm Alert!</span>
            </DialogTitle>
            <DialogContent>
                <DialogContentText id='alert-dialogue' className='text-dark'>
                    {alertMessage}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant='contained' color={'error'} onClick={onClosed}>Cancel</Button>
                <Button variant='contained' color={'success'} onClick={onConfirm}>Confirm</Button>
            </DialogActions>
        </BaseDialog>
    );
};

export default AlertDialog;