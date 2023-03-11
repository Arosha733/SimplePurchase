function formateDate(datetime, type = 's') {
    function addDateZero(num) {
        return (num < 10 ? "0" + num : num);
    }
    let d = new Date(datetime);
    let formatdatetime;
    if (type == 's') {
        formatdatetime = d.getFullYear() + '-' + addDateZero(d.getMonth() + 1) + '-' + addDateZero(d.getDate()) + ' ' + addDateZero(d.getHours()) + ':' + addDateZero(d.getMinutes()) + ':' + addDateZero(d.getSeconds());
    } else if (type == 'd') {
        formatdatetime = d.getFullYear() + '-' + addDateZero(d.getMonth() + 1) + '-' + addDateZero(d.getDate());
    }
    return formatdatetime;
}
exports.formateDate = formateDate;

function urlf2z(url) {
    return url.replace(/\\/ig, '/');
}

function urlf2zList(req) {
    if (req.files) {
        let files = req.files;
        let urlList = [];
        urlList = files.map(file => {
            return urlf2z(`${req.protocol}://${req.headers.host}/${file.path}`)
        })
        return urlList;
    }

}

function isArrayEmpty(arr) {
    if (arr.length) {
        return false
    } else {
        return true
    }
}

function FormatData(data, obj) {
    let val = data
    if (Array.isArray(val)) {
        val.forEach(info => {
            Object.entries(obj).forEach(item => {
                if (item[1] === '' || item[1] === null || item[1] === undefined) {
                    return;
                }
                let format = item[1].split('|')
                format.forEach(k => {
                    if (k == 'json') {
                        info[item[0]] = JSON.parse(info[item[0]])
                    } else if (k == 'date') {
                        info[item[0]] = formateDate(info[item[0]])
                    } else if (k == 'time') {
                        info[item[0]] = formateDate(info[item[0]], 'd')
                    }
                })
            })
        })
    } else {
        Object.entries(obj).forEach(item => {
            if (item[1] === '' || item[1] === null || item[1] === undefined) {
                return;
            }
            let format = item[1].split('|')
            format.forEach(k => {
                if (k == 'json') {
                    console.log(val, val[item[0]])
                    val[item[0]] = JSON.parse(val[item[0]])
                } else if (k == 'date') {
                    val[item[0]] = formateDate(val[item[0]])
                } else if (k == 'time') {
                    val[item[0]] = formateDate(val[item[0]], 'd')
                }
            })
        })
    }
    return val
}

exports.urlf2z = urlf2z;
exports.urlf2zList = urlf2zList;
exports.isArrayEmpty = isArrayEmpty
exports.FormatData = FormatData
//数据方法
exports.sqlUpdateStr = function (sql, data) {
    Object.entries(data).forEach(item => {
        if (item[1] === '' || item[1] === null || item[1] === undefined) {
            return;
        }
        sql += (sql.toString() ? "," : "");
        sql += `${item[0]}='${item[1]}'`
    })
    return sql;
}

exports.sqlAddStr = function (data) {
    let vals = [];
    let keys = Object.keys(data);
    Object.entries(data).forEach(item => {
        if (keys.includes(item[0])) {
            vals.push(JSON.stringify(item[1]));
        }
    })
    return {
        keys: keys.join(","),
        vals: vals.join(",")
    };
}

exports.sqlAddStr_null = function (data) {
    let vals = [];
    let keys = [];
    Object.entries(data).forEach(item => {
        if (item[1] !== undefined && item[1] !== "") {
            vals.push(JSON.stringify(item[1]));
            keys.push(item[0])
        }
    })
    return {
        keys: keys.join(","),
        vals: vals.join(",")
    };
}

exports.sqlSelectStr = function (condition, like) {
    Object.entries(like).forEach((item) => {
        if (item[1] != undefined && item[1] != "") {
            if (!String(condition).length) {
                condition += " where "
            } else {
                condition += " and "
            }
            condition += `${item[0]} like '%${item[1]}%'`
        }
    })
    return condition;
}

exports.sqlWhereStr = function (sql, data) {
    Object.entries(data).forEach((item) => {
        if (item[1] != undefined && item[1] != "") {
            if (!String(sql).length) {
                sql += " where "
            } else {
                sql += " and "
            }
            if (String(item[1]).indexOf('.') != -1) {
                sql += `${item[0]}=${item[1]}`
            } else {
                sql += `${item[0]}='${item[1]}'`
            }

        }
    })
    return sql;
}