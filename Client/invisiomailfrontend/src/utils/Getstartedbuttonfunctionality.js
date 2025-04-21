const GetStartedbuttonfunctionality = (isAuthenticated) => {
  if (isAuthenticated) {
    window.location.href = "/dashboard";
    return;
  }

  window.location.href = "/login";
};

export default GetStartedbuttonfunctionality;
