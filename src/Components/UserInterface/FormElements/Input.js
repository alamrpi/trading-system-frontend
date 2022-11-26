import React from 'react';
import Label from "./Label";
import InvalidMessage from "./InvalidMessage";

const Input = ({label, name, placeholder, type, isRequired, inputClass, value, readonly, invalidMessage, onChanged}) => {

    const checkValidClass = () => {
        if(invalidMessage !== '')
           return 'is-invalid';
       return '';
    }

    return (
        <div className="mb-1">
            <Label
                name={name}
                label={label}
                isRequired={isRequired}
            />
            <input
                type={type}
                className={`${checkValidClass()} ${inputClass ? inputClass : `form-control form-control-sm`}`}
                id={name}
                name={name}
                required={isRequired}
                value={value}
                placeholder={placeholder}
                onChange={onChanged}
                readOnly={readonly}
                aria-describedby={`invalid_${name}`}
            />
              <InvalidMessage
                name={name}
                invalidMessage={invalidMessage}
              />
        </div>
    );
};

export default Input;