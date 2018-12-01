const form = document.querySelector('#form');
const API_URI = 'http://localhost:3000';

form.addEventListener('submit', (e) => {
  const formData = new FormData(e.target);
  const payload = {
    username: formData.get('username'),
    password: formData.get('password'),
    email: formData.get('email'),
  };

  axios
    .post(API_URI, payload)
    .then(console.log)
    .catch(console.log);
  e.preventDefault();
});
