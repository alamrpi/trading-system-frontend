import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import MainSection from '../../../Components/UserInterface/MainSection/Index';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../../Components/UserInterface/Loader/Index';
import { getUser } from '../../../Store/Users/UsersActions';

const DetailsUsers = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const [id] = useState(params.id);
  const [isLoading, setLoading] = useState(true);
  const { user } = useSelector(({ user }) => {
    return user;
  });

  useEffect(() => {
    dispatch(getUser(id, ''));
  }, [id]);

  useEffect(() => {
    if (user) setLoading(false);
  }, [user]);

  if (isLoading) return <Loader />;

  const {
    businessName,
    email,
    firstName,
    isActive,
    lastName,
    phoneNumber,
    photoUrl,
    storeName,
    userName,
  } = user;
  return (
    <MainSection
      title={'User Details'}
      breadcrumbPaths={[
        { name: 'Home', path: '/' },
        { name: 'Dashboard', path: '/super-admin' },
        { name: 'Businesses', path: '/super-admin/users' },
      ]}
    >
      <div className='row'>
        <div className='col-md-8 offset-md-2'>
          <table className='table table-sm table-bordered'>
            <tbody>
              <tr>
                <th>Business Name</th>
                <td>{businessName}</td>
              </tr>
              <tr>
                <th>Store Name</th>
                <td>{storeName}</td>
              </tr>
              <tr>
                <th>Name</th>
                <td>
                  {firstName}&nbsp;
                  {lastName}
                </td>
              </tr>
              <tr>
                <th>UserName</th>
                <td>{userName}</td>
              </tr>
              <tr>
                <th>Contact No</th>
                <td>{phoneNumber}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td>{email}</td>
              </tr>
              <tr>
                <th>Photo</th>
                <td>
                  <img src={photoUrl} alt="profile picture " className='img-thumbnail' height={150}/>
                </td>
              </tr>
              <tr></tr>
              <tr>
                <th>Status</th>
                <td>
                  {isActive ? (
                    <span className='badge bg-success'>Active</span>
                  ) : (
                    <span className='badge bg-danger'>De-active</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </MainSection>
  );
};

export default DetailsUsers;
