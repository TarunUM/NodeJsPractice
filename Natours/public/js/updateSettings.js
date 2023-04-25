import axios from 'axios';
import { showAlert } from './alerts';

//TYPe is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updatepassword'
        : '/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} Updated Successfully`);
      //   window.setTimeout(() => {
      //     location.assign('/');
      //   }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
