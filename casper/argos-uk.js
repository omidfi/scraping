/* 
 * to scrape Argos uk! 
 */


var i = 0,
    shopInfo = [],
    shopsOnPage = [],
    links = [],
    linksTotal;

var startExecutionTime = new Date().getTime();


function onlyUnique(items) { 
    for (var ix=0; ix<items.length; ix++) {
    var listI = items[ix];
    loopJ: for (var jx=0; jx<items.length; jx++) {
        var listJ = items[jx];
        if (listI === listJ) continue; //Ignore itself
        for (var kx=listJ.length; kx>=0; kx--) {
            if (listJ[kx] !== listI[kx]) continue loopJ;
        }
        // At this point, their values are equal.
        items.splice(jx, 1);
        }
    }

    return items;
}

function saveToFile(finalData, branchName) {

var date = new Date(),
    minute = ('0'+ date.getMinutes()).slice(-2),
    day = ('0' + date.getDate()).slice(-2),
    hours = ('0' + (date.getHours())).slice(-2),
    month = ('0' + (date.getMonth() + 1)).slice(-2), 
    year = date.getFullYear(),
    fs = require('fs');

var fname = branchName+'-'+year+month+day+'-'+ hours + minute+'.txt';
var savePath = fs.pathJoin(fs.workingDirectory,'output',fname);
    fs.write(savePath, JSON.stringify(finalData), 'w');

var completionTime = new Date().getTime();
var executionTime = (completionTime - startExecutionTime)/60000;
var fLogName = 'main-report.txt';
var report = '\n ----------- ' + 
             'Date: ' +
             + year +'/'+ month +'/'+ day +'  '+ hours +':'+ minute +
             ' ----------- \n ' + 
             'Branch name: ' +
             branchName + 
             '\n Number of shops returned: ' +
             finalData.length +
             '\n Execution Time (minute): '+
             executionTime  +  
             '\n Results are saved in: \n'+
             savePath +
             '\n ---\n';

var logSavePath = fs.pathJoin(fs.workingDirectory,'output',fLogName);
    fs.write(logSavePath, report, 'a');

    casper.echo(JSON.stringify(finalData));
    casper.echo('------------------------== REPORT ==----------------');
    casper.echo(report);
}

var casper = require('casper').create({
    verbose: 1,
    logLevel: 'debug',
    pageSettings: {
        loadImages:  false,
        loadPlugins: false
        }
    });
casper.options.waitTimeout = 20000;
var baseUrl= 'http://www.argos.co.uk/webapp/wcs/stores/servlet/ArgosStoreLocatorMain?storeId=10151&langId=110';

casper.start(baseUrl);
casper.then(function grabLinks(){
    links = casper.evaluate(function(){
        var storeLinks = document.querySelectorAll('.store_list_data > a');
         
         var links = Array.prototype.map.call(storeLinks,
         function(val){
             return "http://www.argos.co.uk"+val.getAttribute('href');
             });

         return links;
         // must be 787 
        });
    links = links.map(function(val){
        if(val !== null){
        return val;
        }
        });
    casper.echo("links.length: "+ links.length);
    });
casper.then(function(){
casper.repeat(links.length, function(){

    casper.then(function openLink(){
        if(links[i]){
        casper.open(links[i]);
        }
    });
    casper.then(function(){
    casper.waitForSelector('.argos-storename', function(){
        shopsOnPage = casper.evaluate(function(){

            var re = /pp=([\d]*\.[\d]*,-?[\d]\.[\d]*)/i; 
            var url = document.querySelectorAll('noscript'); 
             
            var str = url[1].textContent;
             
            var m;
             
            if ((m = re.exec(str)) !== null) {
                if (m.index === re.lastIndex) {
                    re.lastIndex++;
                }
                // View your result using the m-variable.
                // eg m[0] etc.
            }

            m[1] = m[1].split(',');

            var name = document.querySelector('div[itemprop=name]').textContent;
            return [+m[1][0],+m[1][1],name];
            });
        shopInfo.push(shopsOnPage); 
        }, function() {
            request.abort();
            } );
    });
    casper.then(function(){
        
    casper.clear();
        });
    casper.echo( i + ' of ' + links.length);
    i++;
});
});

casper.then(function saveLogBye(){
    onlyUnique(shopInfo);
    onlyUnique(shopInfo);
    saveToFile(shopInfo, "Argos");    
    });
casper.run();
