const express = require('express')
const app = express();

/** MongoDB Stuff */
const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

/** Cache Stuff */
const NodeCache = require("node-cache");
const allowedOrigins = new NodeCache();

/** Set a cache of allowed origins we can reference.   Using a cache helps performance. */
async function setCache() {
    await client.connect();
    const database = client.db("cors");
    const tenants = database.collection("tenants");
    const cursor = tenants.find();

    const allTenants = await cursor.toArray();
    const origins = allTenants.map(tenant => ({ key: tenant.origin, val: tenant.apikey }));
    allowedOrigins.mset(origins);
}


/** CORS stuff
 * @see http://expressjs.com/en/resources/middleware/cors.html
 */
const cors = require('cors');

/** Basic CORS - just allow all origins */
 //app.use(cors());

 /** Simple way - Feed our keys as an array when the preflight check comes in.  The CORS middleware will handle the rest. */
 /*let corsDynamic = {
    origin: function (origin, callback) {
        callback(null, allowedOrigins.keys());
    }
  }
 app.use(cors(corsDynamic)); */

/** Complex way - checks our cache for the origin using a customizable function
 *  If the origin exists and has a matching API key - allow CORS.
 *  This logic can be complex or simple, but either way you want it to fast!
 */

const corsAsync = function (req, callback) {
    let corsOptions = { origin: false };
    const origin = req.header('Origin')
    const originExists = allowedOrigins.has(origin);

    if (originExists && req.query.apiKey === allowedOrigins.get(origin)) {
        corsOptions = { origin: true };
    }

    callback(null, corsOptions);
}
app.use(cors(corsAsync));

/** End CORS stuff */

/** Routes */
app.get('/api/hello', function (req, res) {
    res.send({ message: 'Hello World' });
})

// Call the set cache function, then start listening once we have cached our origins.
setCache().then(() => {
    console.log('Origins allowed: ');
    console.dir(allowedOrigins.keys());

    app.listen(3000, function () {
        console.info('CORS app listening on port 3000!');
    });
});

