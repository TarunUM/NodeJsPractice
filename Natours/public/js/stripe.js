import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { showAlert } from './alerts';

const stripe = loadStripe(
  'pk_test_51N04hISFtY1VeG5fGGGTUWvhKDqXgzotkzQvqCaT9HYHowQAs7PY3NacyUfeDTpLG2Evfg0OaxLaNLpLONBwTdsg00Vl0ZcqU0'
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get Chckout Session From application
    const session = await axios(`/api/v1/booking/checkout-session/${tourId}`);

    // console.log(session.data.session.url);

    // 2) Create checkout form + chanre credit card
    window.location.href = session.data.session.url;
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
