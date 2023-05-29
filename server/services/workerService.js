const { Worker, MessageChannel, parentPort} = require('node:worker_threads');

function createWorker(path, callback, message) {
	const worker = new Worker(path);
	const { port1, port2 } = new MessageChannel();
	port1.on('message', (value) => {
		callback(null, value);
		worker.terminate();
	});
	port1.on('error', (error) => {
		callback(error);
		worker.terminate();
	});
	worker.on('exit', (code) => {
		if(code !== 0) {
			console.error(new Error(`Worker stopped with exit code ${code}`))
		}
	});
	worker.postMessage({workerPort: port2}, [port2]);
	port1.postMessage(message);
	return worker;
}


function workerInit(callback) {
	parentPort.once('message', (message) => {
		const { workerPort } = message;
		workerPort.on('message', (value) => {
			callback(workerPort, value);
		})
	})
}


module.exports = {
	createWorker,
	workerInit
}