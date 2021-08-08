/** SEED THE DB WITH TENANTS (Allowed Origins */

const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const {  v4 } = require("uuid");
 
async function seed() {
    try {
      await client.connect();
      const database = client.db("cors");
      const tenants = database.collection("tenants");
      tenants.deleteMany();

      const docs = [
        { tenant: "Client A", origin: "http://localhost:5000", apikey: v4().toLowerCase().replace(/-/g, "") },
        { tenant: "Client B", origin: "http://localhost:5001", apikey: v4().toLowerCase().replace(/-/g, "") },
        { tenant: "Client C", origin: "http://localhost:5002", apikey: v4().toLowerCase().replace(/-/g, "") },
      ];
      // this option prevents additional documents from being inserted if one fails
      const options = { ordered: true };
      const result = await tenants.insertMany(docs, options);
      console.log(`${result.insertedCount} documents were inserted`);
    } finally {
      await client.close();
    }
  }
  seed().then(() => {
      console.log('done');
      process.exit();
  }).catch(console.dir);