/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 18:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const axios = __nccwpck_require__(382);
const FormData = __nccwpck_require__(522);
const fs = __nccwpck_require__(147);
const {promisify} = __nccwpck_require__(837);

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



/***/ }),

/***/ 389:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 382:
/***/ ((module) => {

module.exports = eval("require")("axios");


/***/ }),

/***/ 522:
/***/ ((module) => {

module.exports = eval("require")("form-data");


/***/ }),

/***/ 147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 837:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(389);
const uploadFile = __nccwpck_require__(18);

async function main() {
  try {
    // inputs from action
    const url = core.getInput('url');
    const methodInput = core.getInput('method');
    const method = methodInput.toLowerCase();
    const forms = core.getInput('forms');
    const formsMap = jsonToMap(forms);
    const fileForms = core.getInput('fileForms');
	const authorization = core.getInput('authorization');
    const fileFormsMap = jsonToMap(fileForms);

    console.log(forms);
    console.log(fileForms);

    // http request to external API
    const response = await uploadFile(url, formsMap, fileFormsMap, authorization);

    const statusCode = response.status;
    const data = response.data;
    const outputObject = {
      url,
      method,
      statusCode,
      data
    };

    const consoleOutputJSON = JSON.stringify(outputObject, undefined, 2);
    console.log(consoleOutputJSON);

    if (statusCode >= 400) {
      core.setFailed(`HTTP request failed with status code: ${statusCode}`);
    } else {
      const outputJSON = JSON.stringify(outputObject);
      core.setOutput('output', outputJSON);
    }
  } catch (error) {
    console.log(error);
    core.setFailed(error.message);
  }
}


function objToStrMap(obj){
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k,obj[k]);
  }
  return strMap;
}
/**
 *json转换为map
 */
function jsonToMap(jsonStr){
  return objToStrMap(JSON.parse(jsonStr));
}


main();

})();

module.exports = __webpack_exports__;
/******/ })()
;