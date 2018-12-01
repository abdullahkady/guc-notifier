/* eslint-disable */
const form = document.querySelector('#form');
const button = document.querySelector('#submit-button');
const spinner = document.querySelector('#spinner');
const API_URI = 'http://localhost:3000';

const toggleSpinner = () => {
  button.hidden = !button.hidden;
  spinner.hidden = !spinner.hidden;
};

form.addEventListener('submit', e => {
  e.preventDefault();
  toggleSpinner();
  const formData = new FormData(e.target);
  const payload = {
    username: formData.get('username'),
    password: formData.get('password'),
    email: formData.get('email'),
  };

  axios
    .post(API_URI, payload)
    .then(response => {})
    .catch(response => {})
    .finally(toggleSpinner);
});
