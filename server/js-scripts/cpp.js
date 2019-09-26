const shell = require('shelljs');
const path = require('path');
const fs = require('fs');

function compile(fileName,timeout=60000){

	let folder_path='cpp_code';
	let file_path = folder_path+"/"+fileName+'.cpp'
	const cmd = `docker run -i -v "$PWD"/${folder_path}/:/usr/src/myapp -w /usr/src/myapp gcc:6.3 g++ -std=c++0x -w -pipe -O2 -fomit-frame-pointer -lm -o ${fileName} ${fileName}.cpp`;

	const result = shell.exec(cmd,{timeout});
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

function run(fileName,input,timeout=10000){
	let folder_path='cpp_code';
	let file_path = folder_path+"/"+fileName+'.cpp'
	let input_path = folder_path+"/"+fileName+'_input.txt'
	fs.writeFileSync(path.resolve(__dirname, `../../${input_path}`),input);
	const cmd = `docker run -i -v "$PWD"/${folder_path}/:/usr/src/myapp -w /usr/src/myapp gcc:6.3 timeout --preserve-status 1 ./${fileName} < "$PWD"/${input_path}`;
	const result = shell.exec(cmd,{timeout});
	console.log(result);
	const jsonResp = {};
	if(result.code===136){
		jsonResp.output="Runtime Error";
		jsonResp.exitCode=1;
		return jsonResp;
	}
	else if(result.code===143||result.code===1){
		jsonResp.output="'Time Limit Exceeded'";
		jsonResp.exitCode=1;
		return jsonResp;
	} 
	jsonResp.exitCode=0;
	jsonResp.output=result.stdout;
	return jsonResp;

}

module.exports={compile,run};