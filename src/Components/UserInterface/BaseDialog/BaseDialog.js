import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const BaseDialog = ({open, children, onClosed}) => {
    return (
        <div>
            <Dialog open={open} onClose={onClosed}>
                {children}
            </Dialog>
        </div>
    );
};

export default BaseDialog;