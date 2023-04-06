import * as THREE from '../three/three.module.js';

// Our Javascript will go here.

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 0.1, 3000 );

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xCBEFFF); 
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const pyramidgeometry=new THREE.CylinderGeometry(0, 0.8, 2, 4); 
const pyramidmaterial=new THREE.MeshLambertMaterial( {color: 0xF3FFE2});
const pyramidmesh=new THREE.Mesh(pyramidgeometry, pyramidmaterial);
pyramidmesh.position.set(0, 2, -10); 
scene.add(pyramidmesh); 

const boxgeometry=new THREE.BoxGeometry(1, 1, 1); 
const boxmaterial=new THREE.MeshBasicMaterial(); 
const boxmesh=new THREE.Mesh(boxgeometry, boxmaterial); 
boxmesh.position.set(-0.9, 0, -6); 
scene.add(boxmesh);

const spheregeometry=new THREE.SphereGeometry(0.5); 
const spherematerial=new THREE.MeshBasicMaterial({wireframe: true, color: 0x0000000}); 
const spheremesh=new THREE.Mesh(spheregeometry, spherematerial); 
spheremesh.position.set(0.9, 0, -6); 
scene.add(spheremesh); 

const circlegeometry=new THREE.CircleBufferGeometry(0.5); 
const circlematerial=new THREE.MeshBasicMaterial( {color: 0x0000000}); 
const circlemesh=new THREE.Mesh(circlegeometry, circlematerial); 
circlemesh.position.set(2, 0, -6); 
circlemesh.rotation.set(0, 0.5, 0); 
scene.add(circlemesh); 

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
