async function signupFormHandler(event) {
  event.preventDefault();

  const username = document.querySelector().value.trim();
  const password = document.querySelector().value.trim();

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