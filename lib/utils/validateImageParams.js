export default function validateImageParams (params, imageParams) {
  for (let i = 0; i < imageParams.length; i++) {
    if (!(params[imageParams[i]] instanceof File)) {
      delete params[imageParams[i]]
    }
  }
}
