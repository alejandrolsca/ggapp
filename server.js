// Include the cluster module
var cluster = require('cluster');

// Code to run if we're in the master process
if (cluster.isMaster) {
    
    // Count the machine's CPUs
    var numWorkers = require('os').cpus().length;

    console.log('Master cluster setting up ' + numWorkers + ' workers...');

    // Create a worker for each CPU
    for (var i = 0; i < numWorkers; i++) {
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

    // Code to run if we're in a worker process
} else {
    //LOAD NODE MODULES
    var express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    path = require('path'),
    pg = require('pg'),
    fs = require('fs');
    
    //SETUP APP
    var app = express();
    app.use(cors());
    app.use("/www", express.static(path.join(__dirname, 'www')));
    
    //SETUP BODY PARSER
    app.use(bodyParser.json()); // support json encoded bodies
    app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
    
    //SETUP POSTGRESQL
    var conString = "postgres://Alejandro:a186419.ASB@localhost:5432/ggapp";
    
    //SETUP SQL FILE READER
    var sqlPath = __dirname + '/sql/';
    var file = function (file) {
        return fs.readFileSync(sqlPath + file + '.sql', "utf8");
    }
	 
    //SETUP ROUTES
    
    /* CLIENT */ 
    app.get('/client/:cl_id', function (req, res) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('client/client:cl_id'), [req.params.cl_id], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return console.error('error running query', err);
                }
                res.sendStatus(JSON.stringify(result.rows));
            });
        });
    });

    app.post('/client/', function (req, res) {
        console.log(JSON.stringify(req.headers.authorization))
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('client/client'), function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return console.error('error running query', err);
                }
                res.sendStatus(JSON.stringify(result.rows));
            });
        });
    });
    
    /* PRODUCT */
    app.post('/product/cl_id', function (req, res) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('product/product:cl_id'), [req.body.cl_id, req.body.pr_status], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return console.error('error running query', err);
                }
                res.sendStatus(JSON.stringify(result.rows));
            });
        });
    });
    
    app.post('/product/add', function (req, res) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('product/product:add'), [req.body.pr_jsonb], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return console.error('error running query', err);
                }
                console.log(JSON.stringify(result));
                res.sendStatus(JSON.stringify(result));
            });
        });
    });
    
    app.post('/product/update', function (req, res) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('product/product:upate'), [req.body.pr_jsonb, req.body.pr_id], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return console.error('error running query', err);
                }
                console.log(JSON.stringify(result));
                res.sendStatus(JSON.stringify(result));
            });
        });
    });
    
    app.post('/product/offset/general/client', function (req, res) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('product/product:offset:general:client'), [req.body.cl_id], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return console.error('error running query', err);
                }
                res.sendStatus(JSON.stringify(result.rows));
            });
        })
    });
    
    app.post('/product/offset/general/paper', function (req, res) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('product/product:offset:general:paper'), function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return console.error('error running query', err);
                }
                res.sendStatus(JSON.stringify(result.rows));
            });
        })
    });
    
    app.post('/product/offset/general/ink', function (req, res) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('product/product:offset:general:ink'), function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return console.error('error running query', err);
                }
                res.sendStatus(JSON.stringify(result.rows));
            });
        })
    });
    
    app.post('/product/offset/general/product', function (req, res) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('product/product:offset:general:product'), [req.body.pr_id],function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return console.error('error running query', err);
                }
                res.sendStatus(JSON.stringify(result.rows));
            });
        })
    });
    
    /* WO */
    app.post('/wo/cl_id', function (req, res) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('wo/wo:cl_id'), [req.body.cl_id], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return console.error('error running query', err);
                }
                res.sendStatus(JSON.stringify(result.rows));
            });
        });
    });
    app.post('/wo/wo_id', function (req, res) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('wo/wo:wo_id'), [req.body.cl_id,req.body.wo_id], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return console.error('error running query', err);
                }
                res.sendStatus(JSON.stringify(result.rows));
            });
        });
    });
    
    app.post('/wo/add', function (req, res) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('wo/wo:add'), [req.body.wo_jsonb], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return console.error('error running query', err);
                }
                console.log(JSON.stringify(result));
                res.sendStatus(JSON.stringify(result));
            });
        });
    });
    
    /* ZONE */ 
    app.post('/zone/cl_id', function (req, res) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('zone/zone:cl_id'), [req.body.cl_id], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return console.error('error running query', err);
                }
                res.sendStatus(JSON.stringify(result.rows));
            });
        });
    });
    
    /* MACHINE */ 
    app.post('/machine', function (req, res) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('machine/machine'), [], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return console.error('error running query', err);
                }
                res.sendStatus(JSON.stringify(result.rows));
            });
        });
    });

    var server = app.listen(3000, function () {
        var host = server.address().address;
        var port = server.address().port;
        console.log('Server running on worker %d listening at http://%s:%s', cluster.worker.id, host, port);
    });

    console.log('Worker %d running!', cluster.worker.id);
}