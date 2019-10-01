const shell = require('shelljs');
const path = require('path');
const fs = require('fs');

function compile(folderName,fileName,timeout=60000){

	let folder_path='java_code/'+folderName;
	let file_path = folder_path+"/"+fileName+'.java'
	const cmd = `sudo docker run -i -v  "$PWD"/${folder_path}/:/usr/src/myapp -w /usr/src/myapp openjdk:8 javac ${fileName}.java`;

	const result = shell.exec(cmd);
	const jsonResp = {};
	jsonResp.exitCode=result.code;
	if(result.code!=0){
		if(result.stderr===''){
			result.stderr='Time Limit Exceeded';
		}
		jsonResp.output=result.stderr;
		return jsonResp;
	}
	jsonResp.output=result.stdout;
	return jsonResp;

}

function run(folderName,fileName,input,timeout=10000){
	let folder_path='java_code/'+folderName;
	let file_path = folder_path+"/"+fileName+'.java'
	let input_path = folder_path+"/"+fileName+'_input.txt'
	fs.writeFileSync(path.resolve(__dirname, `../../${input_path}`),input);
	const cmd = `sudo docker run -i -v  "$PWD"/${folder_path}/:/usr/src/myapp -w /usr/src/myapp openjdk:8 timeout --preserve-status 1 java -Xmx1024M -Xms128M ${fileName} < "$PWD"/${input_path}`;
	const result = shell.exec(cmd);
	const jsonResp = {};
	console.log(result)
	if(result.code===1){
		jsonResp.output=result.stderr||"Runtime Error";
		jsonResp.exitCode=1;
		return jsonResp;
	}
	else if(result.code===143){
		jsonResp.output="Time Limit Exceeded";
		jsonResp.exitCode=1;
		return jsonResp;
	} 
	jsonResp.exitCode=0;
	jsonResp.output=result.stdout;
	return jsonResp;

}

module.exports={compile,run};