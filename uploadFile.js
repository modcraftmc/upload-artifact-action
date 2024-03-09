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

async function getFormHeaders (form, authorization) {
  const getLen = promisify(form.getLength).bind(form);
  const len = await getLen();
  return {
    ...form.getHeaders(),
    'Content-Length': len,
	"Authorization": "Bearer " + authorization
  }
}

async function uploadFile(url, forms, fileForms, authorization) {
    console.log(url);
    console.log(forms);
    console.log(fileForms);
    const form = buildForm(forms, fileForms);
    const headers = await getFormHeaders(form, authorization);
    console.log(headers);
    return axios.post(url, form, {headers: headers,maxContentLength: Infinity})
}


module.exports = uploadFile;

