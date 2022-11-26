import React from 'react';
import Input from "../../../../Components/UserInterface/FormElements/Input";
import Select from "../../../../Components/UserInterface/FormElements/Select";

const SalesCalculationInfo = ({controls, onChanged}) => {
    return (
        <div className='col-md-12 '>
            <div className='card mb-2'>
                <div className='card-body'>
                    <div className='row'>
                        <div className='col-md-4'>
                            <Input
                                value={controls.discount.value}
                                label={controls.discount.label}
                                type={'text'} name={'discount'}
                                invalidMessage={controls.discount.validationError}
                                isRequired={true}
                                onChanged={(event) => onChanged(event, 'discount')}
                            />
                        </div>
                        <div className='col-md-4'>
                            <Select
                                value={controls.discountType.value}
                                label={controls.discountType.label}
                                options={controls.discountType.options}
                                name={'discountType'}
                                invalidMessage={controls.discountType.validationError}
                                isRequired={true}
                                onChanged={(event) => onChanged(event, 'discountType')}
                            />
                        </div>
                        <div className='col-md-4'>
                            <Input
                                value={controls.overhead.value}
                                label={controls.overhead.label}
                                type={'text'} name={'overhead'}
                                invalidMessage={controls.overhead.validationError}
                                isRequired={true}
                                onChanged={(event) => onChanged(event, 'overhead')}
                            />
                        </div>
                        <div className='col-md-4'>
                            <Input
                                value={controls.netPayableAmount.value}
                                label={controls.netPayableAmount.label}
                                type={'text'} name={'netPayable'}
                                invalidMessage={controls.netPayableAmount.validationError}
                                isRequired={true}
                                readonly={true}
                                onChanged={(event) => onChanged(event, 'netPayable')}
                            />
                        </div>
                        <div className='col-md-4'>
                            <Input
                                value={controls.paid.value}
                                label={controls.paid.label}
                                type={'text'} name={'paid'}
                                invalidMessage={controls.paid.validationError}
                                isRequired={true}
                                onChanged={(event) => onChanged(event, 'paid')}
                            />
                        </div>
                        <div className='col-md-4'>
                            <Input
                                value={controls.due.value}
                                label={controls.due.label}
                                type={'text'} name={'due'}
                                invalidMessage={controls.due.validationError}
                                isRequired={true}
                                readonly={true}
                                onChanged={(event) => onChanged(event, 'due')}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesCalculationInfo;