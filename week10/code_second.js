import * as THREE from '../three/three.module.js';

// Our Javascript will go here.

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const boxgeometry = new THREE.BoxGeometry( 1, 1, 1 );
const boxmaterials = [
		new THREE.MeshBasicMaterial( { color: Math.random()*0xffffff } ),
		new THREE.MeshBasicMaterial( { color: Math.random()*0xffffff } ),
		new THREE.MeshBasicMaterial( { color: Math.random()*0xffffff } ),
		new THREE.MeshBasicMaterial( { color: Math.random()*0xffffff } ),
		new THREE.MeshBasicMaterial( { color: Math.random()*0xffffff } ),
		new THREE.MeshBasicMaterial( { color: Math.random()*0xffffff } )
	];

const boxmesh=new THREE.Mesh(boxgeometry, boxmaterials); 
scene.add(boxmesh);

const cylgeometry = new THREE.CylinderGeometry( 5, 5, 20, 32 );
const cylmaterial = new THREE.MeshLambertMaterial( {color: 0xffff00} );
const cylinder = new THREE.Mesh( cylgeometry, cylmaterial );
scene.add( cylinder );
cylinder.position.z=-25;
cylinder.position.x=5;

var lightOne=new THREE.AmbientLight(0xffffff, 0.5);
scene.add(lightOne);

var lightTwo=new THREE.PointLight(0xffffff, 0.5);
scene.add(lightTwo);

lightTwo.position.set(25, 0, -25)

//напівсферичне освітлення 
var lightThree = new THREE.HemisphereLight(0xfffff, 0x080820, 1); 
scene.add(lightThree);

const texture = new THREE.TextureLoader().load( 'Plant.jpg' );

var planegeometry=new THREE.PlaneGeometry(10, 10); 
var planematerial=new THREE.MeshBasicMaterial({color:0xffffff, map:texture}); 
var planemesh=new THREE.Mesh(planegeometry, planematerial); 
planemesh.position.set(70, -20, -100);
planemesh.scale.set(10, 10, 10); 
scene.add(planemesh); 

const beach = new THREE.TextureLoader().load( '360-degree-beach-panorama-1217568.jpg' );
cylmaterial.map = beach;

cube.scale.set(3, 3, 3);
cube.position.x = cube.position.x - 1;

camera.position.z = 7;
camera.position.x = 2;

renderer.setClearColor (0x555555);
renderer.clear();

let angle = 0, radius = 47;

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
	lightTwo.position.x = radius * Math.cos(angle) + 5;
	lightTwo.position.y = radius * Math.sin(angle);
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
/*
	camera.position.x = radius * Math.cos(angle) + 2;
	camera.position.y = radius * Math.sin(angle);
*/
	angle += Math.PI/180;
}

animate();
