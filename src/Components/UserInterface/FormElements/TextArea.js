import React from 'react';
import InvalidMessage from "./InvalidMessage";
import Label from "./Label";

const TextArea = ({label, name, placeholder, rows, isRequired, inputClass, value, invalidMessage, onChanged}) => {
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
            <textarea
                rows={rows ? rows : 3}
                className={`${checkValidClass()} ${inputClass ? inputClass : `form-control form-control-sm`}`}
                id={name}
                name={name}
                required={isRequired}
                placeholder={placeholder}
                onChange={onChanged}
                value={value}
                aria-describedby={`invalid_${name}`}
            >

            </textarea>
            <InvalidMessage
                name={name}
                invalidMessage={invalidMessage}
            />
        </div>
    );
};

export default TextArea;