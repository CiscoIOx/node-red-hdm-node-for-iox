module.exports = function(RED) {
    function hdmNode(config) {
    	var hdm_data = require('./hdm_data.js');
        RED.nodes.createNode(this,config);

        var node = this;
        node.on('input', function(msg) {
            hdm_data.get_hdm_data(function(hdmdata) {
                console.log("=======================hdm Data:");
                console.log(hdmdata);

                if(Array.isArray(hdmdata)) {
                    var res = {};
                    if(hdmdata.length===1) {
                        var timeSplit = hdmdata[0].split('; ');
                        for(var i=0; i<timeSplit.length; i++) {
                            var pair = timeSplit[i].split(': ');
                            res[pair[0]] = pair[1];
                        }
                    }
                    else {
                        var property = hdmdata[0].trim().split(/\s+/);
                        for(var i=1; i<hdmdata.length; i++) {
                            var line = hdmdata[i].trim().split(/\s+/);
                            res[line[0]] = {};
                            if(line.length===7) {
                                for(var j=0; j<property.length; j++) {
                                    res[line[0]][property[j]] = line[j+1];
                                }
                            }
                        }
                    }
                    msg.payload = res;
                }
                else {
                    msg.payload = hdmdata;
                }
                
                node.send(msg);
            });        
        });
    }

    RED.nodes.registerType("Hdm IOx connector",hdmNode);
}