import React from 'react';

const Label = ({label, name, isRequired}) => {
    if(label)
        return (
            <label htmlFor={name} className="form-label">
                {label}
                {isRequired ? (<span className='text-danger'>*</span>) : null}
            </label>
        );

    return null;
};

export default Label;