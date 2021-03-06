/* 
 * to scrape ruohonjuuri fi http://www.ruohonjuuri.fi/myymalat  

   - Open base url.
   - get store links
   - open each link
   - run a dom look up to find the script tags  
   - use regex to find the script tag with google
   - regex for coordination
 */


var i = -1,
    shopInfo = [],
    links = [],
    shopCoords = [],
    linksAndNames = [],
    addressQuery,
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
    verbose: 0,
    logLevel: 'info',
    pageSettings: {
        loadImages:  false,
        loadPlugins: false
        }
    });
casper.options.waitTimeout = 20000;
var baseUrl= 'http://www.ruohonjuuri.fi/myymalat/';
casper.start(baseUrl);

casper.then(function grabLinks(){
    linksAndNames = casper.evaluate(function evaluateGrablinks(){
        
        // To get all the links: 
        var anchors = document.querySelectorAll('#c2798 > p > span > a');
        var links = Array.prototype.map.call(anchors, function(val){
        var link = val.getAttribute('href');
             
         if(link.indexOf('www') > 0 ) { 
             return link;
             } else {
                 return "http://www.ruohonjuuri.fi/"+link;
                 } 
         });
         
          
          // to get the names
          var names = document.querySelectorAll('#c2798 > p > strong');
          names = Array.prototype.map.call(names, function(val){
              return val.textContent;
          });
           
           // to get names and links together
           var linksAndNames = []; 
        for(var x = 0; x < links.length; x++) {
            if(names[x] != null && names[x].search(/hallinto/i) < 0) { 
                linksAndNames.push([links[x], names[x]]);
                }
                 
         }
                  
        return linksAndNames

    });

});

casper.then (function repeatWrapper(){
casper.repeat(linksAndNames.length, function repeatMapReading(){
casper.then(function openCurPage(){
    if(linksAndNames[i][0]) {
    casper.open(linksAndNames[i][0]);
    }
    
});

casper.then(function grabMapData(){
    shopCoords = casper.evaluate(function evaluateGraMapdata(){
        
        var scripts = document.querySelectorAll('script:not([src])');
        var scriptContent = Array.prototype.map.call(scripts, function(val){return val.textContent});
         
        var mapFulContent = scriptContent.filter(function(val){ return val.indexOf('map') > 0});
          
        var re = /LatLng\(\n*\s*([\d]*.[\d]*,\n*\s*[\d]*.[\d]*)/;
        var str = mapFulContent[0];
        var m;
           
         if ((m = re.exec(str)) !== null) {
                 if (m.index === re.lastIndex) {
                             re.lastIndex++;
                    }
        // View your result using the m-variable.
        // eg m[0] etc.
         }
        var coords = m[1].split(',');
        coords = coords.map(function(val){
            
            var scapedVal = val.replace(/\n/,'');
            return scapedVal.trim();
            });
        
         return coords;

        });
    });
casper.then(function putDataTogether(){
    if(shopCoords && linksAndNames[i][1]){
        shopInfo.push([+shopCoords[0], +shopCoords[1], linksAndNames[i][1]]);
    }
    });
    i++;
});
});
casper.then(function saveLogBye(){
    onlyUnique(shopInfo);
    saveToFile(shopInfo, "ruohonjuuri");
    });

casper.run();


