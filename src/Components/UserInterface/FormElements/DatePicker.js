import React from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TextField from '@mui/material/TextField';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import Label from "./Label";

const DatePicker = ({label, name,isRequired, invalidMessage, value, placeholder, onChanged}) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <MuiDatePicker
                value={value}
                label=' '
                onChange={onChanged}
                toolbarPlaceholder={placeholder}
                renderInput={(params) => (
                    <div className='mb-1'>
                        <Label
                            label={label}
                            name={name}
                            isRequired={isRequired}
                        />
                        <TextField size={'small'} className={'form-control form-control-sm'} {...params}/>
                        {invalidMessage ? (
                            <div className="text-danger">
                                {invalidMessage}
                            </div>
                        ) : null}
                    </div>
                )}
            />
        </LocalizationProvider>
    );
};

export default DatePicker;