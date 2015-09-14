# Password Manager

## Create and Manage an encrypted user account with password locally.
## Using node.js, crypto-js, node-persist and yargs.

### First run: npm install

### -- Commands below --

####1. Help command: 
   run --> node app.js --help
####2. How to run app & create w/ help: 
   run --> node app.js create
####3. How to create a account w/ master password command:
   run --> node app.js create -n yourName -u yourUsername -p 1234 -m master123
####4. How to get account command: 
   run --> node app.js get -n yourName -m master123
