/* eslint-disable */
const form = document.querySelector('#form');
const button = document.querySelector('#submit-button');
const spinner = document.querySelector('#spinner');
// Retrieve the host dynamically, without the usage of a JS bundler
const API_URI = window.location.href;

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
    .then(response => {
      swal(
        'All done!',
        'Thanks for subscribing! You will recieve a message whenever new grades are posted.',
        'success',
      );
    })
    .catch(({ response }) => {
      const { status } = response;
      let message = 'Something went wrong :(';
      if (status === 401) {
        message = "Your request couldn't go through, your GUC credentials are invalid.";
      }
      swal('Oops!', message, 'error');
    })
    .finally(toggleSpinner);
});
