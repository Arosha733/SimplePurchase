const mysql = require('mysql');
let connection = null;


function handleError() {
    //Create a MySQL connection object 创建一个mysql连接对象
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'kmlckj',
        database: 'myshopping'
    });

    //Connection error, try again in 2 seconds 连接错误，2秒重试
    connection.connect(function (err) {
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleError, 2000);
        }
    });
    //Listen for errors 监听错误
    connection.on('error', function (err) {
        console.log('db error', err);
        //If the connection is lost, it is automatically reconnected 如果是连接断开，自动重新连接
        if (err.code === 'ECONNREFUSED') {
            setTimeout(handleError, 2000);
        } else {
            setTimeout(handleError, 2000);
        }
    });
}
handleError();


module.exports = {
    connection
};