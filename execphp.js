/**
* a class that helps execute php file in express cotext
*/
class ExecPHP {
	/**
	*
	*/
	constructor() {
        
		this.phpPath = '/usr/bin/php';
		this.phpFolder = './phpFiles/';
	}	
	/**
	*
    */
    
	parseFile(fileName, callback, arg1, arg2, ) {
		let realFileName = this.phpFolder + fileName;
		
		console.log('parsing file: ' + realFileName);
        let exec = require('child_process').exec;
        let cmd = this.phpPath + ' ' + realFileName + ' ' + arg1 + ' ' + arg2;
		exec(cmd, function(error, stdout, stderr) {
			callback(stdout);
		});
	}
}module.exports = function() {
	return new ExecPHP();
};