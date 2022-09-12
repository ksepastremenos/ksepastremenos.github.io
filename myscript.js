let animationTime = 300;
const currentUrl = new URL(document.location);
let params = currentUrl.searchParams;
let currentLang=params.get('lang');
let currentPage=params.get('page');
let currentcontent = document.getElementById("content");
const englishContent = document.querySelectorAll("[lang='en']");
const greekContent = document.querySelectorAll("[lang='gr']");


//initialize params if none
if (currentLang == null){
    console.log("lang = null reached");
    currentLang = 'en';
    currentUrl.searchParams.append('lang', 'en');
    history.replaceState(null,'',currentUrl); //update url
}
if (currentPage == null){
    console.log("page = null reached");
    currentPage = 'home';
    currentUrl.searchParams.append('page', 'home');
    history.replaceState(null,'',currentUrl); //update url
    document.title = 'rigascg - home';
    swapContent(currentPage, true);
    
}
// :::::::::::::: IMPORTANT ::::::::::::::
// re-enable this later
else if (currentLang == 'en' && (window.location.protocol=='http:' || window.location.protocol=='https:'))
{
    console.log("english page update reached");
    swapContent(currentPage, true);
}
else if (currentLang == 'gr' && (window.location.protocol=='http:' || window.location.protocol=='https:'))
{
    console.log('greek page update reached');
    currentLang = 'en';    
    swapLanguage();
    
}

addEventListener('popstate', (event) => {
    console.log(event); 
    // document. location. reload();

    currentLang = new URL(document.location).searchParams.get('lang');
    currentPage = new URL(document.location).searchParams.get('page');
    if(currentLang == 'gr')
    {
        currentUrl.searchParams.set("lang","gr");
        

        document.getElementById("english").classList.remove('current', 'emphasis', 'strong');
        document.getElementById("english").classList.add('notCurrent', 'weak');
        document.getElementById("greek").classList.remove('notCurrent', 'weak');
        document.getElementById("greek").classList.add('current', 'emphasis', 'strong');

        englishContent.forEach(element => {
            element.style.display = "none";
   


        });
        greekContent.forEach(element => {
            element.style.display = "inline";

        });
    }
    else {
        currentUrl.searchParams.set("lang","en");
        

        document.getElementById("greek").classList.remove('current', 'emphasis', 'strong');
        document.getElementById("greek").classList.add('notCurrent', 'weak');
        document.getElementById("english").classList.remove('notCurrent', 'weak');
        document.getElementById("english").classList.add('current', 'emphasis', 'strong');

        englishContent.forEach(element => {
            element.style.display = "inline";

        });
        greekContent.forEach(element => {
            element.style.display = "none";

        });       
    }

    swapContent(currentPage, false);
});


// function addclass(id,classname,hideafter){
// let element = document.getElementById(id);
//     element.classList.add(classname);
//     if (hideafter == 'y' ) {
//         setTimeout(function() { hide(element); }, animationTime);
//     }

//     function hide(toHide) {
//         toHide.style.display = "none";
//         console.log("ab");
//     }
// }

function swapLanguage(){ //for swapping languages
    if (currentLang =='en') { //if was english, swap to greek
        currentLang='gr';
        currentUrl.searchParams.set("lang","gr");
        

        document.getElementById("english").classList.remove('current', 'emphasis', 'strong');
        document.getElementById("english").classList.add('notCurrent', 'weak');
        document.getElementById("greek").classList.remove('notCurrent', 'weak');
        document.getElementById("greek").classList.add('current', 'emphasis', 'strong');

        englishContent.forEach(element => {
            element.style.display = "none";
   


        });
        greekContent.forEach(element => {
            element.style.display = "inline";

        });
        
    }

    else{ //if was greek, swap to english
        currentLang='en'
        currentUrl.searchParams.set("lang","en");
        

        document.getElementById("greek").classList.remove('current', 'emphasis', 'strong');
        document.getElementById("greek").classList.add('notCurrent', 'weak');
        document.getElementById("english").classList.remove('notCurrent', 'weak');
        document.getElementById("english").classList.add('current', 'emphasis', 'strong');

        englishContent.forEach(element => {
            element.style.display = "inline";

        });
        greekContent.forEach(element => {
            element.style.display = "none";

        });

    }
    
    swapContent(currentPage, true); //refresh page. swap content takes into account set language
}

function swapContent(newcontent,shouldUpdate){    
    // console.log(newcontent+'.html');
    let currentcontent = document.getElementById("content");
    let offlinetext = '<div lang=&quot;en&quot;>Haha, local text</div><div lang=&quot;gr&quot;>χαχα, τοπικό κείμενο</div>';
    console.log("swap content reached");

        currentcontent.classList.remove('unfaded');
        currentcontent.classList.add('faded');   

        switch(window.location.protocol) {
            case 'http:':
            case 'https:':
                //online file
                fetch(newcontent+'_'+currentLang+'.html')
                .then(response=>response.text())
                .then(responsetext =>{setTimeout(function() { swapcontenthtml(currentcontent,responsetext); }, animationTime);})
              break;
            case 'file:':
              //local file
              setTimeout(function() { swapcontenthtml(currentcontent,offlinetext); }, animationTime);
              break;
            default: 
              //some other protocol
            } 
    currentPage = newcontent;
    currentUrl.searchParams.set("page",currentPage);
    if (shouldUpdate == true || shouldUpdate == null){
        console.log('updated');
        history.pushState(null,'',currentUrl); //update url + history
    }
    else {
console.log('didnt update');
    }
    document.title = 'rigascg - '+newcontent;

    function swapcontenthtml(currentcontent, newcontent) {
        currentcontent.innerHTML = newcontent;
        currentcontent.classList.remove('faded')
        currentcontent.classList.add('unfaded');
    }    

}

//collapsable menus
// let coll = document.getElementsByClassName("collapsible");
// var i;

// for (i = 0; i < coll.length; i++) {
//   coll[i].addEventListener("click", function() {
//     this.classList.toggle("activeCollapsible");
//     var content = this.nextElementSibling;
//     if (content.style.maxHeight){
//       content.style.maxHeight = null;
//     } else {
//       content.style.maxHeight = content.scrollHeight + "px";
//     } 
//     console.log('toggled collapsible')
//   });
// }

function toggleCollapsible(sendingElement) {    
    sendingElement.classList.toggle("activeCollapsible");
    var content = sendingElement.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    } 
}

function clipboard(data, message) {

    navigator.clipboard.writeText(data);
    let alert = document.querySelector('#copied');
    alert.innerHTML='<p class="textbox copied">'+message+'</p>';
    document.querySelector('#copied').style.display="inline";
}

function portfolio(param){
    console.log(param);
    
}