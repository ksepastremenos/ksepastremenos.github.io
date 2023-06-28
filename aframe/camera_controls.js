    // Constants
    const MIN_HOR_ROTATION = -35; // Minimum rotation value
    const MAX_HOR_ROTATION = 35; // Maximum rotation value
    const MIN_VER_ROTATION = -10; // Minimum rotation value
    const MAX_VER_ROTATION = 10; // Maximum rotation value

    const ACCELERATION = 0.07; // Acceleration factor
    const INERTIA = 0.95; // Inertia factor
    let horEasingFrom = 0;
    let horMidpoint = 0;

    let verEasingFrom = 0;
    let verMidpoint = 0;
    
    // Variables
    let horRotation = 0; // Current rotation
    let horVelocity = 0; // Angular velocity
    let isLeftButtonDown = false; // Flag for left button press
    let isRightButtonDown = false; // Flag for right button press
 
    let verRotation = 0;
    let verVelocity = 0;
    let isUpButtonDown = false; // Flag for left button press
    let isDownButtonDown = false; // Flag for right button press

    const myDiv = document.getElementById('myDiv');
    const rig_1 = document.getElementById('first_rig');
    const rig_2 = document.getElementById('second_rig');
    // console.log(rig);
    

    

    // Update function called every frame
    function update() {
      ///
      /// horRotation
      ///
      if (isRightButtonDown && horRotation<=MAX_HOR_ROTATION){
        horVelocity += ACCELERATION;
      }   
        else if(!isRightButtonDown && horRotation > MAX_HOR_ROTATION){
            horMidpoint = MAX_HOR_ROTATION - ((MAX_HOR_ROTATION - horEasingFrom)/2);
            if (horRotation > horMidpoint) {
                horVelocity-= ACCELERATION;
            }
      }
        else if (Math.abs(horVelocity)>0.0001) {
          horVelocity = horVelocity*INERTIA;
        }
        else {
          horVelocity = 0;
        }
      horRotation += horVelocity;

      if (isLeftButtonDown && horRotation>=MIN_HOR_ROTATION) {
        horVelocity -= ACCELERATION;
      }
      else if(!isLeftButtonDown && horRotation < MIN_HOR_ROTATION){
        horMidpoint = MIN_HOR_ROTATION - ((MIN_HOR_ROTATION - horEasingFrom)/2);
        if (horRotation < horMidpoint) {
            horVelocity+= ACCELERATION;
        }
      }
      else if (Math.abs(horVelocity)>0.0001) {
        horVelocity = horVelocity * INERTIA;
      }
      else {
        horVelocity = 0;
      }



///
/// verRotation
///
if (isUpButtonDown && verRotation>=MIN_VER_ROTATION) {
  verVelocity -= ACCELERATION;
}
else if(!isUpButtonDown && verRotation<MIN_VER_ROTATION) {
  verMidpoint = MIN_VER_ROTATION - ((MIN_VER_ROTATION - verEasingFrom)/2);
  if (verRotation < verMidpoint) {
      verVelocity+= ACCELERATION;
  }
}
else if (Math.abs(verVelocity)>0.0001) {
  verVelocity = verVelocity*INERTIA;
}
else {
  verVelocity = 0;
}

if (isDownButtonDown && verRotation<=MAX_VER_ROTATION){
  verVelocity += ACCELERATION;
}   
  else if(!isDownButtonDown && verRotation > MAX_VER_ROTATION){
      verMidpoint = MAX_VER_ROTATION - ((MAX_VER_ROTATION - verEasingFrom)/2);
      if (verRotation > verMidpoint) {
          verVelocity-= ACCELERATION;
      }
}
  else if (Math.abs(verVelocity)>0.0001) {
    verVelocity = verVelocity*INERTIA;
  }
  else {
    verVelocity = 0;
  }
verRotation += verVelocity;

///
      rig_1.setAttribute('rotation', {x:verRotation,y:horRotation,z:0});
      rig_2.setAttribute('rotation', {x:verRotation,y:horRotation,z:0});
 
      // console.log("Left: " + isLeftButtonDown + " Right: " + isRightButtonDown + " " + horVelocity + " " + horRotation);

      // Update your object's rotation using the 'rotation' value

      // Call the update function again on the next frame
      requestAnimationFrame(update);
    }

    // Event listeners for button presses and releases
    const leftButton = document.getElementById('rightButton');
    const rightButton = document.getElementById('leftButton');

    leftButton.addEventListener('mouseenter', function () {
      isLeftButtonDown = true;
    });

    leftButton.addEventListener('mouseleave', function () {
      isLeftButtonDown = false;
      horEasingFrom = horRotation;
    });

    rightButton.addEventListener('mouseenter', function () {
      isRightButtonDown = true;
    });

    rightButton.addEventListener('mouseleave', function () {
      isRightButtonDown = false;
      horEasingFrom = horRotation;
    });

    const upButton = document.getElementById('downButton');
    const downButton = document.getElementById('upButton');

    upButton.addEventListener('mouseenter', function () {
      isUpButtonDown = true;
    });

    upButton.addEventListener('mouseleave', function () {
      isUpButtonDown = false;
      verEasingFrom = verRotation;
    });

    downButton.addEventListener('mouseenter', function () {
      isDownButtonDown = true;
    });

    downButton.addEventListener('mouseleave', function () {
      isDownButtonDown = false;
      verEasingFrom = verRotation;
    });

    // Start the animation loop only if any button is held down
    function startAnimation() {
        update();
    }

    // Call the startAnimation function on the next frame
    requestAnimationFrame(startAnimation);