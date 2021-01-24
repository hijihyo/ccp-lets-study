var data_url = null;

window.onload = function () {
    photo = document.getElementById('photo');
    photo.setAttribute('src', opener.data_url);
};