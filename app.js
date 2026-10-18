import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
const boot=document.getElementById('boot'),site=document.getElementById('site'),button=document.getElementById('enterSite'),status=document.getElementById('bootStatus');
const canvas=document.getElementById('arrivalCanvas');
const scene=new THREE.Scene();scene.background=new THREE.Color('#06110f');scene.fog=new THREE.FogExp2('#071510',.045);
const camera=new THREE.PerspectiveCamera(47,innerWidth/innerHeight,.01,100);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.5;canvas.appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xbaffd9,0x09121a,2.8));const key=new THREE.DirectionalLight(0xe0ffe4,3.2);key.position.set(4,9,7);scene.add(key);const rim=new THREE.PointLight(0x60ff66,55,18);rim.position.set(-2,3,-3);scene.add(rim);
const nexus=new THREE.Group();scene.add(nexus);let cruiser=null;
// Stand at the rim of the top landing platform, looking toward the center of the Nexus.
const baseLook=new THREE.Vector3(0,.2,0);camera.position.set(0,1.85,3.6);camera.lookAt(baseLook);
const loader=new GLTFLoader();
function load(url){return new Promise((resolve,reject)=>loader.load(url,g=>resolve(g.scene),undefined,reject))}
function normalize(obj,target){const box=new THREE.Box3().setFromObject(obj);const size=box.getSize(new THREE.Vector3());const center=box.getCenter(new THREE.Vector3());obj.position.sub(center);obj.scale.multiplyScalar(target/Math.max(size.x,size.y,size.z));return obj}
async function setup(){try{status.textContent='ARRIVING AT NEON CITADEL CRYSTAL...';const platform=await load('assets/Meshy_AI_Neon_Citadel_Crystal_1018164145_texture.glb');normalize(platform,9);nexus.add(platform); // platform below and around camera
// The camera is fixed near one of the elevated decks, with the structure ahead.
camera.position.set(0,2.25,5.5);baseLook.set(0,.5,0);camera.lookAt(baseLook);
status.textContent='LOCATING YOUR CRAFT...';try{cruiser=await load('assets/Meshy_AI_Neon_Disc_Cruiser_1018163656_texture.glb');normalize(cruiser,1.55);cruiser.position.set(2.2,1.65,-.6);scene.add(cruiser)}catch(e){console.warn('Craft unavailable',e)}
status.textContent='NEON CITADEL ONLINE // READY TO ENTER';button.disabled=false;button.textContent='ENTER';}catch(err){console.error(err);status.textContent='3D WORLD UNAVAILABLE // ENTER SITE';button.disabled=false;button.textContent='ENTER';}}
let mouseX=0,mouseY=0;addEventListener('pointermove',e=>{mouseX=e.clientX/innerWidth-.5;mouseY=e.clientY/innerHeight-.5},{passive:true});let tick=0;
function animate(){if(!boot.classList.contains('is-hidden')){tick+=.008;camera.position.x+=(mouseX*.4-camera.position.x)*.018;camera.lookAt(baseLook.x+mouseX*.3,baseLook.y-mouseY*.18,baseLook.z);if(cruiser){cruiser.position.y=1.65+Math.sin(tick*2)*.12;cruiser.rotation.y+=.0018}renderer.render(scene,camera)}requestAnimationFrame(animate)}animate();setup();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
function enter(){boot.classList.add('fade-out');site.classList.remove('is-hidden');setTimeout(()=>{boot.classList.add('is-hidden');renderer.dispose();canvas.replaceChildren();},900);window.scrollTo({top:0,behavior:'instant'})}button.addEventListener('click',enter);addEventListener('keydown',e=>{if(e.key==='Enter'&&!button.disabled&&!boot.classList.contains('is-hidden'))enter()});
const menu=document.querySelector('.menu-toggle'),nav=document.getElementById('nav');menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));document.getElementById('notifyBtn')?.addEventListener('click',()=>{document.getElementById('notifyMsg').textContent='BETA REGISTRATION IS NOT OPEN YET. WATCH FOR THE OFFICIAL SIGNAL.'});
