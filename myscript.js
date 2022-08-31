let animationTime = 300;

function addclass(id,classname,hideafter){
let element = document.getElementById(id);
    element.classList.add(classname);
    if (hideafter == 'y' ) {
        setTimeout(function() { hide(element); }, animationTime);
    }

    function hide(toHide) {
        toHide.style.display = "none";
        console.log("ab");
    }
}

function swapcontent(newcontent){
    
    console.log(newcontent+'.html');
    let currentcontent = document.getElementById("content");
    currentcontent.classList.add('faded');
    
    
    fetch(newcontent+'.html')
    .then(response=>console.log(response));
    .then(response=>swapcontenthtml(response) );

    function swapcontenthtml(currentcontent, newcontent) {
        currentcontent.innerHTML = newcontent;
        currentcontent.classList.add('unfaded');
    }
    
        
}


// setTimeout(hide(document.getElementById("content")), 3000);
// function hide(toHide) 
// {
//     toHide.style.display = "none";
//     console.log("ab");
// }