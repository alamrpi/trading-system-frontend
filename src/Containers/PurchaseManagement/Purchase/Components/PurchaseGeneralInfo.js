import React from 'react';
import Select from "../../../../Components/UserInterface/FormElements/Select";
import Input from "../../../../Components/UserInterface/FormElements/Input";
import DatePicker from "../../../../Components/UserInterface/FormElements/DatePicker";

const PurchaseGeneralInfo = ({controls, onChanged}) => {
    return (
        <div className='col-md-12'>
            <div className='card mb-2'>
                <div className='card-body'>
                    <div className='row'>
                        <div className='col-md-6'>
                            <Select
                                value={controls.supplierId.value}
                                label={controls.supplierId.label}
                                options={controls.supplierId.options}
                                name={'supplierId'}
                                invalidMessage={controls.supplierId.validationError}
                                isRequired={true}
                                onChanged={(event) => onChanged(event, 'supplierId')}
                            />
                        </div>
                        <div className='col-md-6'>
                            <Select
                                value={controls.storeId.value}
                                label={controls.storeId.label}
                                options={controls.storeId.options}
                                name={'storeId'}
                                invalidMessage={controls.storeId.validationError}
                                isRequired={true}
                                onChanged={(event) => onChanged(event, 'storeId')}
                            />
                        </div>
                        <div className='col-md-6'>
                            <Input
                                value={controls.invoiceNumber.value}
                                label={controls.invoiceNumber.label}
                                type={'text'} name={'invoice'}
                                invalidMessage={controls.invoiceNumber.validationError}
                                isRequired={true}
                                onChanged={(event) => onChanged(event, 'invoiceNumber')}
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

export default PurchaseGeneralInfo;