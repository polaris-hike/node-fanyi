import * as https from 'https';
import * as querystring from 'querystring';
import md5 = require('md5');

export const translate = (word: string) => {
    const appid = '20200510000447940';
    const appSecret = 'P6RLVp8gP6DHnsmdjJEn';
    const salt = Math.random();
    const sign = md5(appid + word + salt + appSecret);
    const query = querystring.stringify({
        q: word,
        from: 'en',
        to: 'zh',
        appid,
        salt,
        sign
    });

    const options = {
        hostname: 'api.fanyi.baidu.com',
        port: 443,
        path: '/api/trans/vip/translate?' + query,
        method: 'GET'
    };

    const req = https.request(options, (res) => {
        const chunks = [];
        res.on('data', (chunk) => {
            chunks.push(chunk);
        });
        res.on('end', () => {
            const string = Buffer.concat(chunks).toString();
            const response = JSON.parse(string);
            if(response.error_code) {
                console.error(response.error_msg)
            }else {
                console.log(response.trans_result[0].dst);
            }
        });
    });

    req.on('error', (e) => {
        console.error(e);
    });
    req.end();
};