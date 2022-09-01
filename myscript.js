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
    currentLang = 'en';
    
    currentUrl.searchParams.append('lang', 'en');
    history.replaceState(null,'',currentUrl); //update url
}
if (currentPage == null){
    currentPage = 'home';
    currentUrl.searchParams.append('page', 'home');
    history.replaceState(null,'',currentUrl); //update url
    document.title = 'rigascg - home';
}
else if (currentLang == 'en')
{
    swapContent(currentPage);
}
else if (currentLang == 'gr')
{
    currentLang = 'en';
    console.log('case study');
    swapLanguage();
    
}


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
    
    swapContent(currentPage); //refresh page. swap content takes into account set language
}

function swapContent(newcontent){    
    // console.log(newcontent+'.html');
    let currentcontent = document.getElementById("content");
    let offlinetext = '<div lang=&quot;en&quot;>Haha, local text</div><div lang=&quot;gr&quot;>χαχα, τοπικό κείμενο</div>';
    console.log(currentLang);

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
    history.pushState(null,'',currentUrl); //update url + history
    document.title = 'rigascg - '+newcontent;

    function swapcontenthtml(currentcontent, newcontent) {
        currentcontent.innerHTML = newcontent;
        currentcontent.classList.remove('faded')
        currentcontent.classList.add('unfaded');
    }    

}

