// auth.js
export const isLoggedIn = () => {
    return !!sessionStorage.getItem('token'); // Example check, replace with your logic
  };
  