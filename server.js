// Include the cluster module
const cluster = require('cluster');

// Code to run if we're in the master process
if (cluster.isMaster) {

    // Count the machine's CPUs
    const numWorkers = require('os').cpus().length;

    console.log('Master cluster setting up ' + numWorkers + ' workers...');

    // Create a worker for each CPU
    for (let i = 0; i < numWorkers; i++) {
        cluster.fork();
    }

    // Listen for online workers
    cluster.on('online', function (worker) {
        console.log('Worker ' + worker.process.pid + ' is online');
    });

    // Listen for dying workers
    cluster.on('exit', function (worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
    });

    // Code to run if we're in a worker process no
} else {
    //LOAD NODE MODULES
    const express = require('express'),
        jwt = require('express-jwt'),
        jwksRsa = require('jwks-rsa'),
        jwtAuthz = require('express-jwt-authz'),
        bodyParser = require('body-parser'),
        ConnectHistoryAPIFallback = require('connect-history-api-fallback'),
        cors = require('cors'),
        path = require('path'),
        fs = require('fs'),
        fileUpload = require('express-fileupload'),
        port = (process.env['NODE_ENV'] !== 'production') ? 8080 : 3000;

    const { Pool, types } = require('pg');

    // CREATE REQUIRED FOLDERS
    const uploadsFolder = path.join(__dirname, 'uploads')
    if (!fs.existsSync(uploadsFolder)) fs.mkdirSync(uploadsFolder);

    //SETUP APP
    const app = express();
    app.use(ConnectHistoryAPIFallback());
    app.use(cors());
    app.use("/", express.static(path.join(__dirname, 'dist')));
    app.use("/uploads", express.static(path.join(__dirname, 'uploads')));

    //SETUP JWT
    const jwtCheck = jwt({
        secret: jwksRsa.expressJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: `https://grupografico.auth0.com/.well-known/jwks.json`
        }),
        audience: 'ZexVDEPlqGLMnWXnmyKSsoE8JO3ZS76y',
        issuer: 'https://grupografico.auth0.com/',
        algorithms: ['RS256']
    });

    app.use('/api/', jwtCheck);

    //SETUP BODY PARSER
    app.use(bodyParser.json()); // support json encoded bodies
    app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

    //SETUP POSTGRESQL
    const pool = new Pool({
        connectionString: 'postgres://Alejandro:a186419.ASB@localhost:5432/ggapp'
    })

    function pgToString(value) {
        return value.toString();
    }
    types.setTypeParser(1082, pgToString); // date
    types.setTypeParser(1083, pgToString); // time
    types.setTypeParser(1114, pgToString); // timestamp
    types.setTypeParser(1184, pgToString); // timestamptz
    types.setTypeParser(1266, pgToString); // timetz

    // SET DEFAULT TIMEZONE
    const defaultTimezone = 'America/Chihuahua'

    //SETUP SQL FILE READER
    const sqlPath = __dirname + '/sql/';
    const file = function (file) {
        return fs.readFileSync(sqlPath + file + '.sql', "utf8");
    }

    //SETUP FILE UPLOADER
    app.use(fileUpload({
        limits: { fileSize: 10 * 1024 * 1024 },
        abortOnLimit: true
    }));

    //SETUP ROUTES

    //JWT Check
    app.post('/api/jwt', function (req, res, next) {
        const jwt = {
            valid: true
        };
        res.send(")]}',\n".concat(JSON.stringify(jwt)));
    });

    /* CLIENT */
    app.post('/api/client/cl_id', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('client/client:cl_id')
                const parameters = [req.body.cl_id, req.body.cl_status]
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/client/add', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // execute query
                const query = file('client/client:add')
                const parameters = [req.body.cl_jsonb]
                const result = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(result)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/client/update', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // execute query
                const query = file('client/client:update')
                const parameters = [req.body.cl_jsonb, req.body.cl_id]
                const result = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(result)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/client/', jwtCheck, function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('client/client')
                const parameters = [req.body.cl_status]
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    /* SUPPLIER */

    app.post('/api/supplier/su_id', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('supplier/supplier:su_id')
                const parameters = [req.body.su_id]
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/supplier/add', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // execute query
                const query = file('supplier/supplier:add')
                const parameters = [req.body.su_jsonb]
                const result = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(result)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/supplier/update', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // execute query
                const query = file('supplier/supplier:update')
                const parameters = [req.body.su_jsonb, req.body.su_id]
                const result = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(result)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/supplier/', jwtCheck, function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('supplier/supplier')
                const parameters = []
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/supplier/su_status', jwtCheck, function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('supplier/supplier:su_status')
                const parameters = [req.body.su_status]
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    /*MATERIAL*/

    app.post('/api/material/mt_id', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('material/material:mt_id')
                const parameters = [req.body.mt_id]
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/material/materialtype', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('material/materialtype')
                const parameters = []
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/material/add', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            let result = undefined;
            try {
                await client.query('BEGIN')
                const { rows } = await client.query(file('material/material:add'), [req.body.mt_jsonb])
                const mt_id = rows[0].mt_id;
                const insertCodeQuery = file('material/material:add:code')
                const insertCodeValues = [mt_id]
                result = await client.query(insertCodeQuery, insertCodeValues)
                await client.query('COMMIT')
                res.send(")]}',\n".concat(JSON.stringify(result)));
            } catch (e) {
                await client.query('ROLLBACK')
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/material/update', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // execute query
                const query = file('material/material:update')
                const parameters = [req.body.mt_jsonb, req.body.mt_id]
                const result = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(result)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/material/', jwtCheck, function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('material/material')
                const parameters = []
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    /* INK */

    app.post('/api/ink/in_id', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('ink/ink:in_id')
                const parameters = [req.body.in_id]
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/ink/add', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // execute query
                const query = file('ink/ink:add')
                const parameters = [req.body.in_jsonb]
                const result = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(result)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/ink/update', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // execute query
                const query = file('ink/ink:update')
                const parameters = [req.body.in_jsonb, req.body.in_id]
                const result = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(result)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/ink/', jwtCheck, function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('ink/ink')
                const parameters = []
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    /* PRODUCT */
    app.post('/api/product', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('product/product')
                const parameters = [req.body.cl_id]
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/product/info', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('product/product:info')
                const parameters = [req.body.pr_id, req.body.pr_status]
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/product/info/inks', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('product/product:info:ink')
                const parameters = [req.body.in_id, req.body.in_status]
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/product/info/material', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('product/product:info:material')
                const parameters = [req.body.mt_id, req.body.mt_status]
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/product/cl_id', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('product/product:cl_id')
                const parameters = [req.body.cl_id, req.body.pr_status]
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/product/add', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            let result = undefined;
            try {
                await client.query('BEGIN')
                const { rows } = await client.query(file('product/product:add'), [req.body.pr_jsonb])
                const pr_id = rows[0].pr_id;
                const insertCodeQuery = file('product/product:add:code')
                const insertCodeValues = [pr_id]
                result = await client.query(insertCodeQuery, insertCodeValues)
                await client.query('COMMIT')
                res.send(")]}',\n".concat(JSON.stringify(result)));
            } catch (e) {
                await client.query('ROLLBACK')
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/product/update', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // execute query
                const query = file('product/product:update')
                const parameters = [req.body.pr_jsonb, req.body.pr_id]
                const result = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(result)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/product/client', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('product/product:client')
                const parameters = [req.body.cl_id]
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/product/material', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('product/product:material')
                const parameters = [req.body.mt_type]
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/product/ink', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('product/product:ink')
                const parameters = [req.body.in_type]
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/product/pr_id', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('product/product:pr_id')
                const parameters = [req.body.pr_id]
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    /* WO */
    app.post('/api/wo/cl_id', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('wo/wo:cl_id')
                const parameters = [
                    req.body.cl_id,
                    req.body.zo_zone,
                    req.body.wo_release,
                    req.body.pr_name,
                    req.body.wo_date,
                    req.body.wo_id,
                    req.body.wo_po
                ]
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });
    app.post('/api/wo/history', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('wo/wo:history')
                const parameters = [req.body.wo_id]
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/wo/print', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('wo/wo:print')
                const parameters = [req.body.wo_id]
                const inksQuery = file('product/product:info:ink')
                const { rows } = await client.query(query, parameters)
                const data = rows.map(async (value) => {
                    const { rows: inksfrontRows } = await client.query(inksQuery, [value.inksfront, 'A,I'])
                    const { rows: inksbackRows } = await client.query(inksQuery, [value.inksback, 'A,I'])
                    const [inksfront] = inksfrontRows
                    const [inksback] = inksbackRows
                    value.inksfront = inksfront.inks
                    value.inksback = inksback.inks
                    return value
                })
                Promise.all(data).then((completed) => {
                    res.send(")]}',\n".concat(JSON.stringify(completed)));
                })

            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/wo/wo_id', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('wo/wo:wo_id')
                const parameters = [req.body.cl_id, req.body.wo_id]
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/wo/add', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // execute query
                const query = file('wo/wo:add')
                const parameters = [req.body.wo_jsonb]
                const result = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(result)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/wo/duplicate', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                await client.query('BEGIN')
                const query = file('wo/wo:duplicate')
                const parameters = [req.body.wo_jsonb]
                const result = await client.query(query, parameters)
                const { rows } = result
                const [row] = rows
                const { wo_id } = row
                // duplicate uploaded files
                const uploadsFolder = path.join(__dirname, 'uploads')
                const file1 = `${uploadsFolder}/${req.body.wo_id}_file1.pdf`
                const file2 = `${uploadsFolder}/${req.body.wo_id}_file2.pdf`
                if (fs.existsSync(file1)) {
                    fs.copyFileSync(file1, `${uploadsFolder}/${wo_id}_file1.pdf`);
                }
                if (fs.existsSync(file2)) {
                    fs.copyFileSync(file2, `${uploadsFolder}/${wo_id}_file2.pdf`);
                }
                await client.query('COMMIT')
                res.send(")]}',\n".concat(JSON.stringify(result)));
            } catch (e) {
                await client.query('ROLLBACK')
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/wo/update', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                await client.query('BEGIN')
                const {us_group, cl_id, wo_id, wo_jsonb} = req.body
                const getWoQuery = file('wo/wo:validate')
                const getWoParameters = [cl_id, wo_id]
                const {rows} = await client.query(getWoQuery, getWoParameters)
                const [wo] = rows
                const isOwner = us_group.includes('owner')
                if (wo.wo_jsonb.wo_status !== 0 && !isOwner) {
                    return res.status(601).send('601 - The work order is not active or needs additional privileges to perform this action. Please contact the owner.');
                }
                const updateWoQuery = file('wo/wo:update')
                const updateWoParameters = [wo_jsonb, wo_id]
                const result = await client.query(updateWoQuery, updateWoParameters)
                await client.query('COMMIT')
                res.send(")]}',\n".concat(JSON.stringify(result)));
            } catch (e) {
                console.log(e)
                await client.query('ROLLBACK')
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    /* ZONE */
    app.post('/api/zone/cl_id', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('zone/zone:cl_id')
                const parameters = [req.body.cl_id, req.body.zo_status]
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/zone/zo_id', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('zone/zone:zo_id')
                const parameters = [req.body.zo_id]
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/zone/add', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // execute query
                const query = file('zone/zone:add')
                const parameters = [req.body.zo_jsonb]
                const result = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(result)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/zone/update', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // execute query
                const query = file('zone/zone:update')
                const parameters = [req.body.zo_jsonb, req.body.zo_id]
                const result = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(result)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/zone', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('zone/zone')
                const parameters = []
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    /* MACHINE */
    app.post('/api/machine/ma_id', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('machine/machine:ma_id')
                const parameters = [req.body.ma_id]
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/machine/add', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // execute query
                const query = file('machine/machine:add')
                const parameters = [req.body.ma_jsonb]
                const result = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(result)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/machine/update', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // execute query
                const query = file('machine/machine:update')
                const parameters = [req.body.ma_jsonb, req.body.ma_id]
                const result = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(result)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/machine', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('machine/machine')
                const parameters = []
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/machine/process', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('machine/machine:ma_process')
                const parameters = [req.body.ma_process, req.body.ma_status]
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    /* WORKFLOW */
    app.post('/api/workflow', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('workflow/workflow')
                const parameters = [req.body.wo_status, req.body.interval]
                const inksQuery = file('product/product:info:ink')
                const { rows } = await client.query(query, parameters)
                const data = rows.map(async (value) => {
                    const { rows: inksfrontRows } = await client.query(inksQuery, [value.inksfront, 'A,I'])
                    const { rows: inksbackRows } = await client.query(inksQuery, [value.inksback, 'A,I'])
                    const [inksfront = { inks: '' }] = inksfrontRows
                    const [inksback = { inks: '' }] = inksbackRows
                    const { inkfront = '' } = value
                    const { inkback = '' } = value
                    const { pr_material = '' } = value
                    value.inkfront = inkfront || ''
                    value.inksfront = inksfront.inks || ''
                    value.inkback = inkback || ''
                    value.inksback = inksback.inks || ''
                    value.pr_material = pr_material || ''
                    if (value.pr_components) {
                        const inkfront = value.inkfront.split(',')
                        const inksfrontArray = value.inksfront.split(',')
                        const inkback = value.inkback.split(',')
                        const inksbackArray = value.inksback.split(',')
                        const material = value.pr_material.split('|')
                        value.pr_concept = JSON.parse(value.pr_concept)
                        let inksfrontConcept = []
                        let inksbackConcept = []
                        let counter1 = 0;
                        let counter2 = 0;
                        for (let i = 0; i < value.pr_components; i++) {
                            let inkfrontRaw = parseInt(inkfront[i])
                            let inkbackRaw = parseInt(inkback[i])
                            inkfront[i] = `${value.pr_concept[i].toUpperCase()}: ${inkfront[i]}`
                            inkback[i] = `${value.pr_concept[i].toUpperCase()}: ${inkback[i]}`
                            material[i] = `${value.pr_concept[i].toUpperCase()}: ${material[i]}`

                            let string1 = []
                            for (let j = 0; j < inkfrontRaw; j++) {
                                string1.push(inksfrontArray[counter1])
                                counter1++
                            }
                            inksfrontConcept[i] = string1.join(',')
                            inksfrontConcept[i] = `${value.pr_concept[i].toUpperCase()}: ${inksfrontConcept[i]}`

                            let string2 = []
                            for (let k = 0; k < inkbackRaw; k++) {
                                string2.push(inksbackArray[counter2])
                                counter2++
                            }
                            inksbackConcept[i] = string2.join(',')
                            inksbackConcept[i] = `${value.pr_concept[i].toUpperCase()}: ${inksbackConcept[i]}`
                        }
                        value.inkfront = inkfront.join('<br>')
                        value.inksfront = inksfrontConcept.join('<br>')
                        value.inkback = inkback.join('<br>')
                        value.inksback = inksbackConcept.join('<br>')
                        value.pr_material = material.join('<br>')
                    }
                    return value
                })
                Promise.all(data).then((completed) => {
                    res.send(")]}',\n".concat(JSON.stringify(completed)));
                })
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/workflow/update', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            let result = undefined;
            try {
                await client.query('BEGIN')
                const updateStatusQuery = file('workflow/workflow:update')
                const updateStatusValues = [req.body.wo_status, req.body.wo_updatedby, req.body.wo_id]
                const updateDeliveryDateQuery = file('workflow/workflow:update:wo_deliverydate')
                const updateDeliveryDateValues = [req.body.wo_id]
                result = await client.query(updateStatusQuery, updateStatusValues)
                if (req.body.wo_status === 17) {
                    result = await client.query(updateDeliveryDateQuery, updateDeliveryDateValues)
                }
                await client.query('COMMIT')
                res.send(")]}',\n".concat(JSON.stringify(result)));
            } catch (e) {
                await client.query('ROLLBACK')
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/workflow/updatecancellation', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            let result = undefined;
            try {
                await client.query('BEGIN')
                const updateStatusQuery = file('workflow/workflow:updatecancellation')
                const updateStatusValues = [req.body.wo_status, req.body.wo_updatedby, req.body.wo_cancellationnotes, req.body.wo_id]
                result = await client.query(updateStatusQuery, updateStatusValues)
                await client.query('COMMIT')
                res.send(")]}',\n".concat(JSON.stringify(result)));
            } catch (e) {
                await client.query('ROLLBACK')
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    /* TRAFFIC LIGHT REPORT */
    app.post('/api/tlr', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // execute query
                const query = file('tlr/tlr')
                const parameters = [req.body.cl_id]
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    /* TRAFFIC LIGHT REPORT ALL*/
    app.post('/api/tlrall', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // execute query
                const query = file('tlr/tlr:all')
                const parameters = []
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    /* GEONAMES */
    app.post('/api/geonames/countries', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('global/geonames:countries')
                const parameters = []
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/geonames/childs/geonameid', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('global/geonames:childs:geonameid')
                const parameters = [req.body.geonameId]
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    /* TARIFF CODES */

    app.post('/api/tariffcode', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('tariffcode/tariffcode')
                const parameters = [req.body.tc_status]
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    /* SHIPPING LIST */

    app.post('/api/shippinglist', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('shippinglist/shippinglist:cl_id')
                const parameters = [req.body.cl_id]
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/shippinglist/client/cl_id', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('shippinglist/client:cl_id')
                const parameters = [req.body.cl_id, req.body.cl_status]
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/shippinglist/cl_id/wo_id', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('shippinglist/wo:cl_id:wo_id')
                const parameters = [req.body.cl_id, req.body.wo_id]
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/shippinglist/releaseinvoice', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('shippinglist/shippinglist:release_invoice')
                const parameters = [req.body.cl_id, req.body.wo_id, req.body.zo_id]
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/shippinglist/add', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            let result = undefined;
            try {
                await client.query('BEGIN')
                const result = await client.query(file('shippinglist/wo:update:wo_id'), [req.body.wo_id])
                const { rows } = await client.query(file('shippinglist/shippinglist:add'), [req.body.cl_id, req.body.zo_id, req.body.wo_id, req.body.sl_createdby])
                const [shippinglist] = rows;
                await client.query('COMMIT')
                res.send(")]}',\n".concat(JSON.stringify(shippinglist)));
            } catch (e) {
                await client.query('ROLLBACK')
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/shippinglist/cancel', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            let result = undefined;
            try {
                await client.query('BEGIN')
                const result = await client.query(file('shippinglist/shippinglist:cancel:wo_id'), [req.body.wo_id])
                const { rows } = await client.query(file('shippinglist/shippinglist:cancel:sl_id'), [req.body.sl_id])
                const [shippinglist] = rows;
                await client.query('COMMIT')
                res.send(")]}',\n".concat(JSON.stringify(shippinglist)));
            } catch (e) {
                await client.query('ROLLBACK')
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/shippinglist/sl_id', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('shippinglist/shippinglist:sl_id')
                const parameters = [req.body.sl_id]
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    /* SHIPPING LIST */

    app.post('/api/exportationinvoice', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('exportationinvoice/exportationinvoice:cl_id')
                const parameters = [req.body.cl_id]
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/exportationinvoice/client/cl_id', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('exportationinvoice/client:cl_id')
                const parameters = [req.body.cl_id, req.body.cl_status]
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/exportationinvoice/cl_id/wo_id', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('exportationinvoice/wo:cl_id:wo_id')
                const parameters = [req.body.cl_id, req.body.wo_id]
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/exportationinvoice/add', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            let result = undefined;
            try {
                await client.query('BEGIN')
                const result = await client.query(file('exportationinvoice/wo:update:wo_id'), [req.body.wo_id])
                const { rows } = await client.query(file('exportationinvoice/exportationinvoice:add'), [req.body.cl_id, req.body.zo_id, req.body.wo_id, req.body.ei_createdby])
                const [exportationinvoice] = rows;
                await client.query('COMMIT')
                res.send(")]}',\n".concat(JSON.stringify(exportationinvoice)));
            } catch (e) {
                await client.query('ROLLBACK')
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/exportationinvoice/cancel', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            let result = undefined;
            try {
                await client.query('BEGIN')
                const result = await client.query(file('exportationinvoice/exportationinvoice:cancel:wo_id'), [req.body.wo_id])
                const { rows } = await client.query(file('exportationinvoice/exportationinvoice:cancel:ei_id'), [req.body.ei_id])
                const [exportationinvoice] = rows;
                await client.query('COMMIT')
                res.send(")]}',\n".concat(JSON.stringify(exportationinvoice)));
            } catch (e) {
                await client.query('ROLLBACK')
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/exportationinvoice/ei_id', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('exportationinvoice/exportationinvoice:ei_id')
                const parameters = [req.body.ei_id]
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    /* PRINT RUNS */

    app.post('/api/printruns', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('printruns/printruns')
                const parameters = []
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/printrunsbyuser', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('printrunsbyuser/printrunsbyuser')
                const parameters = [req.body.fromDate, req.body.toDate]
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/printrunsbyuser2', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('printrunsbyuser2/printrunsbyuser2')
                const parameters = [req.body.fromDate, req.body.toDate]
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/materialcount', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('materialcount/materialcount')
                const parameters = [req.body.fromDate, req.body.toDate]
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    /* EARNINGS BY STATUS */

    app.post('/api/earningsbystatus/wo_date', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('earningsbystatus/earningsbystatus:wo_date')
                const parameters = [req.body.wo_currency, req.body.fromDate, req.body.toDate]
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/earningsbystatus/wo_commitmentdate', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('earningsbystatus/earningsbystatus:wo_commitmentdate')
                const parameters = [req.body.wo_currency, req.body.fromDate, req.body.toDate]
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    /* DASHBOARD */

    app.post('/api/dashboard/deliveredwo', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('dashboard/dashboard:deliveredwo')
                const parameters = [req.body.fromDate, req.body.toDate]
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/pkglbls/wo_id', function (req, res, next) {
        (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                // set default time zone
                const timezone = req.body.timezone || defaultTimezone
                await client.query(`set timezone = '${timezone}';`)
                // execute query
                const query = file('pkglbls/wo:wo_id')
                const parameters = [req.body.wo_id]
                const { rows } = await client.query(query, parameters)
                res.send(")]}',\n".concat(JSON.stringify(rows)));
            } catch (e) {
                console.log(e)
                return res.status(500).send(JSON.stringify(e.stack, null, 4));
            } finally {
                client.release()
            }
        })().catch(e => console.error(e.stack))
    });

    app.post('/api/upload', function (req, res) {
        if (!req.files)
            return res.status(400).send('No files were uploaded.');

        // The name of the input field (i.e. "file1") is used to retrieve the uploaded file
        const { file: fileObj } = req.files;

        // Use the mv() method to place the file somewhere on your server
        fileObj.mv(`${__dirname}/uploads/${fileObj.name}`, function (err) {
            if (err) {
                return res.status(500).send(err);
            }
            (async () => {
                // note: we don't try/catch this because if connecting throws an exception
                // we don't need to dispose of the client (it will be undefined)
                const client = await pool.connect()
                try {
                    await client.query('BEGIN')
                    const {alias, originalName, wo_updatedby, cl_id, wo_id, us_group} = req.body
                    const getWoQuery = file('wo/wo:validate')
                    const getWoParameters = [cl_id, wo_id]
                    const {rows} = await client.query(getWoQuery, getWoParameters)
                    const [wo] = rows
                    const isOwner = us_group.includes('owner')
                    if (wo.wo_jsonb.wo_status !== 0 && !isOwner) {
                        return res.status(601).send('601 - The work order is not active or needs additional privileges to perform this action. Please contact the owner.');
                    }
                    //
                    const uploadQuery = file('upload/wo:upload')
                    const uploadParameters = [alias, originalName, wo_updatedby, wo_id]
                    await client.query(uploadQuery, uploadParameters)
                    await client.query('COMMIT')
                    res.send('File uploaded!');
                } catch (e) {
                    console.log(e)
                    await client.query('ROLLBACK')
                    return res.status(500).send(JSON.stringify(e.stack, null, 4));
                } finally {
                    client.release()
                }
            })().catch(e => console.error(e.stack))
        });
    });

    const server = app.listen(port, function () {
        const host = 'localhost';
        const port = server.address().port;
        console.log('Server running on worker %d listening at http://%s:%s', cluster.worker.id, host, port);
    });

    server.keepAliveTimeout = 5000 * 60;

    console.log('Worker %d running!', cluster.worker.id);
}