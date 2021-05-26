const axios = require('axios');
const { Pool, types } = require('pg');
const fs = require('fs');
const statuses = require('./src/app/workflow/lang.es-MX').fields.wo_statusoptions

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

// SET DEFAULT TIMEZONE
const defaultTimezone = process.env.DEFAULT_TIME_ZONE

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
        // set default time zone
        await client.query(`set timezone = '${defaultTimezone}';`)
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

exports.mstWoAddMessage = async (title, woData) => {

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
        wo_date,
        wo_notes,
        wo_qty,
        wo_status } = woWithDetails

    const { label: status_label } = statuses.find(value => value.value === wo_status)

    const details = [
        {
            "type": "TextBlock",
            "text": `**Cliente ${cl_id}**\n\n${cl_corporatename}`
        }, {
            "type": "TextBlock",
            "text": `**Zona ${zo_id}**\n\n${zo_zone}`
        }, {
            "type": "TextBlock",
            "text": `**Producto ${pr_id}**\n\n${pr_name || ''} ${pr_partno ? ` - ${pr_partno}` : ''}`
        }, {
            "type": "TextBlock",
            "text": `**Cantidad** ${new Intl.NumberFormat('es-MX').format(wo_qty)}`
        }, {
            "type": "TextBlock",
            "text": `**Fecha Compromiso** ${wo_commitmentdate}`
        }, {
            "type": "TextBlock",
            "text": `**Notas** ${wo_notes || ''}`
        }
    ]


    if (wo_splitnotes) details.push({
        "type": "TextBlock",
        "text": `Razón de entrega parcial\n\n${wo_splitnotes}`
    })

    try {
        const response = await axios.post(process.env.TEAMS_WEBHOOK,
            {
                "type": "message",
                "attachments": [
                    {
                        "contentType": "application/vnd.microsoft.teams.card.o365connector",
                        "content": {
                            "@type": "MessageCard",
                            "@context": "http://schema.org/extensions",
                            "summary": `${title}: ${wo_id}`,
                            "title": `${title}: ${wo_id}`,
                            "sections": [{
                                "type": "TextBlock",
                                "text": `Creada por **@${wo_createdby}** ${wo_date.substr(0, 16)} \n\n${(wo_updatedby ? `Últ. actualización **@${wo_updatedby}** ${wo_lastupdated.substr(0, 16)}` : '')}`
                            }, {
                                "type": "TextBlock",
                                "text": `**Status:** ${status_label}`
                            },
                            ...details,
                            {
                                "type": "TextBlock",
                                "text": `[Ver (localmente)](http://192.168.100.2:3000/wo/view/${cl_id}/${wo_id}) | [Ver (ggapp.dyndns.org)](http://ggapp.dyndns.org/wo/view/${cl_id}/${wo_id})`
                            }]
                        }
                    }]
            })
        if (response.status !== 200) {
            console.warn('Oops! Something went wrong!', JSON.stringify(response))
        }

    } catch (error) {
        console.error(error);
    }
}

exports.mstStatusChangeMessage = async (title, woData) => {

    const { rowCount, rows } = woData
    const updatedOrders = rows.map(value => value.wo_id).join(', ')

    const [firstRow] = rows
    const { wo_status } = firstRow.wo_jsonb

    console.log(wo_status)
    console.log(updatedOrders)

    const { label: status_label } = statuses.find(value => value.value === wo_status)

    try {
        const response = await axios.post(process.env.TEAMS_WEBHOOK,
            {
                "type": "message",
                "attachments": [
                    {
                        "contentType": "application/vnd.microsoft.teams.card.o365connector",
                        "content": {
                            "@type": "MessageCard",
                            "@context": "http://schema.org/extensions",
                            "summary": `Cambio de estatus`,
                            "title": `Cambio de status`,
                            "sections": [
                                {
                                    "type": "TextBlock",
                                    "text": `**Numero(s) de orden:** ${updatedOrders}`
                                }, {
                                    "type": "TextBlock",
                                    "text": `**Nuevo Estatus:** ${status_label}`
                                }, {
                                    "type": "TextBlock",
                                    "text": `[Abri workflow (localmente)](http://192.168.100.2:3000/workflow) | [Abri workflow (ggapp.dyndns.org)](http://ggapp.dyndns.org/workflow)`
                                }]
                        }
                    }]
            })
        if (response.status !== 200) {
            console.warn('Oops! Something went wrong!', JSON.stringify(response))
        }

    } catch (error) {
        console.error(error);
    }
}