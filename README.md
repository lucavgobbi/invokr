# invokr
## Call functions on the server side as if they were available on client side

### This library is under development

## How to install
`npm install invokr --save

## How to use
### Server side
1. require invokr.js server which can be found on /bin/invokr.js
2. register all functions you want to make available on the client with `invokr.addMethod({ name: 'nameOnTheClientSide ', func: theFunction, type: 'callback' });`
3. attach invokr to you server `invokr.attachToServer(server)`;

For more details check /tests/server.js.

Make sure you installed all the dependencies with NPM on invokr folder

### Client side
1. On your html, 
    * add underscore script: `<script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>`
    * add socket.io script: `<script src="https://cdn.socket.io/socket.io-1.4.5.js"></script>`
2. add invokr.js client script which can be found on /web/invokr.js
3. call `invokr.connect('urlToServer')`;
4. call any methods with `invokr.nameOnTheClientSide(arg1, arg2...);`

For more details check /tests/index.html

Notes: 

1. Only callback functions are supported for now, promises and return (Still thinking if it makes sense) are coming!
2. Parameters and returns can't be function (they need to be serializable)
3. Unit testing coming soon,
4. Question or suggestions? email: me@lucavgobbi.com or twitter: @lucavgobbi
