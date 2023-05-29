const { workerInit } = require('./services/workerService')

workerInit((port, limit) => {
	let count = 0;
	const start = new Date();
	while(true) {
		count ++
		if(count === limit) {
			const end = new Date();
			port.postMessage({start, end, message: "done"});
			break
		}
	}
})


