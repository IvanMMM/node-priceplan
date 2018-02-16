# PricePlan API

This is a simple Promise based module to work with [PricePlan API](http://docs.priceplan.ru/)

## Usage

```javascript
const PP = require('priceplan');
let pp = new PP('https://yourdomain.priceplan.pro/api/','yourUser','yourApiKey');

//Get Users
pp.get(`clients/`)
.then(results=>{
    ...
})

//Create User
let user = {
    name:"Client #16",
    type:2,
    signed_values:{id:"someInternalId"}
}
pp.post(`clients/`,user);
.then(results=>{
    ...
})
```