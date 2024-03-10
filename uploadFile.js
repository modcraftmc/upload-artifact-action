const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const {promisify} = require('util');

function buildForm(forms, fileForms) {

  const form = new FormData();
    for (const [key, value] of forms) {
        form.append(key, value);
    }
    for (const [key, value] of fileForms) {
        form.append(key, fs.createReadStream(value));
    }
    console.log(form);

    return form
}

async function getFormHeaders (form) {
  const getLen = promisify(form.getLength).bind(form);
  const len = await getLen();
  return {
    ...form.getHeaders(),
    'Content-Length': len,
  }
}

async function uploadFile(url, forms, fileForms, bearerAuthorization) {
    const form = buildForm(forms, fileForms);
    const headers = await getFormHeaders(form);
    if (bearerAuthorization) {
      headers['Authorization'] = `Bearer ${bearerAuthorization}`;
    }

    console.log("Uploading file to " + url + " with headers: " + JSON.stringify(headers) + " and form: " + JSON.stringify(form));
    return axios.post(url, form, {headers: headers, maxContentLength: Infinity, maxBodyLength: Infinity,})
}


module.exports = uploadFile;

