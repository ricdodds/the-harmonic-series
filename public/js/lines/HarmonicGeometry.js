THREE.HarmonicGeometry = function ( fftSize ) {
	THREE.LineGeometry.call( this );

	var l = (fftSize / 2 + 1) * 3;

	this.setPositions( new Array(l).fill(0) );
	this.setColors( new Array(l).fill(1) );

	this.type = 'HarmonicGeometry';
}

THREE.HarmonicGeometry.prototype = Object.assign( Object.create( THREE.LineGeometry.prototype), {
	constructor: THREE.HarmonicGeometry,

	isHarmonicGeomtery: true,

	updatePositions: function ( xs, ys, zs ) {

		var start = this.attributes.instanceStart;
		var end = this.attributes.instanceEnd;

		var l = start.data.count;
		if ( start !== undefined ) {

			for ( var i = 0; i < l - 1; i++ ) {

				start.setXYZ(i, xs[i], ys[i], zs[i]);
				end.setXYZ(i, xs[i+1], ys[i+1], zs[i+1]);
			
			}

			start.setXYZ(l - 1, xs[l - 1], ys[l - 1], zs[l - 1]);
			end.setXYZ(l - 1, xs[l - 1], ys[l - 1], zs[l - 1]);

			start.data.needsUpdate = true;

		}

		if ( this.boundingBox !== null ) {

			this.computeBoundingBox();

		}

		if ( this.boundingSphere !== null ) {

			this.computeBoundingSphere();

		}

		return this;

	}

} );