const mongoose = require('mongoose');
const { HOST, PORT, NAME } = require('../configs/config.mongodb');
const connectionString = `${HOST}://127.0.0.1:27017/${NAME}`; 

console.log('connectionString::', connectionString);

class Database {
    constructor() {
        this.connect();
    }
    connect() {
        mongoose.connect( connectionString, {
            maxPoolSize: 50,
        })
        .then(() => {
            console.log('Connected successfully');
        })
        .catch(error => {
            console.log('Connected failed::', error);
        })
    }

    static getInstance() {
        if (!Database.instancec) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const instanceDb = Database.getInstance();
module.exports = instanceDb;
