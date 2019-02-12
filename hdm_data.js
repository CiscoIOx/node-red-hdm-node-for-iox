module.exports = {
	get_hdm_data: function(callback) {
		var oauth = require('./oauth.js');
		var https = require('https');
		var nbi_label = "nbi";
		var nbi_host = process.env[nbi_label+"_IP_ADDRESS"];
		var nbi_port = process.env[nbi_label+"_TCP_9999_PORT"];
		var product_id = process.env.CAF_SYSTEM_PRODUCT_ID;
		var serial_id = process.env.CAF_SYSTEM_SERIAL_ID;
		var device_id = product_id+":"+serial_id;

		oauth.get_oauth(function(oauth_token) {
			console.log('oauth in getdata:');
			console.log(oauth_token);

			var hdm_data_type = ["sh proc cpu sorted", "sh memory statistics"];
			for(var i=0; i<hdm_data_type.length; i++) {
				var payload = hdm_data_type[i];
				var header = {
					"Content-Type": "text/plain",
					"Authorization": "Bearer "+oauth_token,
					'Content-Length': Buffer.byteLength(payload)
				};
				var options = {
					host: nbi_host,
					port: nbi_port,
					path: '/api/v1/mw/hdmrpc/showcmd',
					method: 'POST',
					rejectUnauthorized: false,
					headers: header
				};
				var req = https.request(options, (res) => {
					console.log('Get data statusCode:', res.statusCode);
					var body = '';

					res.on('data', (d) => {
						body += d.toString('utf8');
					});

					res.on('end', () => {
						console.log('No more data in postdata-api response.');
						if(res.statusCode===200) {
							body = JSON.parse(body)['output'].split('\r\n');
							if(body[1].startsWith('CPU')) {
								body = body.slice(1,2);
							}
							else {
								body = body.slice(1,4);
							}
						}
						else {
							body = JSON.parse(body);
						}
						callback(body);
					});
				});

				req.on('error', (e) => {
					console.error(e);
				});

				req.write(payload);
				req.end();
			}
		});		
	}
}