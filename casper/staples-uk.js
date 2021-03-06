/* 
 * to scrape Staples uk! 
 */


var i = 0,
    shopInfo = [],
    shopsOnPage = [],
    abortedPrefixes = [];


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
    minute = date.getMinutes(),
    day = date.getDate(),
    hours = date.getHours(),
    month = date.getMonth() + 1, 
    year = date.getFullYear(),
    fs = require('fs');

var fname = branchName+'-'+month+'-'+day+'-'+hours+'-'+minute+'.txt';
var savePath = fs.pathJoin(fs.workingDirectory,'output',fname);
    fs.write(savePath, JSON.stringify(finalData), 'w');

var completionTime = new Date().getTime();
var executionTime = (completionTime - startExecutionTime)/60000;
var fname = 'main-report.txt';
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
             '\n ---\n';

var logSavePath = fs.pathJoin(fs.workingDirectory,'output',fname);
    fs.write(logSavePath, report, 'a');

    casper.echo(report);
}

var casper = require('casper').create({
    verbose: false,
    logLevel: 'debug',
    pageSettings: {
        loadImages:  false,
        loadPlugins: false
        }
    });
var baseUrl = 'http://www.staples.co.uk/StoreLocator/Search?searchTerm=b1&lat=52.47866&lngt=-1.8985682999999653&copyAndPrint=false&_=1430453494500&index=';


casper.start(baseUrl);
casper.repeat(109, function requestOnePage(){
    casper.thenOpen(baseUrl+i);
    casper.then(function() {
        var pageContent = JSON.parse(casper.getPageContent());
        /* casper.echo(JSON.stringify(shopsOnPage)); */
        shopsOnPage = pageContent.map(function(val){
            return [
                +val.Lat,
                +val.Long,
                val.Name
            ];
            });
        casper.echo((shopsOnPage));

        shopInfo = shopInfo.concat(shopsOnPage);
        });

    i++;
    });
casper.then(function finalStage(){
    casper.echo("shopInfo has now "+ shopInfo.length);
    onlyUnique(shopInfo);
    onlyUnique(shopInfo);
    saveToFile(shopInfo, "staples");
    });

casper.run();
