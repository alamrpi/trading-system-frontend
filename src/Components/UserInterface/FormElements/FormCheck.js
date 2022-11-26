import React from "react";
import Label from "./Label";
import InvalidMessage from "./InvalidMessage";

const FormCheck = ({label, name, isRequired, invalidMessage, inputClass, value, onChanged}) => {

    const checkValidClass = () => {
        if(invalidMessage !== '')
            return 'is-invalid';
        return '';
    }

    return (
        <div className="form-check">
            <input
                type='checkbox'
                className={`${checkValidClass()} ${inputClass === '' ? inputClass : `form-check-input`}`}
                id={name}
                name={name}
                required={isRequired}
                value={value}
                onChange={onChanged}
                aria-describedby={`invalid_${name}`}
            />
            <Label
                name={name}
                label={label}
                isRequired={isRequired}
            />
            <InvalidMessage
                name={name}
                invalidMessage={invalidMessage}
            />
        </div>
    );
};

export default FormCheck;