// variable to hold db connection - stores the connected database object when the connection is complete
let db;

// establish a connection to IndexedDB database called 'pizza_hunt' and set it to version 1
// acts as an event listener for the database, it's created when we open the connection to the database using indexedDB.open() method
// open() takes 2 params, 1. the name of the indexedDB database you'd like to create, if it doesn't exist or connect, it's gona use the name pizza_hunt
// 2. the version of the database, default starts at 1, this is used to determine whether the database's structure has changed between connections
const request = indexedDB.open('pizza_hunt', 1);

// event listener - this event will emit if the database version changes (nonexistant to version 1, v1 to v2, etc.)
request.onupgradeneeded = function(event) {
    // this onupgradeneeded event will emit the first time we run this code and create the new_pizza object store.
    // The event won't run again unless we delete the database from the browser or we change the version number in the .open() method to a value of 2, indicating that our database needs an update
    // save a reference to the database
    const db = event.target.result;
    
    // create an object store (table) called `new_pizza`, set it to have an auto incrementing primary key of sorts
    db.createObjectStore('new_pizza', { autoIncrement: true });
};

// upon a successful
request.onsuccess = function(event) {
    // when db is successfully created with its object store (from onupgradeneeded event above) or simply established a connection, save reference to db in global variable
    db = event.target.result;

    // check if app is online, if yes run uploadPizza() function to send all local db data to api
    if(navigator.onLine) {
        // we haven't created this yet but we will soon
        uploadPizza();
    }
};

request.onerror = function(event) {
    // log error here
    console.log(event.target.errorCode);
};

// this function will be executed if we attempt to submit a new pizza and there's no internet connection
function saveRecord(record) {
    // open a new transaction with the database with read and write permissions
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // access the object store for 'new_pizza'
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    // add record to your store with add method
    pizzaObjectStore.add(record);
};

// this uploadPizza() function will open a new transaction to the database to read the data. Then we access the object store for new_pizza and execute the .getAll() method to it
function uploadPizza() {
    // open a transaction on your db
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // access your object store
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    // get all records from store and set to a variable
    // the .getAll() method is an asynchronous function that we have to attach an event handler to in order to retrieve the data
    const getAll = pizzaObjectStore.getAll();

    // upon a successful .getAll() execution, run this function
    getAll.onsuccess = function() {
        // if there was data in indexedDb's store, let's send it to the api server
        if(getAll.result.length > 0) {
            fetch('/api/pizzas', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json' 
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if(serverResponse.message) {
                    throw new Error(serverResponse);
                }
                // open one or more transaction 
                const transaction = db.transaction(['new_pizza'], 'readwrite');
                // access the new_pizza object store
                const pizzaObjectStore = transaction.objectStore('new_pizza');
                // clear all items in your store
                pizzaObjectStore.clear();

                alert('All saved pizza has been submitted!');
            })
            .catch(err => {
                console.log(err);
            });
        }
        // getAll.onsuccess event will execute after the .getAll() method completes successfully
        // at that point, the getAll variable we created above, it will have a .result property that's an array of all the data we retrieved from the new_pizza object store.
        // if there's data to send, we send that array of data we just retrieved to the server at the POST /api/pizzas endpoint, Mongoose .create() method we used can handle either single objects or an array of objects, so no need to create another route and controller method to handle this event
    };
};

// listen for app coming back online
// instruct the app to lisen for the browser regaining internet connection using the online event, if online, execute the uploadPizza()
window.addEventListener('online', uploadPizza);