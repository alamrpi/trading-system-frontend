import React, { useState } from 'react';
import { Button } from '@mui/material';
import Loader from '../Loader/Index';
import * as INPUT_TYPES from '../../../Const/INPUT_TYPES';
import Input from '../FormElements/Input';
import Select from '../FormElements/Select';
import { IS_REQUIRED } from '../../../Const/VALIDATIONS';
import DatePicker from '../FormElements/DatePicker';
import TextArea from '../FormElements/TextArea';
import {
  checkValidation,
  reFormatForRequestBody,
} from '../../../Shared/utility';

const BaseForm = ({
  controls,
  loading,
  btnText,
  btnIcon,
  btnColor,
  btnSize,
  setControls,
  onSubmittedForm,
  existsOnChanged
}) => {
  const [formIsValid, setFormValidation] = useState(false);

  const onChangedHandler = (event, controlName) => {
    const updatedControls = { ...controls };
    let value;
    const { validation, label, type } = updatedControls[controlName];

    switch (type) {
      case INPUT_TYPES.DATE_PICKER:
        value = event;
        break;
      default:
        value = event.target.value;
        break;
    }

    updatedControls[controlName] = {
      ...updatedControls[controlName],
      value: value,
      ...checkValidation(value, validation, label),
      touched: true,
    };

    let isFormValid = true;
    for (let controlName in updatedControls) {
      if(controlName !== 'multiForms')
        isFormValid = updatedControls[controlName].isValid && isFormValid;
    }

    setFormValidation(isFormValid);

    if(existsOnChanged){
      existsOnChanged(value, controlName, updatedControls);
    }else{
      setControls(updatedControls);
    }

    if(updatedControls[controlName].caseCadeFunction){
      updatedControls[controlName].caseCadeFunction(value, updatedControls);
    }
  };

  const onMultiFormChangedHandler = (index, identifier, event) => {
    const updatedControls = { ...controls };
    const multiFormControl = updatedControls.multiForms.controls;

    let value;
    const { type } = multiFormControl[identifier];

    switch (type) {
      case INPUT_TYPES.DATE_PICKER:
        value = event;
        break;
      default:
        value = event.target.value;
        break;
    }

    updatedControls.multiForms.rows[index][identifier] = value;
    setControls(updatedControls);
  }

  const onSubmitHandler = (event) => {
    event.preventDefault();
    let data = reFormatForRequestBody(controls);
    if(controls.multiForms !== undefined)
      data.multi = controls.multiForms.rows;

    onSubmittedForm(data);
  };

  const addMoreField = () => {
    const updatedControls = {...controls};
    let row = {};
    for (let key in  controls.multiForms.controls){
      row[key] = '';
    }
    updatedControls.multiForms.rows.push(row);
    setControls(updatedControls)
  }

  const removeMoreField = (index) => {
    const updatedControls = {...controls};
    updatedControls.multiForms.rows.splice(index, 1);
    setControls(updatedControls);
  }

  if (loading) return <Loader />;

  let formControls = [];
  let multiRows = [];
  let multiRowsHeading = [];
  for (let controlName in controls) {
    if(controlName === 'multiForms')
    {
      const multiControls = controls[controlName].controls;
        for (let key in multiControls){
          multiRowsHeading.push({
            id: key,
            config: multiControls[key]
          });
        }

        multiRows = controls[controlName].rows;
    }else{
      formControls.push({
        id: controlName,
        config: controls[controlName],
      });
    }
  }
  return (
    <form action='' autoComplete='off' method='post' onSubmit={onSubmitHandler}>
      <div className='row'>
        {formControls.map(({ id, config }) => (
          <Control
            id={id}
            {...config}
            key={id}
            onChanged={(event) => onChangedHandler(event, id)}
          />
        ))}
        {multiRowsHeading.length > 0 ? (
            <div className='col-md-12'>
              <div className='card'>
                <div className='card-body'>
                  <table className='table table-sm table-borderless'>
                    <thead>
                    <tr>
                      {multiRowsHeading.map(({config}) => (
                          <th key={config.name} className={config.labelClass ? config.labelClass : ''}>{config.name}</th>
                      ))}
                      <th className='text-end text-danger'>Remove</th>
                    </tr>
                    </thead>
                    <tbody>
                    {multiRows.map((item, idx) => (
                        <tr key={idx}>
                          {multiRowsHeading.map(({id, config}) => (
                              <td key={config.name}>
                                <Control
                                    id={id}
                                    {...config}
                                    key={id}
                                    value={item[id]}
                                    onChanged={(event) => onMultiFormChangedHandler(idx, id, event)}
                                />
                              </td>
                          ))}
                          <td className='text-end'>
                            {idx !== 0 ? (
                                <button className='btn btn-sm btn-outline-danger' type='button' onClick={() => removeMoreField(idx)}><i className='bi bi-x-circle'></i></button>
                            ) : null}
                          </td>
                        </tr>
                    ))}
                    <tr>
                      <td colSpan={multiRowsHeading.length + 1} className='text-end'>
                        <button className='btn btn-sm btn-outline-success' type='button' onClick={addMoreField}><i className='bi bi-plus-circle'></i> Add More</button>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
        ) : null}


        <div className='col-md-12 text-end mt-1'>
          <Button
            variant='contained'
            size={btnSize ? btnSize : 'small'}
            color={btnColor ? btnColor : 'primary'}
            type='submit'
            disabled={formControls.length > 0 ? !formIsValid : false}
          >
            {btnIcon ? btnIcon : null} {btnText ? btnText : 'Submit'}
          </Button>
        </div>
      </div>
    </form>
  );
};

const Control = ({type, id, label, readOnly, placeholder, value, options, inputClass, validation, validationError, disabled, controlColumn, onChanged}) => {
  let content;
  switch (type) {
    case INPUT_TYPES.SELECT:
      content = (
        <Select
          name={id}
          label={label}
          value={value}
          options={options}
          inputClass={inputClass}
          isRequired={validation[IS_REQUIRED]}
          invalidMessage={validationError}
          disabled={disabled}
          onChanged={onChanged}
        />
      );
      break;
    case INPUT_TYPES.DATE_PICKER:
      content = (
        <DatePicker
          name={id}
          label={label}
          value={value}
          isRequired={validation[IS_REQUIRED]}
          invalidMessage={validationError}
          placeholder={placeholder}
          onChanged={onChanged}
        />
      );
      break;
    case INPUT_TYPES.TEXT_AREA:
      content = (
        <TextArea
          value={value}
          label={label}
          name={id}
          isRequired={validation[IS_REQUIRED]}
          invalidMessage={validationError}
          placeholder={placeholder}
          inputClass={inputClass}
          onChanged={onChanged}
        />
      );
      break;
    default:
      content = (
        <Input
          type={type}
          value={value}
          label={label}
          name={id}
          isRequired={validation[IS_REQUIRED]}
          invalidMessage={validationError}
          placeholder={placeholder}
          inputClass={inputClass}
          onChanged={onChanged}
          readonly={readOnly}
        />
      );
  }
  return <div className={controlColumn ? controlColumn : 'col-md-12'}>{content}</div>;
};

export default BaseForm;
