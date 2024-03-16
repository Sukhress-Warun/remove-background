require('dotenv').config();
const apiKey = process.env.REMOVE_BG_API_KEY;
const axios = require('axios');
// const querystring = require('querystring');

// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event, context) => {

  try {

    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' }
    }
    const body = JSON.parse(event.body);

    if (body.url === undefined || body.url === null || body.url.trim() === '') {
      throw new Error('url is required');
    }

    const formData = new FormData();
    formData.append('size', 'auto');
    formData.append('image_url', body.url);
    formData.append('format', 'png');
    formData.append('crop', 'true');

    const response = await axios({
      method: 'post',
      url: 'https://api.remove.bg/v1.0/removebg',
      data: formData,
      responseType: 'arraybuffer',
      headers: {
        'X-Api-Key': apiKey,
      },
      encoding: null
    })

    console.log(response.data);
    const buffer = Buffer.from(response.data, 'binary');


    const res = {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({data : buffer.toString('base64')}),
    }
    console.log(res);

    return res;

  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
