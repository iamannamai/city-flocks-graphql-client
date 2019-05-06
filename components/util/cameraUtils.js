/**
 * Converts image to a blob, for uploading
 * @param {string} uri - photo uri to convert to blob
 * @returns {Promise} - resolves to a blob of the image being passed in
 */
export const uriToBlob = (uri) =>
  new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.onerror = reject;
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            resolve(xhr.response);
        }
    };
    xhr.open('GET', uri);
    xhr.responseType = 'blob'; // convert type
    xhr.send();
});
