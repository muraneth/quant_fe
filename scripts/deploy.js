const shell = require('shelljs');
const fs = require('fs');

var request = require("request");

const PKG_JSON_PATH = __dirname + '/../' + 'package.json';
const ENV_FILE_PATH = __dirname + '/../' + '.env.production';

let pkgJson = fs.readFileSync(PKG_JSON_PATH).toString();
pkgJson = JSON.parse(pkgJson);

pkgJson.version = pkgJson.version.split('.');

pkgJson.version[2] = (Number(pkgJson.version[2]) + 1) + '';

pkgJson.version = pkgJson.version.join('.');

fs.writeFileSync(PKG_JSON_PATH, JSON.stringify(pkgJson, 4))

let pkgVersion = pkgJson.version;

const envFileContent = `PUBLIC_URL=//unpkg.com/myquant-fe@${pkgVersion}/build`;

fs.writeFileSync(ENV_FILE_PATH, envFileContent)


console.log('=======配置更新完成，开始编译========')
shell.exec('npm run build', {
    cwd: __dirname + '/../',
}
)

console.log('=======编译成功，开始发包========')
shell.exec('npm publish', {
    cwd: __dirname + '/../',
}
)


console.log('=======部署完成，请同步文件到服务器========')

