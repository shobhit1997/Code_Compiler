const {PythonShell} = require('python-shell');
const fs = require('fs');
const path = require("path");
const {compile,run} = require('../js-scripts/compile-java')

function compile_java({fileName,folderName,sourceCode,timeout=600000}) {
	return new Promise((resolve,reject)=>{
		let args=[folderName,fileName];
		if(!fs.existsSync(path.resolve(__dirname, '../../java_code/'+folderName))){
			fs.mkdirSync(path.resolve(__dirname, '../../java_code/'+folderName))
			fs.writeFileSync(path.resolve(__dirname, '../../java_code/'+folderName+'/'+fileName+".java"),sourceCode);
		}
		try {
			// const pyshell = new PythonShell('python-scripts/compile_java.py', {
			// 	args
			// });
			
			// pyshell.on('message', message => {
			// 	// received a message sent from the Python script (a simple "print" statement)
			// 	message=JSON.parse(message)
			// 	let data=fs.readFileSync(path.resolve(__dirname, '../../'+message.path),"utf8");
			// 	message.output=data;
			// 	delete message.path;
			// 	resolve(message);
			// });

			let resp =compile(folderName,fileName);
			resolve(resp);
			
		} catch (error) {
				console.trace(error);
				reject(error);
		}
	})
}

function run_java({fileName,folderName,input,timeout=3000}) {
	return new Promise((resolve,reject)=>{
		let args=[folderName,fileName,input];
		try {
			// const pyshell = new PythonShell('python-scripts/run_java.py', {
			// 	args
			// });
			// // const stTime = setTimeout(function(){
			// // 	resolve({exitCode:3,output:'Time Limit Exceeded'});
			// // },timeout);
			let count =0;
			 setInterval(function(){
				count=count+1;
			},1);
			// pyshell.on('message', message => {
			// 	// received a message sent from the Python script (a simple "print" statement)
			// 	console.log(message);
			// 	// message=JSON.parse(message)
			// 	// let data=fs.readFileSync(path.resolve(__dirname, '../../'+message.path),"utf8");
			// 	// message.output=data;
			// 	console.log(count);
			// 	// delete message.path;
			// 	// resolve(message);
			// });
			let resp=run(folderName,fileName,input);
			console.log(count);
			resolve(resp);
		} catch (error) {
				console.trace(error);
				reject(error);
		}
	})
}

function getClassName(code){
	var re = /class\s([A-Za-z0-9]+)\s*{/gm;
    var res = re.exec(code);
    console.log(res);
    if (res) {
        return res[1];
    }
    else {
        throw {
            error: 'Invalid Class Name',
            errorType: 'pre-compile-time'
        };
    }
}
module.exports={
	compile_java,
	run_java,
	getClassName,
};
