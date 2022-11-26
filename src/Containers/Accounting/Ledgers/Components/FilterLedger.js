import React, {useState} from 'react';

const FilterLedgers = ({options, headType, onChanged}) => {
    const [filterControls, setControls] = useState({
        headId:{
            options: options,
            value: ''
        },
        fromDate:{
            value: ''
        },
        toDate:{
            value: ''
        },
    })
    ///Filter input changed handler
    const onInputChangedHandler = (event, controlName) => {
        const updatedControl = {...filterControls};
        updatedControl[controlName].value = event.target.value;
        setControls(updatedControl);
    }

    ///filter submit handler
    const onSubmitHandler = (event) => {
        event.preventDefault();
        let data = {};

        for (let key in filterControls){
            data[key] = filterControls[key].value.toString();
        }
        onChanged(data)
    }

    return (
        <form onSubmit={onSubmitHandler}>
            <div className='row'>
                <div className={'col-md-12'}>
                    <label htmlFor="headId">{headType}</label>
                    <select
                        value={filterControls.headId.value}
                        name="headId" id="headId"
                        className='form-select form-select-sm'
                        onChange={(event) =>onInputChangedHandler(event, 'headId')}
                    >
                        <option value="">--All--</option>
                        {filterControls.headId.options.map(({value, text}) => (
                            <option value={value} key={value}>{text}</option>
                        ))}
                    </select>
                </div>

                <div className={ 'col-md-12'}>
                    <label htmlFor="fromDate">Date</label>
                    <div className='input-group input-group-sm'>
                        <input type="date" name='fromDate' id='fromDate'
                               value={filterControls.fromDate.value}
                               className='form-control'
                               onChange={(event) =>onInputChangedHandler(event, 'fromDate')}/>
                        <label htmlFor="toDate" className='input-group-text'>To</label>
                        <input type="date" name='toDate' id='toDate'
                               value={filterControls.toDate.value}
                               className='form-control'
                               onChange={(event) =>onInputChangedHandler(event, 'toDate')}/>
                    </div>
                </div>

                <div className='col-12 mt-2 text-end'>
                    <button className='btn btn-sm btn-primary'><i className='bi bi-filter-circle'></i> Get Ledger</button>
                </div>
            </div>
        </form>
    );
};

export default FilterLedgers;