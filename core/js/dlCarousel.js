var dlCarousel = (function() {
    
    //-------------------------------------------------------------------------
    // private parameters
    //-------------------------------------------------------------------------
    var requestInterval          = 5;
    var carouselNumItems         = 1;
    var carouselMaxItems         = 20;
    var carouselTimeout          = 3000;
    var carouselUrl              = "";
    var dlFgElementsCss          = [];
    var dlBgElementsCss          = [];
    //---
    var id                       = '';
    var postsData               = [];
    var carouselStep             = 0;
    var requestStep              = 9999999;
    var carouselDiv;
    var dlElements;
    var dlFgElements;
    var dlBgElements;
    var firstStep = true;
    
    //-------------------------------------------------------------------------
    // private functions
    //-------------------------------------------------------------------------
    
    var next = function(i){
        return (i + 1) % postsData.length;
    };
    
    var prev = function(i){
        if (i == 0) return postsData.length - 1;
        return (i - 1) % postsData.length;
    };
    
    var mainLoop = function(){
        if (requestStep >= requestInterval){
            requestStep = 0;
            doRequestStep();
        }
        requestStep += 1;
        if (!(postsData.length == 0)){
            doCarouselStep();
            if ((postsData.length > carouselMaxItems) && (carouselStep == 0)) {
                postsData.shift();
            }else{
                carouselStep = next(carouselStep);
            }            
        }
        setTimeout(mainLoop,carouselTimeout);
    };
    
    var doRequestStep = function(){
        if (carouselUrl == ""){return;}
        var request = new Http.Get(carouselUrl, true);
        request.start().then(function(response) {
            for(var i = 0; i < response.length; i++) {
                var newObj = response[i];
                var found = false;
                for (var j = 0 ; j < postsData.length; j++ ){
                    var currentImage = postsData[j].image;
                    if ((currentImage.src == newObj.src) && (currentImage.alt == newObj.text)){
                        found=true;
                    }
                }
                if (!found) {
                    var newImage = new Image();
                    newImage.src = newObj.src;
                    newImage.alt = newObj.text;                
                    var newElement = {
                        image:newImage,
                        url:newObj.url,
                        author:newObj.author,
                        text:newObj.text
                    };
                    
                    postsData.push(newElement);
                }
            }
        });
    };
    
    var refreshElement = function(domElement,stepIndex,cssClasses){
        while (domElement.firstChild) domElement.removeChild(domElement.firstChild);
        var newA = document.createElement("a");
        newA.href = postsData[stepIndex].url;
        
        var newImageDiv = document.createElement("div");
        newImageDiv.style.backgroundImage = "url('" + postsData[stepIndex].image.src + "')";
        newImageDiv.className = cssClasses;
        var emptyText = document.createTextNode(".");
        newImageDiv.appendChild(emptyText);        
        newA.appendChild(newImageDiv);
        
        var newPostDiv = document.createElement("p");
        var newText = document.createTextNode(postsData[stepIndex].text);
        newPostDiv.appendChild(newText);
        newPostDiv.className = "text " + cssClasses;
        var newPostAuthor = document.createElement("p");
        var newText2 = document.createTextNode(postsData[stepIndex].author);
        newPostAuthor.appendChild(newText2);
        newPostAuthor.className = "author " + cssClasses;
        newA.appendChild(newPostDiv);
        newA.appendChild(newPostAuthor);
        domElement.appendChild(newA);
    };
    
    var doCarouselStep = function() {
        var currentCarouselStep = carouselStep;
        for( var i=0; i<carouselNumItems; i++){
            refreshElement(dlFgElements[i],currentCarouselStep,dlFgElementsCss[i]);
            if (!firstStep) {refreshElement(dlBgElements[i],prev(currentCarouselStep),dlBgElementsCss[i])};
            currentCarouselStep = next(currentCarouselStep);
            firstStep = false;
        }
    };
    
    //-------------------------------------------------------------------------
    // public functions
    //-------------------------------------------------------------------------
    var build = function(carouselId) {
        id = carouselId;
        carouselDiv = document.getElementById(id);
        while (carouselDiv.firstChild) carouselDiv.removeChild(carouselDiv.firstChild);
        dlElements = [];
        dlFgElements = [];
        dlBgElements = [];
        dlFgElementsCss = [];
        dlBgElementsCss = [];
        
        for (var i=0;i<carouselNumItems;i++){
            dlElements.push(document.createElement("div"));
            dlFgElements.push(document.createElement("div"));
            dlBgElements.push(document.createElement("div"));
            dlFgElementsCss.push("");
            dlBgElementsCss.push("");
            dlFgElements[i].className = "dl-fg-element pos"+i;
            dlBgElements[i].className = "dl-bg-element pos"+i;
            dlElements[i].className = "dl-element pos"+i;
            dlElements[i].style.width = (100.0/carouselNumItems) + "%";
            dlElements[i].appendChild(dlFgElements[i]);
            dlElements[i].appendChild(dlBgElements[i]);
            carouselDiv.appendChild(dlElements[i]);
        }
    };
    
    var start = function(){
        mainLoop();
    };

    var setRequestInterval = function(_requestInterval){
        requestInterval = _requestInterval;
    };
    
    var setCarouselMaxItems = function(_carouselMaxItems){
        carouselMaxItems = _carouselMaxItems;
    };
    
    var setCarouselTimeout = function(_carouselTimeout){
        carouselTimeout = _carouselTimeout;
    };
    
    var setCarouselNumItems = function(_carouselNumItems){
        carouselNumItems = _carouselNumItems;
    };
    
    var setCarouselUrl = function(_url){
        carouselUrl = _url;
    };
    
    var setCssAnimation = function(cssClasses,fgbg,pos){
       cssClasses = typeof cssClasses !== 'undefined' ? cssClasses : "";
       fgbg = typeof fgbg !== 'undefined' ? fgbg : "both";
       pos = typeof pos !== 'undefined' ? pos : -1;
       
       if (fgbg == "fg" || fgbg == "both"){
            if (pos == -1){
                for (var i = 0 ; i < dlFgElementsCss.length; i++ ){
                    dlFgElementsCss[i] = cssClasses;
                }
            }else {
                if (dlFgElementsCss[pos] !== 'undefined'){
                    dlFgElementsCss[pos] = cssClasses;
                }
            }
       }
       if (fgbg == "bg" || fgbg == "both"){
            if (pos == -1){
                for (var i = 0 ; i < dlBgElementsCss.length; i++ ){
                    dlBgElementsCss[i] = cssClasses;
                }
            }else {
                if (dlBgElementsCss[pos] !== 'undefined'){
                    dlBgElementsCss[pos] = cssClasses;
                }
            }
       }
    }
    
    //-------------------------------------------------------------------------
    // Return the object that is assigned to Module
    //-------------------------------------------------------------------------
    return {
        build                 : build,
        start                 : start,
        setRequestInterval    : setRequestInterval,
        setCarouselMaxItems   : setCarouselMaxItems,
        setCarouselTimeout    : setCarouselTimeout,
        setCarouselNumItems   : setCarouselNumItems,
        setCssAnimation       : setCssAnimation,
        setCarouselUrl        : setCarouselUrl
    };
}());