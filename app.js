/*

Create and Manage a user account with password locally with encryption.
Using node.js, crypto-js, node-persist and yargs.

First run: npm install

-- Commands below --

#1. Help command: node app.js --help
#2. How to run app & create w/ help: node app.js create
#3. How to create a account w/ master password command:
   run -->  node app.js create -n yourName -u yourUsername -p 1234 -m master123
#4. How to get account command: node app.js get -n yourName -m master123


*/

console.log('Started Password Manager....');
console.log('---- ----');

var crypto = require('crypto-js');
var storage = require('node-persist');
storage.initSync();

var argv = require('yargs')
    .command('create', 'Create a new account', function(yargs) {
        yargs.options({
            name: {
                demand: true,
                alias: 'n',
                description: 'Account name (eg: Twitter, Facebook)',
                type: 'string'
            },
            username: {
                demand: true,
                alias: 'u',
                description: 'Account username or email',
                type: 'string'
            },
            password: {
                demand: true,
                alias: 'p',
                description: 'Account password',
                type: 'string'
            },
            masterPassword: {
                demand: true,
                alias: 'm',
                description: 'Account Master password',
                type: 'string'
            }
        }).help('help');
    })
    .command('get', 'Get an existing account', function(yargs) {
        yargs.options({
            name: {
                demand: true,
                alias: 'n',
                description: 'Account name (eg: Twitter, Facebook)',
                type: 'string'
            },
            masterPassword: {
                demand: true,
                alias: 'm',
                description: 'Account Master password',
                type: 'string'
            }
        }).help('help');
    })
    .help('help')
    .argv;

var command = argv._[0];


// getAccounts with masterPassword & encrypt
function getAccounts(masterPassword) {
    //use getItemSync to fetch accounts
    var encryptedAccount = storage.getItemSync('accounts');
    var accounts = [];
    // decrypt and also with an if statment if no accts exist
    if(typeof encryptedAccount !== 'undefined') {
        var bytes = crypto.AES.decrypt(encryptedAccount, masterPassword);
        // convert to js array
        accounts = JSON.parse(bytes.toString(crypto.enc.Utf8));
    }

    //return accounts array
    return accounts;
}

// saveAccounts with masterPassword
function saveAccounts(accounts, masterPassword) {
    // encrypt accounts
    var encryptedAccounts = crypto.AES.encrypt(JSON.stringify(accounts), masterPassword);
    // setItemSync
    storage.setItemSync('accounts', encryptedAccounts.toString());
    // return accounts
    return accounts;
}

// Create Account
function createAccount(account, masterPassword) {
    var accounts = getAccounts(masterPassword);

    accounts.push(account);

    saveAccounts(accounts, masterPassword);

    return account;
}

// Get Account
function getAccount(accountName, masterPassword) {
    var accounts = getAccounts(masterPassword);
    var matchedAccount;

    accounts.forEach(function(account) {
        if(account.name === accountName) {
            matchedAccount = account;
        }
    });

    return matchedAccount;
}


// Call create and get function
if(command === 'create') {
    // Error handling
    try {
        // Success
        var createdAccount = createAccount({
            name: argv.name,
            username: argv.username,
            password: argv.password
        }, argv.masterPassword);

        // log and save in node-persist
        console.log('Account Created!');
        console.log(createdAccount);

    }catch(e) {
        // Error Message
        console.log('Unable to create an account.');
    }

}else if (command === 'get') {
    // Error handling
    try {
        // Success
        var fetchAccount = getAccount(argv.name, argv.masterPassword);

        if(typeof fetchAccount === 'undefined') {
            console.log('Account not found!');
        }else {
            console.log('Account found!');
            console.log(fetchAccount);
        }
    } catch (e) {
        // Error Message
        console.log('Unable to get account.');
    }
}
