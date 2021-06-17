const axios = require('axios');
const { Pool, types } = require('pg');
const fs = require('fs');
const statuses = require('./src/app/workflow/lang.es-MX').fields.wo_statusoptions;
const { stringify } = require('querystring');

//SETUP POSTGRESQL
const pool = new Pool({
    connectionString: process.env.PG_CONNECTION_STRING,
    // number of milliseconds to wait before timing out when connecting a new client
    // by default this is 0 which means no timeout
    connectionTimeoutMillis: 0,
    // number of milliseconds a client must sit idle in the pool and not be checked out
    // before it is disconnected from the backend and discarded
    // default is 10000 (10 seconds) - set to 0 to disable auto-disconnection of idle clients
    idleTimeoutMillis: 0,
    // maximum number of clients the pool should contain
    // by default this is set to 10.
    max: 10
})

function pgToString(value) {
    return value.toString();
}

types.setTypeParser(1082, pgToString); // date
types.setTypeParser(1083, pgToString); // time
types.setTypeParser(1114, pgToString); // timestamp
types.setTypeParser(1184, pgToString); // timestamptz
types.setTypeParser(1266, pgToString); // timetz

//SETUP SQL FILE READER
const sqlPath = __dirname + '/sql/';
const file = function (file) {
    return fs.readFileSync(sqlPath + file + '.sql', "utf8");
}

const getWoDetails = async (woData) => {
    const { wo_id, wo_jsonb, wo_date, wo_lastupdated } = woData
    // note: we don't try/catch this because if connecting throws an exception
    // we don't need to dispose of the client (it will be undefined)
    const client = await pool.connect()

    try {
        // execute query
        const query = file('wo/wo:details')
        const parameters = [wo_id]
        const { rows } = await client.query(query, parameters)
        const [woDetails] = rows
        return {
            wo_id,
            ...wo_jsonb,
            ...woDetails,
            wo_date,
            wo_lastupdated
        }
    } catch (error) {
        console.error(error);
    } finally {
        client.release()
    }
}

function truncateString(str, num) {
    if (str.length > num) {
        let subStr = str.substring(0, num);
        return subStr + "...";
    } else {
        return str;
    }
}

function groupByKey(array, key) {
    return array
        .reduce((hash, obj) => {
            if (obj[key] === undefined) return hash;
            return Object.assign(hash, { [obj[key]]: (hash[obj[key]] || []).concat(obj) })
        }, {})
}

const webhookUrls = {
    admin: process.env.TEAMS_WEBHOOK_PROBLEMS, // status 18 cancellation
    finishing: process.env.TEAMS_WEBHOOK_FINISHING,
    follow_wo: process.env.TEAMS_WEBHOOK_FOLLOWWO,
    packaging: process.env.TEAMS_WEBHOOK_PACKAGING,
    problems: process.env.TEAMS_WEBHOOK_PROBLEMS,
    production_planner: process.env.TEAMS_WEBHOOK_PLANNING,
    production: process.env.TEAMS_WEBHOOK_PRODUCTION,
    quality_assurance: process.env.TEAMS_WEBHOOK_QUALITYASSURANCE,
    warehouse: process.env.TEAMS_WEBHOOK_WAREHOUSE,
    logistics: process.env.TEAMS_WEBHOOK_LOGISTICS,
    testing: process.env.TEAMS_WEBHOOK_TESTING
}

const problemStatuses = [4, 6, 9, 15, 16]


exports.teamsWOCRUDMsg = async (title, woData) => {

    const woWithDetails = await getWoDetails(woData)

    const {
        wo_id,
        cl_id,
        pr_id,
        zo_id,
        cl_corporatename,
        pr_name,
        pr_partno,
        zo_zone,
        wo_commitmentdate,
        wo_createdby,
        wo_updatedby,
        wo_lastupdated,
        wo_splitnotes,
        wo_cancellationnotes,
        wo_date,
        wo_notes,
        wo_qty,
        wo_status } = woWithDetails

    const { label: status_label, us_group } = statuses.find(value => value.value === wo_status)

    const isProblem = problemStatuses.some(problemStatus => problemStatus === wo_status)

    const details = [
        `**Estatus:** ${status_label}\n\n`,
        `**Cliente ${cl_id}** ${cl_corporatename}\n\n`,
        `**Zona ${zo_id}** ${zo_zone}\n\n`,
        `**Producto ${pr_id}** ${pr_name}\n\n`,
        `${pr_partno ? `**No. parte** ${pr_partno}\n\n` : ''}`,
        `**Cantidad** ${new Intl.NumberFormat('es-MX').format(wo_qty)}\n\n`,
        `**Fecha Compromiso** ${wo_commitmentdate}\n\n`,
        `${wo_notes ? `**Notas** ${wo_notes}\n\n` : ''}`,
        `${wo_splitnotes ? `**Razón de entrega parcial** ${wo_splitnotes}` : ''}`,
        `${wo_cancellationnotes ? `**Notas de cancelación** ${wo_cancellationnotes}` : ''}`
    ].join('')

    const template = {
        "@type": "MessageCard",
        "@context": "http://schema.org/extensions",
        "themeColor": "#009c4d",
        "summary": `${title}: ${wo_id}`,
        "title": `${title}: ${wo_id}`,
        "sections": [{
            "type": "TextBlock",
            "text": `Creada por **@${wo_createdby}** ${wo_date.substr(0, 16)} \n\n${(wo_updatedby ? `Últ. actualización **@${wo_updatedby}** ${wo_lastupdated.substr(0, 16)}` : '')}`
        },
        {
            "type": "TextBlock",
            "text": details
        },
        {
            "type": "TextBlock",
            "text": `[Ver (localmente)](http://192.168.100.2:3000/wo/view/${cl_id}/${wo_id}) | [Ver (ggapp.dyndns.org)](http://ggapp.dyndns.org/wo/view/${cl_id}/${wo_id})`
        }]
    }

    try {

        const responseOne = await axios.post(webhookUrls[us_group], template)
        const responseTwo = await axios.post(webhookUrls['follow_wo'], template)
        if (isProblem) {
            const responseThree = await axios.post(webhookUrls['problems'], template)
        }
    } catch (error) {
        console.error(error);
    }
}

exports.teamsWOStatusChangeMsg = async (woData) => {

    const { rows } = woData
    const updatedOrders = rows.map(value => value.wo_id).join(', ')

    const [firstRow] = rows
    const { wo_status, wo_updatedby, wo_cancellationnotes } = firstRow.wo_jsonb

    const { label: status_label, us_group } = statuses.find(value => value.value === wo_status)

    const isProblem = problemStatuses.some(problemStatus => problemStatus === wo_status)

    const isCancellation = wo_status === 18 ? true : false

    const details = [
        `**Numero(s) de orden:** ${updatedOrders}\n\n`,
        `**Actualizado por:** @${wo_updatedby}\n\n`,
        `${wo_cancellationnotes ? `**Notas de cancelación** ${wo_cancellationnotes}` : ''}`
    ].join('')

    const template = {
        "type": "message",
        "attachments": [
            {
                "contentType": "application/vnd.microsoft.teams.card.o365connector",
                "content": {
                    "@type": "MessageCard",
                    "@context": "http://schema.org/extensions",
                    "summary": `Actualización de estatus: ${status_label}`,
                    "title": `Actualización de estatus: ${status_label}`,
                    "sections": [
                        {
                            "type": "TextBlock",
                            "text": details
                        }, {
                            "type": "TextBlock",
                            "text": `[Abrir workflow (localmente)](http://192.168.100.2:3000/workflow) | [Abrir workflow (ggapp.dyndns.org)](http://ggapp.dyndns.org/workflow)`
                        }
                    ]
                }
            }
        ]
    }
    try {

        const responseOne = await axios.post(webhookUrls[us_group], template)
        if (isProblem) {
            const responseTwo = await axios.post(webhookUrls['problems'], template)
        }
        if (isCancellation) {
            const responseThree = await axios.post(webhookUrls['follow_wo'], template)
        }
    } catch (error) {
        console.error(error);
    }
}

exports.teamsDelayedOrdersMsg = async () => {
    // note: we don't try/catch this because if connecting throws an exception
    // we don't need to dispose of the client (it will be undefined)
    const template = (rows = []) => {
        const rowsByClient = groupByKey(rows, 'cl_corporatename')
        const clients = Object.keys(rowsByClient)
        const details = clients.map((client) => {
            console.log(rowsByClient[client])
            const clientRows = rowsByClient[client]
            const rowsDetails = clientRows.map((row) => {
                return [
                    `${row.wo_id}`,
                    `${row.wo_commitmentdate}`,
                    `${row.delivery_time}`,
                    //`**Estatus:** ${wo_textstatus}\n\n`,
                    `${truncateString(row.zo_zone, 50)}`
                ].join(' | ')
            })
            return [
                `**${truncateString(client, 50)}**\n\n`,
                `${rowsDetails.join('\n\n')}`
            ].join('')

        })
        return {
            "type": "message",
            "attachments": [
                {
                    "contentType": "application/vnd.microsoft.teams.card.o365connector",
                    "content": {
                        "@type": "MessageCard",
                        "@context": "http://schema.org/extensions",
                        "summary": `Ordenes retrasadas: ${rows.length}`,
                        "title": `Ordenes retrasadas: ${rows.length}`,
                        "sections": [
                            {
                                "type": "TextBlock",
                                "text": details.join('\n\n')
                            }, {
                                "type": "TextBlock",
                                "text": `[Abrir reporte semaforo (localmente)](http://192.168.100.2:3000/tlr-all/) | [Abrir reporte semaforo (ggapp.dyndns.org)](http://ggapp.dyndns.org/tlr-all/)`
                            }
                        ]
                    }
                }
            ]
        }
    }
    const client = await pool.connect()
    try {
        // execute query
        const query = file('cronjobs/cron:delayedorders')
        const parameters = []
        const { rows } = await client.query(query, parameters)
        const response = await axios.post(webhookUrls['problems'], template(rows))
    } catch (e) {
        console.log(e)
    } finally {
        client.release()
    }
}