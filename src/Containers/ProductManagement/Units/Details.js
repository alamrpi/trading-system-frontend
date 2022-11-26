import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from "react-router";
import MainSection from "../../../Components/UserInterface/MainSection/Index"
import axios from "axios";
import {setError} from "../../../Store/Errors/ErrorActions";
import {errorHandler} from "../../../Shared/utility";
import {useDispatch, useSelector} from "react-redux";
import Loader from "../../../Components/UserInterface/Loader/Index"
import {Button, ButtonGroup} from "@mui/material";
import AlertDialog from "../../../Components/UserInterface/AlertDialog/AlertDialog";
import {toast} from "react-toastify";
import {closeLoader, openLoader} from "../../../Store/OverlayLoader/OverlayLoaderActions";

const Details = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [unit, setUnit] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [id] = useState(params.id);
    const [alertDialogue, setAlertDialogue] = useState(false);
    const [selectedId, setSelectedId] = useState(false);
    const {token} = useSelector(({auth})=> {
        return auth;
    })

    useEffect(() => {
        loadUnit();
    },[id])

    const loadUnit = () => {
        axios.get(`v1/units/get/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({status, data}) => {
            if(status === 200){
                setUnit(data);
                setLoading(false);
            }
        }).catch(error => {
            dispatch(setError(errorHandler(error)));
            navigate('/pdm/units/', {replace: true});
        });
    }

    const deleteVariations = () => {
        setAlertDialogue(false);
        dispatch(openLoader());
        axios.post(`/v1/units/${unit.id}/delete-variations`, {variationId: selectedId}, {
            headers: {'Authorization' : `Bearer ${token}`}
        }).then(({status}) => {
            if(status === 204){
                toast.success('Unit has been deleted success.')
                loadUnit();
                dispatch(closeLoader());
            }
        }).catch(error => {
            dispatch(closeLoader());
            dispatch(setError(errorHandler(error)))
        });
    }

    if(isLoading)
        return <Loader/>;

    const {name, symbol, comments, unitVariations} = unit;
    return (
        <MainSection
            title={'Details'}
            breadcrumbPaths={[{name: 'Home', path: '/'}, {name: 'Dashboard', path: '/pdm'}, {name: 'Units', path: '/pdm/units'}]}
        >
            <div className='row'>
                <div className='col-md-10 offset-md-1'>
                    <Button onClick={() => navigate(`/pdm/units/create-variation/${unit.id}`)} className='mb-2' size='small' variant={"contained"} color='primary'>Add Variations</Button>
                    <table className='table table-sm table-bordered'>
                        <tbody>
                        <tr>
                            <th>Unit Name</th>
                            <td>{ name } </td>
                            <th>Unit Symbol</th>
                            <td>{ symbol } </td>
                        </tr>
                        <tr>
                            <th>Comments</th>
                            <td colSpan={3}>{comments}</td>
                        </tr>
                        <tr>
                            <th>Variations</th>
                            <td colSpan={3}>
                                <table className='table table-sm table-bordered'>
                                    <thead>
                                    <tr>
                                        <th className={'text-center'}>#</th>
                                        <th>Name</th>
                                        <th className='text-center'>Base Qty</th>
                                        <th className='text-center'>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {unitVariations.map(({id, name, qnty}, idx) => (
                                        <tr key={idx}>
                                            <td className='text-center'>{idx + 1}</td>
                                            <td>{name}</td>
                                            <td className='text-center'>{qnty}</td>
                                            <td className='text-center' style={{width: '20%'}}>
                                                <ButtonGroup variant="contained" aria-label="outlined primary button group">
                                                    <Button size={'small'} color={'error'} title='Delete Variation' onClick={() => {setAlertDialogue(true); setSelectedId(id)}}><i className={'bi bi-trash'}></i></Button>
                                                </ButtonGroup>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <AlertDialog
                alertMessage={'Are you sure want to delete variations?'}
                open={alertDialogue}
                onClosed={() => setAlertDialogue(false)}
                onConfirm={deleteVariations}
            />
        </MainSection>
    );
};

export default Details;