import * as THREE from '../three/three.module.js';

// Our Javascript will go here.

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 0.1, 3000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const pyramidgeometry=new THREE.CylinderGeometry(0, 0.8, 2, 4); 
const pyramidmaterial=new THREE.MeshLambertMaterial( {color: 0xF3FFE2});
const pyramidmesh=new THREE.Mesh(pyramidgeometry, pyramidmaterial); 
scene.add(pyramidmesh); 

var lightOne=new THREE.AmbientLight(0xffffff, 0.5);
scene.add(lightOne);

var lightTwo=new THREE.PointLight(0xffffff, 0.5);
scene.add(lightTwo);

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
  
        pyramidmesh.rotation.y+=0.1; 
}

animate();
