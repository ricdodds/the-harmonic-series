window.AudioContext = window.AudioContext || window.webkitAudioContext;

if ( WEBGL.isWebGLAvailable() === false ) {

	document.body.appendChild( WEBGL.getWebGLErrorMessage() );

}

var renderer, scene, camera, holoplay;
var line, lineMaterial;
var micAnalyser, xAnalyser, yAnalyser;
var controls, gui;

var useLookingGlass = true;

const fftSize = 2048 ;
const minFrequency = 80;
const maxFrequency = 1100;
const oscillatorGain = 6;
var micGain = 1000;

init();

function init() {

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setClearColor( 0x000000, 0.0 );
	renderer.setSize( window.innerWidth, window.innerHeight );
	
	document.body.appendChild( renderer.domElement );

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.set( 0, 0, 25 );

	holoplay = new HoloPlay( scene, camera, renderer, new THREE.Vector3(0,0,0), true, true );
	document.getElementById( 'fullscreen' ).remove();

	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.minDistance = 10;
	controls.maxDistance = 500;
	controls.autoRotate = true;

	lineMaterial = new THREE.LineMaterial( {

		color: 0xffffff,
		linewidth: 7, // in pixels
		vertexColors: THREE.VertexColors,
		//resolution:  // to be set by renderer, eventually
		dashed: false

	} );

	line = new THREE.Line2( new THREE.HarmonicGeometry( fftSize ), lineMaterial );
	line.computeLineDistances();
	line.scale.set( 1, 1, 1 );

	scene.add( line );

	var audioContext = new AudioContext();

	var xOscillator = audioContext.createOscillator();
	xOscillator.type = 'sine';
	xOscillator.frequency.setValueAtTime( minFrequency * 10, audioContext.currentTime );
	xOscillator.start( 0 );
	
	xAnalyser = audioContext.createAnalyser();
	xAnalyser.fftSize = fftSize;

	xOscillator.connect( xAnalyser );
	xAnalyser.connect( audioContext.destination );

	var yOscillator = audioContext.createOscillator();
	yOscillator.type = 'sine';
	yOscillator.frequency.setValueAtTime( minFrequency * 4, audioContext.currentTime );
	yOscillator.start( 0 );

	yAnalyser = audioContext.createAnalyser();
	yAnalyser.fftSize = fftSize;

	yOscillator.connect( yAnalyser );
	yAnalyser.connect( audioContext.destination );

	var socket = io.connect(window.location.hostname + ':' + 3000);
	socket.on('connect', function(data) {

	    socket.emit('join', 'Client is connected.');

	});
	
	socket.on('xPotentiometer', function( value ) {

		xOscillator.frequency.value = voltageToHz( value );
		
	});

	socket.on('yPotentiometer', function( value ) {

		yOscillator.frequency.value = voltageToHz( value );

	});

	window.addEventListener( 'resize', onWindowResize, false );
	onWindowResize();

	var constraints = {
	  audio: {
	    echoCancellation: false,
	    noiseSuppression: false,
	    autoGainControl: false,
	  }
	};

	navigator.mediaDevices.getUserMedia(constraints)
	.then( function( stream ) {

		var mic = audioContext.createMediaStreamSource( stream );

		micAnalyzer = audioContext.createAnalyser();
	    micAnalyzer.fftSize = fftSize;
	    mic.connect( micAnalyzer );
	    
	    animate();

	})
	.catch( function(err) {

		alert('getUserMedia threw exception :' + err);

	})

}

var xAudioBuffer = new Float32Array( fftSize/2 );
var yAudioBuffer = new Float32Array( fftSize/2 );
var micAudioBuffer = new Float32Array( fftSize/2 );

function animate() {

	requestAnimationFrame( animate );

	xAnalyser.getFloatTimeDomainData( xAudioBuffer );
	yAnalyser.getFloatTimeDomainData( yAudioBuffer );
	micAnalyzer.getFloatTimeDomainData( micAudioBuffer );

	line.geometry.updatePositions(

		xAudioBuffer.map( x => isNaN( x ) ? 0 : x * oscillatorGain ),
		yAudioBuffer.map( x => isNaN( x ) ? 0 : x * oscillatorGain ),
		micAudioBuffer.map( x => isNaN( x ) ? 0 : x * micGain )

	)	

	controls.update();
	renderer.setClearColor( 0x000000, 0 );
	renderer.setViewport( 0, 0, window.innerWidth, window.innerHeight );
	lineMaterial.resolution.set( window.innerWidth, window.innerHeight );

	if ( useLookingGlass ) {

		holoplay.render();

	} else {

		renderer.render( scene, camera );
		
	}

	renderer.setScissorTest( false );

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function voltageToHz(voltage) {

	if (voltage < 60)
		return 0;

	return Math.round(minFrequency + voltage / 1023 * maxFrequency);

}

function initGui() {

	gui = new dat.GUI({ autoPlace: false, closeOnTop: false });
	var customContainer = document.getElementById('gui');
	customContainer.appendChild(gui.domElement);
	gui.close();

	var param = {
		'width (px)': 5,
		'holographic': false,
		'mic gain': 5,	
	};

	gui.add( param, 'width (px)', 1, 10 ).onChange( function ( val ) {

		lineMaterial.linewidth = val;

	} );

	gui.add( param, 'holographic' ).onChange( function ( val ) {

		useLookingGlass = val;

	} );

	gui.add( param, 'mic gain', 1, 50 ).onChange( function ( val ) {

		micGain = val;

	} );

}
