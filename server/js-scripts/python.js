const shell = require('shelljs');
const path = require('path');
const fs = require('fs');

function run(fileName, input, timeout = 10000) {
    let folder_path = 'python_code';
    let file_path = folder_path + "/" + fileName + '.py'
    let input_path = folder_path + "/" + fileName + '_input.txt'
    fs.writeFileSync(path.resolve(__dirname, `../../${input_path}`), input);
    const cmd = `sudo ndocker run -i -v  "$PWD"/${folder_path}/:/usr/src/myapp -w /usr/src/myapp python:2 timeout --preserve-status 1 python ${fileName}.py < "$PWD"/${input_path}`;
    const result = shell.exec(cmd);
    const jsonResp = {};
    if (result.code === 1) {
        jsonResp.output = result.stderr || "Runtime Error";
        jsonResp.exitCode = 1;
        return jsonResp;
    } else if (result.code === 143 || result.code === 1) {
        jsonResp.output = "'Time Limit Exceeded'";
        jsonResp.exitCode = 1;
        return jsonResp;
    }
    jsonResp.exitCode = 0;
    jsonResp.output = result.stdout;
    return jsonResp;

}

module.exports = { run };