import React from 'react';
import Input from "../../../../../Components/UserInterface/FormElements/Input";

const BillCalculation = ({controls}) => {
    return (
        <div className='col-md-12 '>
            <div className='card mb-2'>
                <div className='card-body'>
                    <div className='row'>
                        <div className='col-md-4'>
                            <Input
                                value={controls.netPayableAmount.value}
                                label={controls.netPayableAmount.label}
                                type={'text'} name={'netPayable'}
                                invalidMessage={controls.netPayableAmount.validationError}
                                isRequired={true}
                                readonly={true}
                            />
                        </div>
                        <div className='col-md-4'>
                            <Input
                                value={controls.previousDue.value}
                                label={controls.previousDue.label}
                                type={'text'}
                                name={'previousDue'}
                                invalidMessage={controls.previousDue.validationError}
                                isRequired={true}
                                readonly={true}
                            />
                        </div>
                        <div className='col-md-4'>
                            <Input
                                value={controls.due.value}
                                label={controls.due.label}
                                type={'text'}
                                name={'due'}
                                invalidMessage={controls.due.validationError}
                                isRequired={true}
                                readonly={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillCalculation;