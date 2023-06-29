var audioPlaying = false;
const soundtrack = new Audio('resources/soundtrack.mp3');
const donkey_sound = new Audio('resources/donkey.mp3');


document.querySelector('a-scene').addEventListener('loaded', function() {
    var hiddenElements = document.getElementsByClassName("hidden");
    var hiddenElementsArray = Array.from(hiddenElements);

    hiddenElementsArray.forEach(function(element){
      element.classList.remove("hidden");


    })
  })

  function clickDebug(){
    var audio = new Audio('resources/donkey.mp3');
    audio.play();
  }

  
  const audioOn = document.getElementById('audio_on');
  const audioOff = document.getElementById('audio_off');
  const carouselOn = document.getElementById('carousel_on');
  const carouselOff = document.getElementById('carousel_off');
  const exit_page = document.getElementById('exit_page');
  const donkey_bray = document.getElementById('donkey_bray');
  const camera_1 = document.getElementById('first_camera');
  const camera_2 = document.getElementById('second_camera');

  audioOn.addEventListener('click', function() {
    audioOn.classList.remove('set');
    audioOn.classList.add('not_set');
    audioOff.classList.remove('not_set');
    audioOff.classList.add('set');
        soundtrack.play();
  });

  audioOff.addEventListener('click', function() {
    audioOff.classList.remove('set');
    audioOff.classList.add('not_set');
    audioOn.classList.remove('not_set');
    audioOn.classList.add('set');
    soundtrack.pause();
  });

  carouselOn.addEventListener('click', function(){
    carouselOn.classList.remove('set');
    carouselOn.classList.add('not_set');
    carouselOff.classList.remove('not_set');
    carouselOff.classList.add('set');

    exit_page.classList.remove('set');
    exit_page.classList.add('not_set');
    donkey_bray.classList.remove('not_set');
    donkey_bray.classList.add('set');

    camera_2.setAttribute('camera', 'active', true);

  })

  carouselOff.addEventListener('click', function(){
    carouselOff.classList.remove('set');
    carouselOff.classList.add('not_set');
    carouselOn.classList.remove('not_set');
    carouselOn.classList.add('set');

    donkey_bray.classList.remove('set');
    donkey_bray.classList.add('not_set');
    exit_page.classList.remove('not_set');
    exit_page.classList.add('set');
    donkey_sound.pause();

    camera_1.setAttribute('camera', 'active', true);
  })

  donkey_bray.addEventListener('click', function(){
    donkey_sound.play();
  })



  exit_page.addEventListener('click', function(){
    window.location.href = "index.html";
  })
  



