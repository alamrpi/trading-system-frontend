import React from 'react';
import Input from "../../../../../Components/UserInterface/FormElements/Input";
import DatePicker from "../../../../../Components/UserInterface/FormElements/DatePicker";

const ReturnGeneralInfo = ({controls, onChanged}) => {
    return (
        <div className='col-md-12'>
            <div className='card mb-2'>
                <div className='card-body'>
                    <div className='row'>
                        <div className='col-md-6'>
                            <Input
                                value={controls.supplier.value}
                                label={controls.supplier.label}
                                type={'text'}
                                name={'supplier'}
                                invalidMessage={''}
                                isRequired={true}
                               readonly={true}
                            />
                        </div>
                        <div className='col-md-6'>
                            <Input
                                value={controls.store.value}
                                label={controls.store.label}
                                type={'text'}
                                name={'supplier'}
                                invalidMessage={''}
                                isRequired={true}
                                readonly={true}
                            />
                        </div>
                        <div className='col-md-6'>
                            <Input
                                value={controls.invoiceNumber.value}
                                label={controls.invoiceNumber.label}
                                type={'text'} name={'invoice'}
                                invalidMessage={''}
                                isRequired={true}
                                readonly={true}
                            />
                        </div>
                        <div className='col-md-6'>
                            <DatePicker
                                value={controls.date.value}
                                label={controls.date.label}
                                name={'date'}
                                isRequired={true}
                                invalidMessage={controls.date.validationError}
                                onChanged={(event) => onChanged(event, 'date')}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReturnGeneralInfo;