export function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  const customerCookieName = 'customer_' + cname;
  document.cookie = customerCookieName + "=" + cvalue + ";" + expires + ";path=/";
}


export function getCookie(cname) {
  let name = 'customer_' + cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
          c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
          return c.substring(name.length, c.length);
      }
  }
  return "";
}


export function deleteCookie(cname) {
  setCookie(cname, "", -1);
}


export function deleteAllCookies() {
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      let eqPos = c.indexOf('=');
      let cname = eqPos > -1 ? c.substring(0, eqPos) : c;
      while (cname.charAt(0) === ' ') {
          cname = cname.substring(1);
      }
      if (cname.startsWith('customer_')) {
          deleteCookie(cname.replace('customer_', ''));
      }
  }
}