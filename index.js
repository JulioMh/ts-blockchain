const axios = require('axios')

axios.get('http://localhost:8080/status')
    .then(a => console.log(a.data))
    .catch(b => console.log(b.code))