import React from 'react';
import Label from "./Label";
import InvalidMessage from "./InvalidMessage";

const Select = ({label, name, isRequired, disabled, invalidMessage, inputClass, value, defaultOption, options, onChanged}) => {

    const checkValidClass = () => {
        if(invalidMessage !== '')
            return 'is-invalid';
        return '';
    }

    return (
        <div className='mb-1'>
            <Label
                name={name}
                label={label}
                isRequired={isRequired}
            />
            <select
                className={`${checkValidClass()} ${inputClass === '' ? inputClass : `form-control form-control-sm`}`}
                id={name}
                name={name}
                required={isRequired}
                value={value}
                onChange={onChanged}
                disabled={disabled}
                aria-describedby={`invalid_${name}`}>
                <option value="">{defaultOption ? defaultOption : '--Select--'}</option>
                {options.map(({text, value}) => (
                    <option key={value} value={value}>{text}</option>
                ))}
            </select>
            <InvalidMessage
                name={name}
                invalidMessage={invalidMessage}
            />
        </div>
    );
};

export default Select;