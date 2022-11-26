import React from 'react';
import Select from "../../../../Components/UserInterface/FormElements/Select";
import DatePicker from "../../../../Components/UserInterface/FormElements/DatePicker";

const SalesGeneralInfo = ({controls, onChanged}) => {
    return (
        <div className='col-md-12'>
            <div className='card mb-2'>
                <div className='card-body'>
                    <div className='row'>
                        <div className='col-md-6'>
                            <Select
                                value={controls.customerId.value}
                                label={controls.customerId.label}
                                options={controls.customerId.options}
                                name={'customerId'}
                                invalidMessage={controls.customerId.validationError}
                                isRequired={true}
                                onChanged={(event) => onChanged(event, 'customerId')}
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
                            <Select
                                value={controls.bankAccountId.value}
                                label={controls.bankAccountId.label}
                                options={controls.bankAccountId.options}
                                name={'bankAccountId'}
                                invalidMessage={controls.bankAccountId.validationError}
                                isRequired={true}
                                onChanged={(event) => onChanged(event, 'bankAccountId')}
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

export default SalesGeneralInfo;