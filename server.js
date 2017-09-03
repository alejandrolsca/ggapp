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
        jwt = require('express-jwt'),
        bodyParser = require('body-parser'),
        cors = require('cors'),
        path = require('path'),
        pg = require('pg'),
        fs = require('fs'),
        port = (process.env['NODE_ENV'] !== 'production') ? 8080: 3000;

    //SETUP APP
    var app = express();
    app.use(cors());
    app.use("/", express.static(path.join(__dirname, 'dist')));

    //SETUP JWT
    var jwtCheck = jwt({
        secret: new Buffer('QZiEXho9vOLukcj0TaZAep0aisI1CQGARCj_Egk79ZN2xnvvcY5u37wuQqsT1ov_', 'base64'),
        audience: 'ZexVDEPlqGLMnWXnmyKSsoE8JO3ZS76y'
    });

    app.use('/api/', jwtCheck);

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

    //JWT Check
    app.post('/api/jwt', function (req, res, next) {
        var jwt = {
            valid: true
        };
        res.send(")]}',\n".concat(JSON.stringify(jwt)));
    });

    /* CLIENT */
    app.post('/api/client/cl_id', function (req, res, next) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('client/client:cl_id'), [req.body.cl_id], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return res.status(500).send(JSON.stringify(err, null, 4));
                }
                res.send(")]}',\n".concat(JSON.stringify(result.rows)));
            });
        });
    });

    app.post('/api/client/add', function (req, res, next) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('client/client:add'), [req.body.cl_jsonb], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return res.status(500).send(JSON.stringify(err, null, 4));
                }
                res.send(")]}',\n".concat(JSON.stringify(result)));
            });
        });
    });

    app.post('/api/client/update', function (req, res, next) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('client/client:update'), [req.body.cl_jsonb, req.body.cl_id], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return res.status(500).send(JSON.stringify(err, null, 4));
                }
                res.send(")]}',\n".concat(JSON.stringify(result)));
            });
        });
    });

    app.post('/api/client/', jwtCheck, function (req, res, next) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('client/client'), function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return res.status(500).send(JSON.stringify(err, null, 4));
                }
                res.send(")]}',\n".concat(JSON.stringify(result.rows)));
            });
        });
    });

    /*SUPPLIER*/

    app.post('/api/supplier/su_id', function (req, res, next) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('supplier/supplier:su_id'), [req.body.su_id], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return res.status(500).send(JSON.stringify(err, null, 4));
                }
                res.send(")]}',\n".concat(JSON.stringify(result.rows)));
            });
        });
    });

    app.post('/api/supplier/add', function (req, res, next) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('supplier/supplier:add'), [req.body.su_jsonb], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return res.status(500).send(JSON.stringify(err, null, 4));
                }
                res.send(")]}',\n".concat(JSON.stringify(result)));
            });
        });
    });

    app.post('/api/supplier/update', function (req, res, next) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('supplier/supplier:update'), [req.body.su_jsonb, req.body.su_id], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return res.status(500).send(JSON.stringify(err, null, 4));
                }
                res.send(")]}',\n".concat(JSON.stringify(result)));
            });
        });
    });

    app.post('/api/supplier/', jwtCheck, function (req, res, next) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('supplier/supplier'), function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return res.status(500).send(JSON.stringify(err, null, 4));
                }
                res.send(")]}',\n".concat(JSON.stringify(result.rows)));
            });
        });
    });

    /*PAPER*/
    
    app.post('/api/paper/pa_id', function (req, res, next) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('paper/paper:pa_id'), [req.body.pa_id], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return res.status(500).send(JSON.stringify(err, null, 4));
                }
                res.send(")]}',\n".concat(JSON.stringify(result.rows)));
            });
        });
    });

    app.post('/api/paper/add', function (req, res, next) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('paper/paper:add'), [req.body.pa_jsonb], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return res.status(500).send(JSON.stringify(err, null, 4));
                }
                res.send(")]}',\n".concat(JSON.stringify(result)));
            });
        });
    });

    app.post('/api/paper/update', function (req, res, next) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('paper/paper:update'), [req.body.pa_jsonb, req.body.pa_id], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return res.status(500).send(JSON.stringify(err, null, 4));
                }
                res.send(")]}',\n".concat(JSON.stringify(result)));
            });
        });
    });

    app.post('/api/paper/', jwtCheck, function (req, res, next) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('paper/paper'), function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return res.status(500).send(JSON.stringify(err, null, 4));
                }
                res.send(")]}',\n".concat(JSON.stringify(result.rows)));
            });
        });
    });

    /* INK */

    app.post('/api/ink/in_id', function (req, res, next) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('ink/ink:in_id'), [req.body.in_id], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return res.status(500).send(JSON.stringify(err, null, 4));
                }
                res.send(")]}',\n".concat(JSON.stringify(result.rows)));
            });
        });
    });

    app.post('/api/ink/add', function (req, res, next) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('ink/ink:add'), [req.body.in_jsonb], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return res.status(500).send(JSON.stringify(err, null, 4));
                }
                res.send(")]}',\n".concat(JSON.stringify(result)));
            });
        });
    });

    app.post('/api/ink/update', function (req, res, next) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('ink/ink:update'), [req.body.in_jsonb, req.body.in_id], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return res.status(500).send(JSON.stringify(err, null, 4));
                }
                res.send(")]}',\n".concat(JSON.stringify(result)));
            });
        });
    });

    app.post('/api/ink/', jwtCheck, function (req, res, next) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('ink/ink'), function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return res.status(500).send(JSON.stringify(err, null, 4));
                }
                res.send(")]}',\n".concat(JSON.stringify(result.rows)));
            });
        });
    });

    /* PRODUCT */
    app.post('/api/product/cl_id', function (req, res, next) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('product/product:cl_id'), [req.body.cl_id, req.body.pr_status], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return res.status(500).send(JSON.stringify(err, null, 4));
                }
                res.send(")]}',\n".concat(JSON.stringify(result.rows)));
            });
        });
    });

    app.post('/api/product/add', function (req, res, next) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('product/product:add'), [req.body.pr_jsonb], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return res.status(500).send(JSON.stringify(err, null, 4));
                }
                console.log(JSON.stringify(result));
                res.send(")]}',\n".concat(JSON.stringify(result)));
            });
        });
    });

    app.post('/api/product/update', function (req, res, next) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('product/product:update'), [req.body.pr_jsonb, req.body.pr_id], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return res.status(500).send(JSON.stringify(err, null, 4));
                }
                console.log(JSON.stringify(result));
                res.send(")]}',\n".concat(JSON.stringify(result)));
            });
        });
    });

    app.post('/api/product/offset/general/client', function (req, res, next) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('product/product:offset:general:client'), [req.body.cl_id], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return res.status(500).send(JSON.stringify(err, null, 4));
                }
                res.send(")]}',\n".concat(JSON.stringify(result.rows)));
            });
        })
    });

    app.post('/api/product/offset/general/paper', function (req, res, next) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('product/product:offset:general:paper'), function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return res.status(500).send(JSON.stringify(err, null, 4));
                }
                res.send(")]}',\n".concat(JSON.stringify(result.rows)));
            });
        })
    });

    app.post('/api/product/offset/general/ink', function (req, res, next) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('product/product:offset:general:ink'), function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return res.status(500).send(JSON.stringify(err, null, 4));
                }
                res.send(")]}',\n".concat(JSON.stringify(result.rows)));
            });
        })
    });

    app.post('/api/product/offset/general/product', function (req, res, next) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('product/product:offset:general:product'), [req.body.pr_id], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return res.status(500).send(JSON.stringify(err, null, 4));
                }
                res.send(")]}',\n".concat(JSON.stringify(result.rows)));
            });
        })
    });

    app.post('/api/product/flexo/ribbons/paper', function (req, res, next) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('product/product:flexo:ribbons:paper'), function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return res.status(500).send(JSON.stringify(err, null, 4));
                }
                res.send(")]}',\n".concat(JSON.stringify(result.rows)));
            });
        })
    });

    /* WO */
    app.post('/api/wo/cl_id', function (req, res, next) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('wo/wo:cl_id'), [req.body.cl_id], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return res.status(500).send(JSON.stringify(err, null, 4));
                }
                res.send(")]}',\n".concat(JSON.stringify(result.rows)));
            });
        });
    });
    app.post('/api/wo/cl_id/wo_release', function (req, res, next) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('wo/wo:cl_id:wo_release'), [req.body.cl_id, req.body.wo_release], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return res.status(500).send(JSON.stringify(err, null, 4));
                }
                res.send(")]}',\n".concat(JSON.stringify(result.rows)));
            });
        });
    });

    app.post('/api/wo/cl_id/wo_id', function (req, res, next) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('wo/wo:cl_id:wo_id'), [req.body.cl_id, req.body.wo_id], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return res.status(500).send(JSON.stringify(err, null, 4));
                }
                res.send(")]}',\n".concat(JSON.stringify(result.rows)));
            });
        });
    });

    app.post('/api/wo/cl_id/wo_po', function (req, res, next) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('wo/wo:cl_id:wo_po'), [req.body.cl_id, req.body.wo_po], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return res.status(500).send(JSON.stringify(err, null, 4));
                }
                res.send(")]}',\n".concat(JSON.stringify(result.rows)));
            });
        });
    });

    app.post('/api/wo/wo_id', function (req, res, next) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('wo/wo:wo_id'), [req.body.cl_id, req.body.wo_id], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return res.status(500).send(JSON.stringify(err, null, 4));
                }
                res.send(")]}',\n".concat(JSON.stringify(result.rows)));
            });
        });
    });

    app.post('/api/wo/add', function (req, res, next) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('wo/wo:add'), [req.body.wo_jsonb], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return res.status(500).send(JSON.stringify(err, null, 4));
                }
                res.send(")]}',\n".concat(JSON.stringify(result)));
            });
        });
    });

    app.post('/api/wo/update', function (req, res, next) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('wo/wo:update'), [req.body.wo_jsonb, req.body.wo_id], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return res.status(500).send(JSON.stringify(err, null, 4));
                }
                res.send(")]}',\n".concat(JSON.stringify(result)));
            });
        });
    });

    /* ZONE */
    app.post('/api/zone/cl_id', function (req, res, next) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('zone/zone:cl_id'), [req.body.cl_id], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return res.status(500).send(JSON.stringify(err, null, 4));
                }
                res.send(")]}',\n".concat(JSON.stringify(result.rows)));
            });
        });
    });

    app.post('/api/zone/zo_id', function (req, res, next) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('zone/zone:zo_id'), [req.body.zo_id], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return res.status(500).send(JSON.stringify(err, null, 4));
                }
                res.send(")]}',\n".concat(JSON.stringify(result.rows)));
            });
        });
    });

    app.post('/api/zone/add', function (req, res, next) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('zone/zone:add'), [req.body.zo_jsonb], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return res.status(500).send(JSON.stringify(err, null, 4));
                }
                res.send(")]}',\n".concat(JSON.stringify(result)));
            });
        });
    });

    app.post('/api/zone/update', function (req, res, next) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('zone/zone:update'), [req.body.zo_jsonb, req.body.zo_id], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return res.status(500).send(JSON.stringify(err, null, 4));
                }
                res.send(")]}',\n".concat(JSON.stringify(result)));
            });
        });
    });

    app.post('/api/zone', function (req, res, next) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('zone/zone'), [], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return res.status(500).send(JSON.stringify(err, null, 4));
                }
                res.send(")]}',\n".concat(JSON.stringify(result.rows)));
            });
        });
    });

    /* MACHINE */
     app.post('/api/machine/ma_id', function (req, res, next) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('machine/machine:ma_id'), [req.body.ma_id], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return res.status(500).send(JSON.stringify(err, null, 4));
                }
                res.send(")]}',\n".concat(JSON.stringify(result.rows)));
            });
        });
    });

    app.post('/api/machine/add', function (req, res, next) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('machine/machine:add'), [req.body.ma_jsonb], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return res.status(500).send(JSON.stringify(err, null, 4));
                }
                res.send(")]}',\n".concat(JSON.stringify(result)));
            });
        });
    });

    app.post('/api/machine/update', function (req, res, next) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('machine/machine:update'), [req.body.ma_jsonb, req.body.ma_id], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return res.status(500).send(JSON.stringify(err, null, 4));
                }
                res.send(")]}',\n".concat(JSON.stringify(result)));
            });
        });
    });

    app.post('/api/machine', function (req, res, next) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('machine/machine'), [], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return res.status(500).send(JSON.stringify(err, null, 4));
                }
                res.send(")]}',\n".concat(JSON.stringify(result.rows)));
            });
        });
    });

    /* WORKFLOW */
    app.post('/api/workflow', function (req, res, next) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('workflow/workflow'), [req.body.wo_status], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return res.status(500).send(JSON.stringify(err, null, 4));
                }
                res.send(")]}',\n".concat(JSON.stringify(result.rows)));
            });
        });
    });

    app.post('/api/workflow/update', function (req, res, next) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            console.log(req.body.wo_id)
            client.query(file('workflow/workflow:update'), [req.body.wo_status,req.body.wo_id], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    console.log(err)
                    return res.status(500).send(JSON.stringify(err, null, 4));
                }
                res.send(")]}',\n".concat(JSON.stringify(result)));
            });
        });
    });

    /* TRAFFIC LIGHT REPORT */
    app.post('/api/tlr', function (req, res, next) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(file('tlr/tlr'), [req.body.wo_status], function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return res.status(500).send(JSON.stringify(err, null, 4));
                }
                res.send(")]}',\n".concat(JSON.stringify(result.rows)));
            });
        });
    });

    var server = app.listen(port, function () {
        var host = 'localhost';
        var port = server.address().port;
        console.log('Server running on worker %d listening at http://%s:%s', cluster.worker.id, host, port);
    });

    console.log('Worker %d running!', cluster.worker.id);
}