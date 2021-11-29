async function signupFormHandler(event) {
  event.preventDefault();
  const username = document.querySelector('#usernameSignup').value.trim();
  const password = document.querySelector('#passwordSignup').value.trim();

  if (username && password) {
    const response = await fetch('/api/users', {
      method: 'post',
      body: JSON.stringify({
        username,
        password
      }),
      headers: { 'Content-Type': 'application/json' }
    });
    if (response.ok) {
      console.log('succes');
      alert('User created, you can now sign in.');
      document.location.reload();
    } else {
      alert(response.statusText);
    }
  }
}

async function loginFormHandler(event) {
  event.preventDefault();

  const username = document.querySelector('#usernameLogin').value.trim();
  const password = document.querySelector('#passwordLogin').value.trim();

  if (username && password) {
    const response = await fetch('/api/users/login', {
      method: 'post',
      body: JSON.stringify({
        username,
        password
      }),
      headers: {'Content-Type': 'application/json'}
    });
    if (response.ok) {
      // add to replace()
      document.location.replace();
    } else {
      alert(response.statusText);
    }
  }
}

document.querySelector('.signup-form').addEventListener('submit', signupFormHandler)
document.querySelector('.login-form').addEventListener('submit', loginFormHandler)