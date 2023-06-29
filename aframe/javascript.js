var isFunctionResponsive = true;

function removeclass(htmlElement, function_name) {

    htmlElement.classList.remove(function_name);
    isFunctionResponsive = true
}

function fade() {
    if (isFunctionResponsive) {
        console.log("fading");
        object = document.getElementById('fader');
        object.classList.add('fade_animation');
        isFunctionResponsive=false;
        setTimeout(removeclass, 2000, object, "fade_animation");
    }

}


function ergasia_1() {
setTimeout(() => {
    window.location.href = "ergasia_1/index.html";
}, 1000);    
}
function ergasia_2() {
setTimeout(() => {
    window.location.href = "ergasia_2/index.html";
}, 1000);    
}
function carousel() {
    setTimeout(() => {
        window.location.href = "carousel.html";
    }, 1000);    
    }
function anafora() {

        alert("Δυστυχώς η αναφορά βρίσκεται στην διαδικασία συγγραφής ακόμα");
  
}
