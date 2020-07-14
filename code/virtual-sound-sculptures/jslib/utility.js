let head = 17.189; //cm --> 54 cm circumference
const alphaTime = 150; //random influence [100/150/200/...]
const R = 6371e3;     // metres
const alpha = 0.16;

const N = 1024;

function random(min, max){
    return Math.random()*(max-min)+min;
  }

function getFrameTime(t, tr){
    //t	= frame time [ms]
    //tr 	= random frame time [%]
    let rng = t * tr/alphaTime; 
    let T = t + random(-rng, rng);
    return T/1000;  //return value in s
}

function getFrameDelay(t, d){
    //t	= frame time [s]
    //d 	= dencity [%]
    let T = t*1000
    let m = 100 - d;
    let del = m / 100;
	  let D = random(del/2*(T*m), del*2*(T*m));
	  return D;
}

let triangular = new Float32Array(N);
for (let n = 0; n < N; 	n++){
    triangular[n] = 1 - Math.abs((n - N/2) / (N/2));
}

let hanning = new Float32Array(N);
for (let n = 0; n < N; n++){
    hanning[n] = 0.5*(1-Math.cos((2*Math.PI*n)/N));
}

let blackman = new Float32Array(N);
let a0 = (1-alpha) / 2;
let a1 = 0.5;
let a2 = alpha / 2;
for (let n = 0; n < N; n++){
    blackman[n] = a0 - a1*Math.cos((2*Math.PI*n)/N) + a2*Math.cos((4*Math.PI*n)/N);
}

