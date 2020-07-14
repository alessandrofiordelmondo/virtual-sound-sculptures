function Kalman() {
	this.G  = 1; // filter gain
	this.Rw = 1; // noise power desirable
	this.Rv = 10; // noise power estimated
	
	this.A = 1;
	this.C = 1;
	this.B = 0;
	this.u = 0;
	this.P = NaN;
	this.x = NaN; // estimated signal without noise
	this.y = NaN; //measured
		
	this.onFilteringKalman = function(ech)//signal: signal measured
	{
		this.y = ech;
		
		if (isNaN(this.x)) {
			this.x = 1/this.C * this.y;
			this.P = 1/this.C * this.Rv * 1/this.C;
		} 
		else {
			// Kalman Filter: Prediction and covariance P
			this.x = this.A*this.x + this.B*this.u;
			this.P = this.A * this.P * this.A + this.Rw;
			// Gain
			this.G = this.P*this.C*1/(this.C*this.P*this.C+this.Rv);
			// Correction
			this.x = this.x + this.G*(this.y-this.C*this.x);
			this.P = this.P - this.G*this.C*this.P;
		};
		return this.x;
	};	
	
	this.setRv = function(Rv)//signal: signal measured
	{
		this.Rv = Rv;
	};
}
function Pedometer() {
	this.acc_norm = new Array(); // amplitude of the acceleration 
	
	this.var_acc   = 0.; // variance of the acceleration on the window L
	this.min_acc   = 1./0.;  // minimum of the acceleration on the window L
	this.max_acc   = -1./0.; // maximum of the acceleration on the window L
	this.threshold = -1./0.; // threshold to detect a step
	this.sensibility = 1./30.;  // sensibility to detect a step
	
	this.countStep = 0;           // number of steps
	this.stepArr   = new Array(); // steps in 2 seconds
	
	this.stepSize  = 50; // step size of the pedestrian (cm)
    this.distance = 0;
    
    this.filtre = new Kalman();
    
    this.setCountStep = function(count) {
		this.countStep = count;
	};
	
	this.setStepSize = function(stepSize) {
		this.stepSize = stepSize;
	};
	
	this.setSensibility = function(sensibility) {
		this.sensibility = sensibility;
	};
    // initialization of arrays
    this.createTable = function(lWindow) {
        this.acc_norm = new Array(lWindow); 
        this.stepArr = new Array(lWindow);
    };
    this.update = function() {
		this.acc_norm.shift();
    };
    // compute norm of the acceleration vector	
	this.computeNorm = function(x,y,z) {
		var norm = Math.sqrt(Math.pow(x,2)+Math.pow(y,2)+Math.pow(z,2));
		var norm_filt = this.filtre.onFilteringKalman(norm);

		return norm_filt/9.80665;
    }; 
    // seek variance
	this.varAcc = function(acc) {
		var moy  = 0.;//mean
		var moy2 = 0.;//square mean
		for (var k = 0; k < acc.length-1; k++) {
			moy += acc[k];
			moy2 += Math.pow(acc[k],2);
		};
		this.var_acc = (Math.pow(moy,2) - moy2)/acc.length;
		if (this.var_acc - 0.5 > 0.) {
				this.var_acc -= 0.5; 
		};		
		if (isNaN(this.var_acc) == 0) {
			this.filtre.setRv(this.var_acc);
			this.setSensibility(2.*Math.sqrt(this.var_acc)/Math.pow(9.80665,2));
		}
		else {
			this.setSensibility(1./30.);
		};
	};
	// seek minimum
	this.minAcc = function(acc) {
		var mini = 1./0.;
		for (var k = 0; k < acc.length; k++) {
			if (acc[k] < mini)
			{
				mini = acc[k];
			};
		};
		return mini;
	};
	
	// seek maximum
	this.maxAcc = function(acc) {
		var maxi = -1./0.;
		for (var k = 0; k < acc.length; k++) {
			if (acc[k] > maxi)
			{
				maxi = acc[k];
			};
		};
		return maxi;
	};
	
	// compute the threshold
	this.setThreshold = function(min, max) {
		this.threshold = (min+max)/2;
	};
	
	// detect a step
	this.onStep = function(acc) {	
		this.varAcc(acc);
		this.min_acc = this.minAcc(acc);
		this.max_acc = this.maxAcc(acc);
		
		this.setThreshold(this.min_acc, this.max_acc);
		
		var diff = this.max_acc - this.min_acc;

		var isSensibility   = (Math.abs(diff) >= this.sensibility)// the acceleration has to go over the sensibility
		var isOverThreshold = ((acc[acc.length-1] >= this.threshold) && (acc[acc.length-2] < this.threshold));// if the acceleration goes over the threshold and the previous was below this threshold
		var isValidStep     = (this.stepArr[this.stepArr.length-1] == 0);
		
		if (isSensibility && isOverThreshold && isValidStep) {
			this.countStep++;
			this.stepArr.push(1);
			this.stepArr.shift();
		} else {
			this.stepArr.push(0);
			this.stepArr.shift();
		};
    };
    this.setDistance = function() {
		this.distance = this.countStep * this.stepSize;//cm
	};
}