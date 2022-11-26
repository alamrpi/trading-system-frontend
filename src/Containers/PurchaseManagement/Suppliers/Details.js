import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from "react-router";
import MainSection from "../../../Components/UserInterface/MainSection/Index"
import axios from "axios";
import {setError} from "../../../Store/Errors/ErrorActions";
import {errorHandler} from "../../../Shared/utility";
import {useDispatch, useSelector} from "react-redux";
import Loader from "../../../Components/UserInterface/Loader/Index"

const Details = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [supplier, setSupplier] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [id] = useState(params.id);
    const {token} = useSelector(({auth})=> {
        return auth;
    })

    useEffect(() => {
        loadSuppliers();
    },[id])

    const loadSuppliers = () => {
        axios.get(`v1/suppliers/get/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if(status === 200){
                setSupplier(data);
                setLoading(false);
            }
        }).catch(error => {
            dispatch(setError(errorHandler(error)));
            navigate('/purchase-management/suppliers/', {replace: true});
        });
    }


    if(isLoading)
        return <Loader/>;

    const {name, supplierId, mobile, email, address, descriptions} = supplier;
    return (
        <MainSection
            title={'Supplier Details'}
            breadcrumbPaths={[{name: 'Home', path: '/'}, {name: 'Dashboard', path: '/purchase-management'}, {name: 'Suppliers', path: '/purchase-management/suppliers'}]}
        >
            <div className='row'>
                <div className='col-md-10 offset-md-1'>
                    <table className='table table-sm table-bordered'>
                        <tbody>
                        <tr>
                            <th>Supplier Name</th>
                            <td>{ name } </td>
                            <th>Supplier ID</th>
                            <td>{ supplierId } </td>
                        </tr>
                        <tr>
                            <th>Mobile</th>
                            <td>{ mobile } </td>
                            <th>Email</th>
                            <td>{ email } </td>
                        </tr>
                        <tr>
                            <th>Address</th>
                            <td>{ address } </td>
                            <th>Descriptions</th>
                            <td>{ descriptions }</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </MainSection>
    );
};

export default Details;