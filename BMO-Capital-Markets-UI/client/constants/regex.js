export const email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const USACanadaPhone = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
export const name = /^[a-zA-Z0-9\xBF-\xFF.\-_$@*!',\s]{1,150}$/;
export const specialCharacters = /(?=.*[@#$%!~^&*()\|:;\"\]['<>,+=.?}\/_{-])/; // eslint-disable-line
export const salesforceID = /^[a-zA-Z0-9]{18}$/;
export const rdsID = /^[0-9]*$/;
