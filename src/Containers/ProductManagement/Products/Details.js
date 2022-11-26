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

    const [product, setProduct] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [id] = useState(params.id);
    const {token} = useSelector(({auth})=> {
        return auth;
    })

    useEffect(() => {
        loadProduct();
    },[id])

    const loadProduct = () => {
        axios.get(`v1/products/get/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if(status === 200){
                setProduct(data);
                setLoading(false);
            }
        }).catch(error => {
            dispatch(setError(errorHandler(error)));
            navigate('/pdm/products/', {replace: true});
        });
    }


    if(isLoading)
        return <Loader/>;

    const {name, groupName, categoryName, brandName, unitName, alertQty,  descriptions} = product;
    return (
        <MainSection
            title={'Product Details'}
            breadcrumbPaths={[{name: 'Home', path: '/'}, {name: 'Dashboard', path: '/pdm'}, {name: 'Products', path: '/pdm/products'}]}
        >
            <div className='row'>
                <div className='col-md-10 offset-md-1'>
                    <table className='table table-sm table-bordered'>
                        <tbody>
                        <tr>
                            <th>Product Name</th>
                            <td>{ name } </td>
                            <th>Group Name</th>
                            <td>{ groupName } </td>
                        </tr>
                        <tr>
                            <th>Category Name</th>
                            <td>{ categoryName } </td>
                            <th>Brand Name</th>
                            <td>{ brandName } </td>
                        </tr>
                        <tr>
                            <th>Unit Name</th>
                            <td>{ unitName } </td>
                            <th>Alert Qty</th>
                            <td>{ alertQty } {unitName}</td>
                        </tr>
                        <tr>
                            <th>Comments</th>
                            <td colSpan={3}>{descriptions}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </MainSection>
    );
};

export default Details;