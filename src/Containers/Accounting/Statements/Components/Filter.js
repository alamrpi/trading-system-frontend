import React, {useState} from 'react';

const Filter = ({onChanged}) => {
    const [filterControls, setControls] = useState({
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
                        <button className='btn btn-sm btn-primary ms-2'><i className='bi bi-filter-circle'></i> Get</button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default Filter;