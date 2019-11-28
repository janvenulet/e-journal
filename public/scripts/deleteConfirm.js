function deleteConfirm() {
  if (window.confirm("Do you really want to delete your account?")) { 
    window.location.href = "/delete";
  }
}