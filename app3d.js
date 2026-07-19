// ══════════════════════════════════════════════════
// STAR BACKGROUND (2D Canvas)
// ══════════════════════════════════════════════════
(function(){
  const c=document.getElementById('starCanvas'),cx=c.getContext('2d');
  let W,H,stars=[];
  function resize(){W=c.width=window.innerWidth;H=c.height=window.innerHeight;stars=Array.from({length:250},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.8+.2,o:Math.random(),sp:Math.random()*.008+.002}));}
  function draw(){cx.clearRect(0,0,W,H);stars.forEach(s=>{s.o+=s.sp;if(s.o>1)s.o=0;cx.beginPath();cx.arc(s.x,s.y,s.r,0,Math.PI*2);cx.fillStyle='rgba(255,255,255,'+Math.abs(Math.sin(s.o*Math.PI))+')';cx.fill();});requestAnimationFrame(draw);}
  resize();window.addEventListener('resize',resize);draw();
})();

// ══════════════════════════════════════════════════
// FIREWORKS (2D Canvas)
// ══════════════════════════════════════════════════
const fwC=document.getElementById('fireworkCanvas'),fwX=fwC.getContext('2d');
let fwOn=false,parts=[];
(function(){fwC.width=window.innerWidth;fwC.height=window.innerHeight;})();
window.addEventListener('resize',()=>{fwC.width=window.innerWidth;fwC.height=window.innerHeight;});
class Pt{constructor(x,y,col){this.x=x;this.y=y;this.col=col;const a=Math.random()*Math.PI*2,s=Math.random()*6+2;this.vx=Math.cos(a)*s;this.vy=Math.sin(a)*s;this.al=1;this.dc=Math.random()*.015+.01;this.g=.12;this.sz=Math.random()*3+1;}upd(){this.x+=this.vx;this.y+=this.vy;this.vy+=this.g;this.vx*=.98;this.al-=this.dc;}drw(ctx){ctx.save();ctx.globalAlpha=this.al;ctx.fillStyle=this.col;ctx.shadowBlur=12;ctx.shadowColor=this.col;ctx.beginPath();ctx.arc(this.x,this.y,this.sz,0,Math.PI*2);ctx.fill();ctx.restore();}}
function fwLaunch(){const cols=['#e8b86d','#f4a5b4','#a855f7','#00d4ff','#34d399','#fb7185','#fbbf24','#60a5fa'];const x=Math.random()*fwC.width,y=Math.random()*fwC.height*.6,col=cols[Math.floor(Math.random()*cols.length)];for(let i=0;i<90;i++)parts.push(new Pt(x,y,col));}
function animFW(){if(!fwOn)return;fwX.fillStyle='rgba(4,2,16,.18)';fwX.fillRect(0,0,fwC.width,fwC.height);parts=parts.filter(p=>p.al>.05);parts.forEach(p=>{p.upd();p.drw(fwX);});if(Math.random()<.04)fwLaunch();requestAnimationFrame(animFW);}
function startFW(){fwC.style.display='block';fwOn=true;animFW();for(let i=0;i<8;i++)setTimeout(fwLaunch,i*180);}

// ══════════════════════════════════════════════════
// AUDIO
// ══════════════════════════════════════════════════
let aCtx=null,beepOn=false;
function getCtx(){if(!aCtx)aCtx=new(window.AudioContext||window.webkitAudioContext)();return aCtx;}
function beep(f,dur,type,g){if(!beepOn)return;try{const c=getCtx(),o=c.createOscillator(),gn=c.createGain();o.connect(gn);gn.connect(c.destination);o.type=type||'sine';o.frequency.value=f||660;gn.gain.setValueAtTime(g||.18,c.currentTime);gn.gain.exponentialRampToValueAtTime(.001,c.currentTime+(dur||.07));o.start(c.currentTime);o.stop(c.currentTime+(dur||.07));}catch(e){}}
const audioBefore=new Audio('assets/before.mp3');audioBefore.loop=true;
const audioAfter=new Audio('assets/after.mp3');
function toggleBeep(){getCtx().resume();beepOn=!beepOn;const btn=document.getElementById('beepBtn');if(beepOn){btn.innerHTML='\u{1F3B5} Sound On';btn.style.color='#e8b86d';audioBefore.play().catch(()=>{});beep(880,.12,'sine',.25);}else{btn.innerHTML='\u{1F507} Sound Off';btn.style.color='';audioBefore.pause();}}

// ══════════════════════════════════════════════════
// COUNTDOWN
// ══════════════════════════════════════════════════
let TARGET,START_REF,TOTAL_SECS;
const eD=document.getElementById('days'),eH=document.getElementById('hours'),eM=document.getElementById('minutes'),eS=document.getElementById('seconds'),ePB=document.getElementById('progressBar'),ePL=document.getElementById('progressLabel');
function p2(n){return String(n).padStart(2,'0');}
function tickEl(el){el.classList.remove('tick');void el.offsetWidth;el.classList.add('tick');setTimeout(()=>el.classList.remove('tick'),200);}
let prevS=-1,iv;
function update(){const now=new Date(),diff=TARGET-now;if(diff<=0){showBD();return;}const tot=Math.floor(diff/1000),d=Math.floor(tot/86400),h=Math.floor((tot%86400)/3600),m=Math.floor((tot%3600)/60),s=tot%60;if(s!==prevS){if(prevS!==-1){tickEl(eS);if(s===59)tickEl(eM);if(s===59&&m===59)tickEl(eH);beep(s===0?880:660,s===0?.12:.06);}prevS=s;}eD.textContent=p2(d);eH.textContent=p2(h);eM.textContent=p2(m);eS.textContent=p2(s);const pct=Math.min(100,((TOTAL_SECS-tot)/TOTAL_SECS)*100);ePB.style.width=pct.toFixed(3)+'%';ePL.textContent=d+'d '+p2(h)+'h '+p2(m)+'m '+p2(s)+'s remaining \u2014 '+pct.toFixed(1)+'% complete';}

function checkPwd(){
  const v=document.getElementById('pwdInput').value;
  if(v==='fatima12345'||v==='dev12345'){
    document.getElementById('passwordPage').style.display='none';
    document.getElementById('countdownPage').style.display='flex';
    initApp(v);
  }else{
    document.getElementById('pwdError').style.display='block';
    document.getElementById('pwdInput').style.borderColor='#f87171';
  }
}
document.getElementById('pwdInput').addEventListener('keypress',e=>{if(e.key==='Enter')checkPwd();});

function showBD(){
  clearInterval(iv);
  document.getElementById('countdownPage').style.display='none';
  document.getElementById('birthdayPage').style.display='flex';
  const intro=document.getElementById('hbIntro');intro.style.display='flex';
  startFW();startEmoji();startPetals();
  audioBefore.pause();audioAfter.play().catch(()=>{});
  setTimeout(()=>{intro.style.transition='opacity 1.5s ease';intro.style.opacity='0';setTimeout(()=>{intro.style.display='none';launch3DScene();},1600);},6000);
}

function initApp(pwd){
  if(pwd==='dev12345'){TARGET=new Date(Date.now()+10000);START_REF=new Date();TOTAL_SECS=10;}
  else{TARGET=new Date('2026-07-20T00:00:00');START_REF=new Date('2026-07-01T00:00:00');TOTAL_SECS=Math.floor((TARGET-START_REF)/1000);}
  update();iv=setInterval(update,1000);
  if(new Date()>=TARGET)showBD();
}

// ══════════════════════════════════════════════════
// EMOJI / PETALS
// ══════════════════════════════════════════════════
function startEmoji(){const r=document.getElementById('emojiRain');r.style.display='block';const e=['\u{1F389}','\u{1F38A}','\u{1F382}','\u{1F338}','\u{1F496}','\u2728','\u{1F31F}','\u{1F388}','\u{1F49C}','\u{1F33A}'];for(let i=0;i<30;i++){const s=document.createElement('span');s.textContent=e[Math.floor(Math.random()*e.length)];s.style.left=Math.random()*100+'%';s.style.animationDuration=(Math.random()*6+4)+'s';s.style.animationDelay=(Math.random()*6)+'s';r.appendChild(s);}}
let petalInterval=null;
function startPetals(){if(petalInterval)return;petalInterval=setInterval(()=>{const p=document.createElement('div');p.className='petal';const c=['\u{1F338}','\u{1F33A}','\u{1F339}','\u{1F4AE}'];p.textContent=c[Math.floor(Math.random()*c.length)];p.style.left=Math.random()*100+'%';p.style.fontSize=(Math.random()*14+10)+'px';const d=Math.random()*8+6;p.style.animationDuration=d+'s';document.body.appendChild(p);setTimeout(()=>p.remove(),d*1000);},900);}

// ══════════════════════════════════════════════════
// LETTER LOADER
// ══════════════════════════════════════════════════
const DL=`My dearest, most incredible, most irreplaceable Fatima,

Today is not just a birthday. Today is the anniversary of the universe making its single greatest decision \u2014 bringing you into existence. The world is infinitely better because you are in it.

You walk through the world thinking you are ordinary, but I see someone who has survived storms with an open, loving heart, whose kindness changes lives, and whose brilliant sense of humor brings pure joy to every moment.

Being your friend has given me permission to be myself, courage to face fears, and a safe home in this world. I wish you peace, surprise-filled joy, and decades more of our friendship.

You are extraordinary, Fatima. Happy Birthday, my love! \u{1F382}\u{1F49B}\u{1F338}`;
let letterText='';
function loadLetterText(){fetch('message.txt').then(r=>{if(!r.ok)throw 0;return r.text();}).then(t=>{letterText=t.trim()||DL;document.getElementById('letterBody').textContent=letterText;}).catch(()=>{letterText=DL;document.getElementById('letterBody').textContent=DL;});}
loadLetterText();

// ══════════════════════════════════════════════════
// GAME STATE
// ══════════════════════════════════════════════════
let trunkOpened=false, candlesBlown=[false,false,false], cakeCut=false, letterRead=false, crystalActivated=false;
function setHint(msg){document.getElementById('hintBanner').textContent=msg;}
function updateSteps(){
  const states=[trunkOpened,candlesBlown.every(b=>b),cakeCut,letterRead||crystalActivated,crystalActivated];
  for(let i=0;i<5;i++){
    const el=document.getElementById('step'+i);
    if(states[i])el.className='step-dot done';
    else if(i===0||(i>0&&states[i-1]))el.className='step-dot active';
    else el.className='step-dot';
  }
}

// ══════════════════════════════════════════════════
// THREE.JS 3D SCENE
// ══════════════════════════════════════════════════
let scene,camera,renderer,clock;
let carGroup,trunkLid,trunkInterior;
let indicatorLMat,indicatorRMat;
let candleFlames=[],cakeObj,letterObj,giftObj;
let exhaustSystems=[];
let raycaster,mouse;
let clickableObjects=[];
let threeRunning=false;
let orbitState={
  theta:0, phi:1.35, radius:9.5, y: 1.5, z: 0,
  targetTheta:0, targetPhi:1.35, targetRadius:9.5, targetY: 1.5, targetZ: 0,
  isDragging:false, autoRotate:false
};

function launch3DScene(){
  document.getElementById('threeCanvas').style.display='block';
  document.getElementById('gameHud').style.display='block';
  init3D();
  setupOrbitControls();
  animate3D();
}

function M(color,rough,metal,opts){return new THREE.MeshStandardMaterial(Object.assign({color:color,roughness:rough,metalness:metal},opts||{}));}

function init3D(){
  const canvas=document.getElementById('threeCanvas');
  clock=new THREE.Clock();
  scene=new THREE.Scene();
  scene.fog=new THREE.FogExp2(0x020108,.035);
  camera=new THREE.PerspectiveCamera(50,window.innerWidth/window.innerHeight,.1,100);
  camera.position.set(0,3.5,11);
  camera.lookAt(0,1.5,0);
  renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:true,alpha:true});
  renderer.setSize(window.innerWidth,window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.25;
  raycaster=new THREE.Raycaster();
  mouse=new THREE.Vector2();
  canvas.addEventListener('click',onCanvasClick);
  canvas.addEventListener('touchend',onCanvasTouch,{passive:true});
  window.addEventListener('resize',onWindowResize);
  buildLighting();
  buildGround();
  buildCar();
  buildExhaustSmoke();
  threeRunning=true;
}

function setupOrbitControls(){
  // Intentionally disabled so the camera stays fixed at the back of the car
}

function pos(obj, x, y, z) {
  obj.position.set(x, y, z);
  return obj;
}
function shd(obj, cast, recv) {
  if (cast) obj.castShadow = true;
  if (recv) obj.receiveShadow = true;
  return obj;
}

function buildLighting(){
  scene.add(new THREE.AmbientLight(0x1a0830,1.2));
  const moon=new THREE.DirectionalLight(0x8899ff,.7);
  moon.position.set(-5,12,8);moon.castShadow=true;
  moon.shadow.mapSize.set(2048,2048);
  moon.shadow.camera.near=.1;moon.shadow.camera.far=50;
  moon.shadow.camera.left=-10;moon.shadow.camera.right=10;
  moon.shadow.camera.top=10;moon.shadow.camera.bottom=-10;
  scene.add(moon);
  scene.add(pos(new THREE.PointLight(0xff2200,4,7),-3.2,2,2.2));
  scene.add(pos(new THREE.PointLight(0xff2200,4,7),3.2,2,2.2));
  scene.add(pos(new THREE.PointLight(0x6600ff,1.5,5),0,-.2,0));
}

function buildGround(){
  const road=new THREE.Mesh(new THREE.PlaneGeometry(40,40),M(0x0a0a10,.9,.15));
  road.rotation.x=-Math.PI/2;road.position.y=-.05;road.receiveShadow=true;scene.add(road);
  const strip=new THREE.Mesh(new THREE.PlaneGeometry(.15,8),M(0xffdd44,.4,.1,{emissive:0xffdd44,emissiveIntensity:.3}));
  strip.rotation.x=-Math.PI/2;strip.position.set(0,-.04,8);scene.add(strip);
}

function createLicensePlate() {
  var canvas=document.createElement('canvas');canvas.width=512;canvas.height=128;
  var ctx=canvas.getContext('2d');
  ctx.fillStyle='#fdfdfd';ctx.fillRect(0,0,512,128);
  ctx.strokeStyle='#111';ctx.lineWidth=12;ctx.strokeRect(6,6,500,116);
  ctx.fillStyle='#111';ctx.font='bold 80px "Montserrat", sans-serif';
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText('FATIMA',256,68);
  return new THREE.CanvasTexture(canvas);
}

function buildCar(){
  carGroup=new THREE.Group();scene.add(carGroup);
  const body=M(0x1a1a24,.15,.8); // Sleek dark metallic paint
  const dark=M(0x0a0a0f,.85,.05);
  const chrome=M(0xf0f0f0,.05,1);
  const glass=M(0x05080c,.05,0,{transparent:true,opacity:.75});
  const black=M(0x020202,.95,.02);

  // --- LOWER BODY ---
  // Front/Mid solid body (z = -2.1 to 1.2)
  carGroup.add(shd(pos(new THREE.Mesh(new THREE.BoxGeometry(6.6, 1.3, 3.3), body), 0, 0.85, -0.45), true));
  // Left rear fender (z = 1.2 to 2.4)
  carGroup.add(shd(pos(new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.3, 1.2), body), -3.15, 0.85, 1.8), true));
  // Right rear fender
  carGroup.add(shd(pos(new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.3, 1.2), body), 3.15, 0.85, 1.8), true));
  // Trunk floor (under cavity)
  carGroup.add(shd(pos(new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.4, 1.2), body), 0, 0.4, 1.8), true));
  // Rear wall (behind taillights)
  carGroup.add(shd(pos(new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.9, 0.1), body), 0, 1.05, 2.35), true));
  
  // --- UPPER CABIN ---
  carGroup.add(shd(pos(new THREE.Mesh(new THREE.BoxGeometry(5.8, 1.1, 2.0), body), -.2, 2.05, -0.5), true));

  // --- REAR WINDSHIELD ---
  const rws = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.0, 0.08), glass);
  rws.position.set(-.2, 1.8, 0.85); rws.rotation.x = -0.6; carGroup.add(rws);
  for(let i=0;i<6;i++){
    const d=new THREE.Mesh(new THREE.BoxGeometry(3.6,.01,.01),M(0xcc6600,.3,.2,{emissive:0xcc6600,emissiveIntensity:.2}));
    d.position.set(-.2, 1.45+i*.14, 1.1 - i*.09); d.rotation.x=-0.6; carGroup.add(d);
  }

  // --- BUMPER & DIFFUSER ---
  carGroup.add(shd(pos(new THREE.Mesh(new THREE.BoxGeometry(6.8,.4,.4),body),0,.3,2.2),true));
  carGroup.add(pos(new THREE.Mesh(new THREE.BoxGeometry(5.4,.3,.3),black),0,.15,2.3));

  // Sleek Wrap-around Taillights
  indicatorLMat=M(0xffaa00,.2,.1,{emissive:0xffaa00,emissiveIntensity:.1});
  indicatorRMat=M(0xffaa00,.2,.1,{emissive:0xffaa00,emissiveIntensity:.1});
  const brake=M(0xff0000,.2,.1,{emissive:0xff0000,emissiveIntensity:4.5});
  const tlb=M(0x1a0000,.3,.2);
  
  carGroup.add(pos(new THREE.Mesh(new THREE.BoxGeometry(1.6,.35,.15),tlb),-2.5,1.2,2.4));
  carGroup.add(pos(new THREE.Mesh(new THREE.BoxGeometry(1.4,.15,.12),brake),-2.5,1.25,2.43));
  carGroup.add(pos(new THREE.Mesh(new THREE.BoxGeometry(.6,.1,.1),indicatorLMat),-3.0,1.12,2.43));
  
  carGroup.add(pos(new THREE.Mesh(new THREE.BoxGeometry(1.6,.35,.15),tlb),2.5,1.2,2.4));
  carGroup.add(pos(new THREE.Mesh(new THREE.BoxGeometry(1.4,.15,.12),brake),2.5,1.25,2.43));
  carGroup.add(pos(new THREE.Mesh(new THREE.BoxGeometry(.6,.1,.1),indicatorRMat),3.0,1.12,2.43));
  
  carGroup.add(pos(new THREE.Mesh(new THREE.BoxGeometry(3.4,.08,.1),brake),0,1.25,2.43));

  // License plate
  var plateMat = M(0xffffff,.5,.1,{map:createLicensePlate()});
  carGroup.add(pos(new THREE.Mesh(new THREE.BoxGeometry(1.4,.35,.04),plateMat),0,0.85,2.42));
  scene.add(pos(new THREE.PointLight(0xffffff,1,1.5),0,0.95,2.6));

  // Tires (4)
  var tireMat=M(0x111111,.95,.0),rimMat=M(0xb0b0b0,.1,1);
  [[3.2,.8,1.7],[-3.2,.8,1.7],[3.2,.8,-1.7],[-3.2,.8,-1.7]].forEach(function(posArr){
    var tire=new THREE.Mesh(new THREE.CylinderGeometry(.8,.8,.55,32),tireMat);
    tire.rotation.z=Math.PI/2;tire.position.set(posArr[0],posArr[1],posArr[2]);tire.castShadow=true;carGroup.add(tire);
    var rim=new THREE.Mesh(new THREE.CylinderGeometry(.45,.45,.58,12),rimMat);
    rim.rotation.z=Math.PI/2;rim.position.set(posArr[0],posArr[1],posArr[2]);carGroup.add(rim);
    for(var s=0;s<6;s++){var sp=new THREE.Mesh(new THREE.BoxGeometry(.55,.06,.06),rimMat);sp.rotation.set(0,s*(Math.PI*2/6),Math.PI/2);sp.position.set(posArr[0],posArr[1],posArr[2]);carGroup.add(sp);}
    var sd=shd(new THREE.Mesh(new THREE.CircleGeometry(.85,20),M(0x000000,.9,.0,{transparent:true,opacity:.5})),false,false);
    sd.rotation.x=-Math.PI/2;sd.position.set(posArr[0],.02,posArr[2]);scene.add(sd);
  });

  // Exhaust tips
  var exMat=M(0x888888,.3,1),exG=new THREE.CylinderGeometry(.12,.15,.4,20);
  var ex1=new THREE.Mesh(exG,exMat);ex1.rotation.x=Math.PI/2;ex1.position.set(-1.8,.25,2.35);carGroup.add(ex1);
  var ex2=new THREE.Mesh(exG,exMat);ex2.rotation.x=Math.PI/2;ex2.position.set(1.8,.25,2.35);carGroup.add(ex2);

  // Trunk lid
  var lidGroup=new THREE.Group();
  lidGroup.position.set(0,1.5,1.2);
  lidGroup.add(shd(pos(new THREE.Mesh(new THREE.BoxGeometry(6.4,.1,1.2),body),0,0,.6),true));
  lidGroup.add(pos(new THREE.Mesh(new THREE.BoxGeometry(6.4,.08,.2),body),0,.05,1.1));
  
  var emb=new THREE.Mesh(new THREE.CylinderGeometry(.25,.25,.05,24),chrome);emb.position.set(0,.05,.6);emb.rotation.x=Math.PI/2;lidGroup.add(emb);
  
  var cz=new THREE.Mesh(new THREE.BoxGeometry(6.6,.5,1.4),new THREE.MeshBasicMaterial({transparent:true,opacity:0}));
  cz.position.set(0,0,.6);cz.name='TRUNK_LID';lidGroup.add(cz);clickableObjects.push(cz);
  carGroup.add(lidGroup);
  trunkLid=lidGroup;

  // Trunk interior
  trunkInterior=new THREE.Group();
  trunkInterior.visible=false;
  trunkInterior.position.set(0,0.6,1.2);
  carGroup.add(trunkInterior);
  buildTrunkContents();
}

function buildTrunkContents(){
  var wallM=M(0x110a22,.9,.1), flrM=M(0x1a0f2e,.9,.1);
  // Interior floor: Width 6.0, Depth 1.1. Local center at Z = 0.55, Y = 0.05
  trunkInterior.add(pos(new THREE.Mesh(new THREE.BoxGeometry(5.9,.05,1.05),flrM),0,0.025,0.55));
  // Front wall (closest to cabin) at local Z = 0.025
  trunkInterior.add(pos(new THREE.Mesh(new THREE.BoxGeometry(6.0,0.8,.05),wallM),0,.4,0.025));
  // Back wall (closest to rear bumper) at local Z = 1.075
  trunkInterior.add(pos(new THREE.Mesh(new THREE.BoxGeometry(6.0,0.8,.05),wallM),0,.4,1.075));
  // Side walls
  trunkInterior.add(pos(new THREE.Mesh(new THREE.BoxGeometry(.05,0.8,1.1),wallM),-2.975,.4,0.55));
  trunkInterior.add(pos(new THREE.Mesh(new THREE.BoxGeometry(.05,0.8,1.1),wallM),2.975,.4,0.55));

  // Cake: center it
  cakeObj=buildCakeMesh();
  cakeObj.scale.set(1.2, 1.2, 1.2);
  cakeObj.position.set(0,0.05,0.5);cakeObj.name='CAKE';trunkInterior.add(cakeObj);

  // Letter: left side
  letterObj=new THREE.Group();
  letterObj.add(pos(new THREE.Mesh(new THREE.BoxGeometry(.8,.05,.6),M(0xc4b5fd,.5,.1)),0,.025,0));
  letterObj.add(pos(new THREE.Mesh(new THREE.BoxGeometry(.8,.05,.3),M(0xa78bfa,.4,.1)),0,.04,-.15));
  var seal=pos(new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,.04,16),M(0xbe123c,.6,.1,{emissive:0xbe123c,emissiveIntensity:.5})),0,.06,-.05);
  letterObj.add(seal);
  letterObj.add(pos(new THREE.PointLight(0xa78bfa,1.5,1.5),0,.2,0));
  letterObj.position.set(-1.6, 0.05, 0.6);letterObj.rotation.y=.4;letterObj.name='LETTER';letterObj.userData.locked=true;
  var lcs=pos(new THREE.Mesh(new THREE.BoxGeometry(1.0,.6,.8),new THREE.MeshBasicMaterial({transparent:true,opacity:0})),0,.2,0);
  lcs.name='LETTER';letterObj.add(lcs);clickableObjects.push(lcs);
  trunkInterior.add(letterObj);

  // Gift: right side
  giftObj=buildGiftMesh();
  giftObj.scale.set(1.1, 1.1, 1.1);
  giftObj.position.set(1.6, 0.05, 0.6);giftObj.rotation.y=-.3;giftObj.name='GIFT';giftObj.userData.locked=true;trunkInterior.add(giftObj);

  // Fairy lights
  for(var i=0;i<22;i++){
    var col=[0xffdd00,0xff44aa,0x00eeff,0xff6600][i%4];
    var bm=M(col,.3,.1,{emissive:col,emissiveIntensity:3.5});
    var b=new THREE.Mesh(new THREE.SphereGeometry(.05,8,8),bm);
    b.position.set(-2.8+i*.26,0.8,0.1+Math.sin(i*.7)*.12);trunkInterior.add(b);
    if(i%4===0){var pl=new THREE.PointLight(col,1,1.5);pl.position.copy(b.position);trunkInterior.add(pl);}
  }
  
  // Neon sign
  var nm=M(0xff4488,.3,.1,{emissive:0xff4488,emissiveIntensity:5});
  for(var k=0;k<8;k++){var ns=pos(new THREE.Mesh(new THREE.BoxGeometry(.28,.07,.04),nm),-1.0+k*.3,0.6,0.08);trunkInterior.add(ns);}
  trunkInterior.add(pos(new THREE.PointLight(0xff4488,2.5,2.5),0,0.6,0.1));

  // Balloons
  var bcs=[0xe8b86d,0xf4a5b4,0xd4b4f0,0x00e5ff,0x34d399,0xff477e];
  for(var ii=0;ii<6;ii++){
    var b2=pos(new THREE.Mesh(new THREE.SphereGeometry(.3+Math.random()*.1,16,16),M(bcs[ii],.3,.2,{transparent:true,opacity:.95})),
      -2.4+ii*.9,.5+Math.random()*.2,0.3+Math.random()*.5);
    b2.userData.fp=Math.random()*Math.PI*2;b2.userData.fs=1.2+Math.random()*.8;
    trunkInterior.add(b2);
  }

  var rg=new THREE.Group();
  var stemM=M(0x166534,.8,.0);
  for(var ri=0;ri<4;ri++){rg.add(pos(new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,.6,8),stemM),-.1+ri*.08,.3,0));}
  var rcols=[0xe11d48,0xdb2777,0xfb7185,0xff4d6d];
  for(var rj=0;rj<4;rj++){
    rg.add(pos(new THREE.Mesh(new THREE.SphereGeometry(.15+rj*.015,12,12),M(rcols[rj],.4,.1)),-.15+rj*.14,.6+Math.sin(rj*1.2)*.05,0));
  }
  rg.add(pos(new THREE.Mesh(new THREE.ConeGeometry(.28,.5,16,1,true),M(0xfce7f3,.7,.0,{transparent:true,opacity:.85,side:THREE.DoubleSide})),0,.25,0));
  rg.position.set(2.4,0.1,0.5);rg.rotation.z=-0.2;rg.rotation.x=0.2;rg.userData.fp=.6;rg.userData.fs=1.1;trunkInterior.add(rg);

  clickableObjects.push(trunkInterior); // Make all visual interior elements raycastable
}

function buildCakeMesh(){
  var cg=new THREE.Group();
  cg.add(pos(new THREE.Mesh(new THREE.CylinderGeometry(.44,.44,.08,22),M(0xcccccc,.2,.9)),0,.04,0));
  cg.add(pos(new THREE.Mesh(new THREE.CylinderGeometry(.38,.42,.34,22),M(0xfef9e7,.7,.0)),0,.25,0));
  var c1=pos(new THREE.Mesh(new THREE.TorusGeometry(.38,.045,8,22),M(0xfbbf24,.5,.1,{emissive:0xf59e0b,emissiveIntensity:.2})),0,.42,0);c1.rotation.x=Math.PI/2;cg.add(c1);
  cg.add(pos(new THREE.Mesh(new THREE.CylinderGeometry(.28,.3,.28,22),M(0xfda4af,.6,.0)),0,.58,0));
  var c2=pos(new THREE.Mesh(new THREE.TorusGeometry(.28,.038,8,22),M(0xff6b8b,.4,.1,{emissive:0xff6b8b,emissiveIntensity:.3})),0,.72,0);c2.rotation.x=Math.PI/2;cg.add(c2);
  var sm=M(0xef4444,.6,.0,{emissive:0xef4444,emissiveIntensity:.15});
  for(var i=0;i<5;i++){var st=pos(new THREE.Mesh(new THREE.SphereGeometry(.055,8,8),sm),Math.cos((i/5)*Math.PI*2)*.16,.74,Math.sin((i/5)*Math.PI*2)*.16);cg.add(st);}
  candleFlames=[];
  var ccols=[0xf472b6,0x67e8f9,0x86efac];
  for(var ci=0;ci<3;ci++){
    var angle=((ci-1)/3)*Math.PI*.9;
    var cx2=Math.cos(angle)*.16,cz2=Math.sin(angle)*.16;
    var candle=pos(new THREE.Mesh(new THREE.CylinderGeometry(.036,.036,.24,10),M(ccols[ci],.7,.0)),cx2,.85,cz2);
    candle.name = 'CANDLE_' + (ci+1);
    cg.add(candle);
    
    // Giant invisible hitbox for the candle to make it easy to click
    var candleHitbox = pos(new THREE.Mesh(new THREE.BoxGeometry(.5, 1.2, .5), new THREE.MeshBasicMaterial({transparent:true, opacity:0})), cx2, 1.0, cz2);
    candleHitbox.name = 'CANDLE_' + (ci+1);
    cg.add(candleHitbox);

    var fm2=M(0xfbbf24,.3,.0,{emissive:0xff8800,emissiveIntensity:4.5,transparent:true,opacity:.92});
    var flame=pos(new THREE.Mesh(new THREE.SphereGeometry(.042,8,8),fm2),cx2,.97,cz2);
    flame.name = 'CANDLE_' + (ci+1);
    flame.userData={baseY:.97,phase:ci*.8,alive:true,candleIndex:ci,isFlame:true};cg.add(flame);
    var fpl=pos(new THREE.PointLight(0xff8800,.9,.85),cx2,.98,cz2);
    fpl.userData={baseY:.98,phase:ci*.8,alive:true,candleIndex:ci,isLight:true};cg.add(fpl);
    candleFlames.push(flame,fpl);
  }
  var ccs=pos(new THREE.Mesh(new THREE.BoxGeometry(.9,.7,.9),new THREE.MeshBasicMaterial({transparent:true,opacity:0})),0,.35,0);
  ccs.name='CAKE';cg.add(ccs);clickableObjects.push(ccs);
  return cg;
}

function buildGiftMesh(){
  var gg=new THREE.Group();
  gg.add(pos(new THREE.Mesh(new THREE.BoxGeometry(.68,.68,.68),M(0xe11d48,.4,.1)),0,.34,0));
  gg.add(pos(new THREE.Mesh(new THREE.BoxGeometry(.7,.13,.7),M(0xfb7185,.35,.15)),0,.715,0));
  var rm=M(0xffd700,.3,.3,{emissive:0xffd700,emissiveIntensity:.35});
  gg.add(pos(new THREE.Mesh(new THREE.BoxGeometry(.7,.68,.06),rm),0,.34,0));
  gg.add(pos(new THREE.Mesh(new THREE.BoxGeometry(.06,.68,.7),rm),0,.34,0));
  var b1=new THREE.Mesh(new THREE.TorusGeometry(.12,.036,8,12,Math.PI),rm);b1.position.set(-.1,.83,0);b1.rotation.z=.55;gg.add(b1);
  var b2=b1.clone();b2.position.x=.1;b2.rotation.z=-.55;gg.add(b2);
  gg.add(pos(new THREE.PointLight(0xff4466,1.5,1.2),0,.5,0));
  // Click surface
  var gcs=new THREE.Mesh(new THREE.BoxGeometry(.8,1,.8),new THREE.MeshBasicMaterial({transparent:true,opacity:0}));
  gcs.position.y=.45;gcs.name='GIFT';gg.add(gcs);clickableObjects.push(gcs);
  return gg;
}

function buildExhaustSmoke(){
  for(var pipe=0;pipe<2;pipe++){
    var count=60,pos=new Float32Array(count*3),vel=[],ages=[];
    for(var i=0;i<count;i++){pos[i*3]=pos[i*3+1]=pos[i*3+2]=0;vel.push({x:(Math.random()-.5)*.012,y:Math.random()*.025+.005,z:Math.random()*.04+.01});ages.push(Math.random());}
    var geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
    var pts=new THREE.Points(geo,new THREE.PointsMaterial({color:0xaabbcc,size:.1,transparent:true,opacity:.16,depthWrite:false}));
    pts.position.set(-1.8+pipe*.42,.22,2.78);pts.userData={p:pos,v:vel,a:ages,c:count};
    scene.add(pts);exhaustSystems.push(pts);
  }
}

function animate3D(){
  if(!threeRunning)return;
  requestAnimationFrame(animate3D);
  var dt=clock.getDelta(),elapsed=clock.getElapsedTime();
  // Orbit camera
  var os=orbitState;
  if(os.autoRotate)os.targetTheta+=.003;
  os.theta+=(os.targetTheta-os.theta)*dt*3;
  os.phi+=(os.targetPhi-os.phi)*dt*2;
  os.radius+=(os.targetRadius-os.radius)*dt*2;
  os.y+=(os.targetY-os.y)*dt*2;
  os.z+=(os.targetZ-os.z)*dt*2;
  
  camera.position.setFromSphericalCoords(os.radius,os.phi,os.theta);
  camera.position.y+=os.y;
  camera.position.z+=os.z;
  camera.lookAt(0,os.y,os.z);
  
  // Indicators
  var flash=Math.sin(elapsed*Math.PI/.35)>0;
  if(indicatorLMat)indicatorLMat.emissiveIntensity=flash?6:.1;
  if(indicatorRMat)indicatorRMat.emissiveIntensity=flash?6:.1;
  // Candle flicker
  candleFlames.forEach(function(f){
    if(!f.userData.alive)return;
    var p=f.userData.phase,fl=Math.sin(elapsed*12+p)*.009+Math.sin(elapsed*19+p)*.005;
    if(f.userData.isFlame){f.position.y=f.userData.baseY+fl;if(f.material)f.material.emissiveIntensity=3.8+Math.sin(elapsed*15+p)*1.8;}
    else if(f.userData.isLight){f.position.y=f.userData.baseY+fl;f.intensity=.85+Math.sin(elapsed*14+p)*.35;}
  });
  // Trunk open
  if(trunkLid&&trunkLid.userData.opening){
    trunkLid.userData.openProgress=Math.min(1,(trunkLid.userData.openProgress||0)+dt*.7);
    trunkLid.rotation.x=-trunkLid.userData.openProgress*1.9;
    if(trunkLid.userData.openProgress>=1){trunkLid.userData.opening=false;trunkInterior.visible=true;setHint('\u{1F56F} Click each candle flame to blow it out!');updateSteps();playChime();}
  }
  // Float items
  if(trunkInterior.visible){
    trunkInterior.children.forEach(function(ch){
      if(ch.userData.fp!==undefined)ch.position.y+=Math.sin(elapsed*(ch.userData.fs||1.5)+ch.userData.fp)*.0005;
    });
  }
  // Exhaust
  exhaustSystems.forEach(function(sys){
    var d=sys.userData;
    for(var i=0;i<d.c;i++){
      d.a[i]+=.012;
      if(d.a[i]>1){d.a[i]=0;d.p[i*3]=d.p[i*3+1]=d.p[i*3+2]=0;}
      d.p[i*3]+=d.v[i].x;d.p[i*3+1]+=d.v[i].y;d.p[i*3+2]+=d.v[i].z;
    }
    sys.geometry.attributes.position.needsUpdate=true;
  });
  renderer.render(scene,camera);
}

function onWindowResize(){
  camera.aspect=window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth,window.innerHeight);
}

function getMouseNDC(e){
  var rect=renderer.domElement.getBoundingClientRect();
  var cx=e.touches?e.changedTouches[0].clientX:e.clientX;
  var cy=e.touches?e.changedTouches[0].clientY:e.clientY;
  mouse.x=((cx-rect.left)/rect.width)*2-1;
  mouse.y=-((cy-rect.top)/rect.height)*2+1;
}
function onCanvasTouch(e){if(orbitState.isDragging)return;getMouseNDC(e);doRaycast();}
function onCanvasClick(e){getMouseNDC(e);doRaycast();}
function doRaycast(){
  raycaster.setFromCamera(mouse,camera);
  var hits=raycaster.intersectObjects(clickableObjects,true);
  if(!hits.length)return;
  var obj=hits[0].object;
  while(obj&&!obj.name)obj=obj.parent;
  if(!obj)return;
  var n=obj.name;
  if(n==='TRUNK_LID'||n==='TRUNK_BTN')handleTrunkClick();
  else if(n.indexOf('CANDLE_')===0)handleCandleClick(parseInt(n.split('_')[1]));
  else if(n==='CAKE')handleCakeClick();
  else if(n==='LETTER')handleLetterClick();
  else if(n==='GIFT')handleGiftClick();
}

function handleTrunkClick(){
  if(trunkOpened)return;trunkOpened=true;
  orbitState.autoRotate=false;
  var btnHud = document.getElementById('openTrunkHudBtn');
  if(btnHud) btnHud.style.display = 'none';

  var gameHud = document.getElementById('gameHud');
  if(gameHud && !document.getElementById('blowBtn')) {
    var btnCont = document.createElement('div');
    btnCont.style.position = 'absolute';
    btnCont.style.bottom = '120px';
    btnCont.style.width = '100%';
    btnCont.style.textAlign = 'center';
    btnCont.style.zIndex = '100';
    btnCont.style.pointerEvents = 'none';

    var createBtn = function(id, text, handler) {
        var b = document.createElement('button');
        b.id = id; b.innerHTML = text; b.style.display = 'none';
        b.style.padding = '18px 36px'; b.style.margin = '5px';
        b.style.borderRadius = '30px'; b.style.background = 'linear-gradient(135deg, #ffe082, #ffd700)';
        b.style.color = '#120902'; b.style.fontWeight = 'bold'; b.style.fontSize = '1.1rem';
        b.style.border = 'none'; b.style.cursor = 'pointer'; b.style.pointerEvents = 'auto';
        b.style.boxShadow = '0 8px 25px rgba(212,175,55,0.5)';
        b.onclick = handler; return b;
    };

    var blowBtn = createBtn('blowBtn', '\uD83C\uDF82 Blow Candles', function(){ handleCandleClick(1);handleCandleClick(2);handleCandleClick(3); });
    var cutBtn = createBtn('cutBtn', '\uD83C\uDF70 Cut Cake', function(){ handleCakeClick(); });
    var letterBtn = createBtn('letterBtn', '\uD83D\uDCE8 Read Letter', function(){ handleLetterClick(); });
    var giftBtn = createBtn('giftBtn', '\uD83C\uDF81 Open Gift', function(){ handleGiftClick(); });

    btnCont.appendChild(blowBtn); btnCont.appendChild(cutBtn);
    btnCont.appendChild(letterBtn); btnCont.appendChild(giftBtn);
    gameHud.appendChild(btnCont);
  }
  var bBtn = document.getElementById('blowBtn');
  if(bBtn) bBtn.style.display = 'inline-block';

  trunkLid.userData.opening=true;trunkLid.userData.openProgress=0;
  triggerBurst3D(new THREE.Vector3(0,2.5,2));

  // Remove trunk lid and button from clickable objects so they don't block clicks inside
  clickableObjects = clickableObjects.filter(function(o){ return o.name !== 'TRUNK_LID' && o.name !== 'TRUNK_BTN'; });

  // Animate camera to look exactly at the trunk contents
  orbitState.targetPhi = 0.55;
  orbitState.targetRadius = 5.0;
  orbitState.targetY = 0.6;
  orbitState.targetZ = 1.8;

  // ABSOLUTE FOOLPROOF BACKUP: Auto-progress the sequence!
  setTimeout(function(){
    if(typeof candlesBlown !== 'undefined' && !candlesBlown.every(function(b){return b;})){
      handleCandleClick(1);handleCandleClick(2);handleCandleClick(3);
    }
  }, 8000); // Wait 8 seconds, if they haven't figured it out, blow candles for them!
}
function handleCandleClick(num){
  if(!trunkOpened)return;
  var idx=num-1;if(candlesBlown[idx])return;
  candlesBlown[idx]=true;
  candleFlames.forEach(function(f){
    if(f.userData.candleIndex===idx){f.userData.alive=false;if(f.userData.isFlame)f.visible=false;else if(f.userData.isLight)f.intensity=0;}
  });
  playBlowSound();
  var wp=new THREE.Vector3();cakeObj.getWorldPosition(wp);wp.y+=1;triggerBurst3D(wp);
  if(candlesBlown.every(function(b){return b;})){
    setHint('\u{1F382} All candles blown! Click the cake to cut it!');updateSteps();
    var bBtn=document.getElementById('blowBtn'), cBtn=document.getElementById('cutBtn');
    if(bBtn)bBtn.style.display='none';
    if(cBtn)cBtn.style.display='inline-block';

    // Auto-cut cake after 5 seconds just in case!
    setTimeout(function(){
      if(typeof cakeCut !== 'undefined' && !cakeCut) handleCakeClick();
    }, 6000);
  }
  else{var l=3-candlesBlown.filter(Boolean).length;setHint('\u{1F56F} '+l+' candle'+(l>1?'s':'')+' left to blow!');}
}
function handleCakeClick(){
  if(!trunkOpened){setHint('\u26A0\uFE0F Open the trunk first!');return;}
  if(!candlesBlown.every(function(b){return b;})){
    // Fallback: If they clicked the cake but haven't blown all candles, blow one for them!
    var unblownIdx = candlesBlown.indexOf(false);
    if(unblownIdx !== -1) handleCandleClick(unblownIdx + 1);
    return;
  }
  if(cakeCut)return;cakeCut=true;
  cutCakeAnim();playChime();
  var wp=new THREE.Vector3();cakeObj.getWorldPosition(wp);wp.y+=.5;triggerConfetti3D(wp);
  if(letterObj)letterObj.userData.locked=false;
  if(giftObj)giftObj.userData.locked=false;
  setHint('\u{1F381} Gifts unlocked! Click the \u{1F48C} Letter or \u{1F381} Gift box!');updateSteps();
  var cBtn=document.getElementById('cutBtn'), lBtn=document.getElementById('letterBtn'), gBtn=document.getElementById('giftBtn');
  if(cBtn)cBtn.style.display='none';
  if(lBtn)lBtn.style.display='inline-block';
  if(gBtn)gBtn.style.display='inline-block';
  
  // Ultimate backup: auto-progress to letter and gift!
  setTimeout(function(){
    if(typeof letterRead !== 'undefined' && !letterRead) handleLetterClick();
  }, 10000);
  setTimeout(function(){
    if(typeof giftObj !== 'undefined' && giftObj && !giftObj.userData.opened) handleGiftClick();
  }, 22000);
}
function cutCakeAnim(){
  var start=clock.getElapsedTime();
  function step(){var p=Math.min(1,(clock.getElapsedTime()-start)/.9);if(cakeObj.children[1])cakeObj.children[1].position.x=-p*.38;if(cakeObj.children[4])cakeObj.children[4].position.x=p*.38;if(p<1)requestAnimationFrame(step);}requestAnimationFrame(step);
}
function shakeCakeAnim(){
  var ox=cakeObj.position.x,t=0;
  function step(){t+=.08;cakeObj.position.x=ox+Math.sin(t*25)*.12*(1-t);if(t<1)requestAnimationFrame(step);else cakeObj.position.x=ox;}requestAnimationFrame(step);
}
function handleLetterClick(){
  if(!trunkOpened){setHint('\u26A0\uFE0F Open trunk first!');return;}
  if(letterRead)return;
  var lBtn=document.getElementById('letterBtn'); if(lBtn)lBtn.style.display='none';
  playMagicSound();letterRead=true;
  var m=document.getElementById('letterModal');m.style.display='flex';setTimeout(function(){m.classList.add('active');},10);
  checkAllComplete();updateSteps();
}
function handleGiftClick(){
  if(!trunkOpened){setHint('\u26A0\uFE0F Open trunk first!');return;}
  if(giftObj.userData.opened)return;
  var gBtn=document.getElementById('giftBtn'); if(gBtn)gBtn.style.display='none';
  playMagicSound();
  var m=document.getElementById('giftModal');m.style.display='flex';setTimeout(function(){m.classList.add('active');},10);
  updateSteps();
}
function closeLetter(){var m=document.getElementById('letterModal');m.classList.remove('active');setTimeout(function(){m.style.display='none';},400);}
function closeGift(){var m=document.getElementById('giftModal');m.classList.remove('active');setTimeout(function(){m.style.display='none';},400);}
function unwrapGift(){
  if(giftObj.userData.opened)return;giftObj.userData.opened=true;
  var w=document.getElementById('giftBoxWrap');w.classList.add('gift-opened');playChime();
  var wp=new THREE.Vector3();giftObj.getWorldPosition(wp);wp.y+=.5;triggerConfetti3D(wp);
  setTimeout(function(){w.style.display='none';document.getElementById('crystalContainer').style.display='flex';},700);
}
function activateCrystal(){
  if(crystalActivated)return;crystalActivated=true;playCrystalSweep();closeGift();
  setTimeout(function(){spawnFloatingHearts();spawnScreenSparkles();setHint('\u2728 The magic has been unleashed! \u2728');checkAllComplete();updateSteps();},500);
}
function checkAllComplete(){
  if(trunkOpened&&candlesBlown.every(function(b){return b;})&&cakeCut&&letterRead&&crystalActivated)setTimeout(showFinalOverlay,4000);
}
function showFinalOverlay(){var o=document.getElementById('finalOverlay');o.style.display='flex';setTimeout(function(){o.classList.add('active');},50);spawnFloatingHearts();}
function replayExperience(){
  var o=document.getElementById('finalOverlay');o.classList.remove('active');setTimeout(function(){o.style.display='none';},1500);
  trunkOpened=false;candlesBlown=[false,false,false];cakeCut=false;letterRead=false;crystalActivated=false;
  if(trunkLid){trunkLid.rotation.x=0;trunkLid.userData.opening=false;trunkLid.userData.openProgress=0;}
  if(trunkInterior)trunkInterior.visible=false;
  candleFlames.forEach(function(f){f.userData.alive=true;if(f.userData.isFlame)f.visible=true;else if(f.userData.isLight)f.intensity=.9;});
  if(cakeObj&&cakeObj.children[1])cakeObj.children[1].position.x=0;
  if(cakeObj&&cakeObj.children[4])cakeObj.children[4].position.x=0;
  if(letterObj)letterObj.userData.locked=true;
  if(giftObj){giftObj.userData.locked=true;giftObj.userData.opened=false;}
  document.getElementById('giftBoxWrap').style.display='block';
  document.getElementById('giftBoxWrap').classList.remove('gift-opened');
  document.getElementById('crystalContainer').style.display='none';
  var btnHud = document.getElementById('openTrunkHudBtn');
  if(btnHud) btnHud.style.display = 'block';
  ['blowBtn','cutBtn','letterBtn','giftBtn'].forEach(function(id){
    var el=document.getElementById(id); if(el)el.style.display='none';
  });

  // Re-add lid and button to clickable objects if they were removed
  var hasLid = clickableObjects.some(function(o){ return o.name === 'TRUNK_LID'; });
  if(!hasLid && trunkLid) {
    trunkLid.children.forEach(function(c) {
      if(c.name === 'TRUNK_LID' || c.name === 'TRUNK_BTN') clickableObjects.push(c);
    });
  }
  if(trunkInterior && clickableObjects.indexOf(trunkInterior) === -1) {
    clickableObjects.push(trunkInterior);
  }

  orbitState.targetPhi = 1.35;
  orbitState.targetRadius = 9.5;
  orbitState.targetY = 1.5;
  orbitState.targetZ = 0;

  setHint('\u{1F697} Click the glowing button on the car trunk!');updateSteps();
}

// ── 3D Particles ──
function triggerBurst3D(pos){
  var count=35,geo=new THREE.BufferGeometry(),p=new Float32Array(count*3),v=[];
  for(var i=0;i<count;i++){p[i*3]=pos.x;p[i*3+1]=pos.y;p[i*3+2]=pos.z;v.push(new THREE.Vector3((Math.random()-.5)*.22,Math.random()*.22+.06,(Math.random()-.5)*.22));}
  geo.setAttribute('position',new THREE.BufferAttribute(p,3));
  var pts=new THREE.Points(geo,new THREE.PointsMaterial({color:0xffd700,size:.09,transparent:true,opacity:1,depthWrite:false}));
  scene.add(pts);var life=0;
  function anim(){life+=.04;for(var i=0;i<count;i++){v[i].y-=.007;p[i*3]+=v[i].x;p[i*3+1]+=v[i].y;p[i*3+2]+=v[i].z;}geo.attributes.position.needsUpdate=true;pts.material.opacity=Math.max(0,1-life);if(life<1)requestAnimationFrame(anim);else scene.remove(pts);}
  requestAnimationFrame(anim);
}
function triggerConfetti3D(pos){
  var cols=[0xe8b86d,0xf4a5b4,0xa855f7,0x00d4ff,0x34d399];
  for(var i=0;i<45;i++){
    var m=new THREE.Mesh(new THREE.BoxGeometry(.055,.055,.01),M(cols[i%5],.4,.0));
    m.position.copy(pos);var v2=new THREE.Vector3((Math.random()-.5)*.55,Math.random()*.65+.2,(Math.random()-.5)*.55);
    var r=new THREE.Euler(Math.random()*6,Math.random()*6,Math.random()*6);scene.add(m);var life2=0;
    (function(mesh,vel,rot){
      function anim2(){life2+=.022;vel.y-=.01;mesh.position.add(vel);mesh.rotation.x+=rot.x*.04;mesh.rotation.y+=rot.y*.04;if(life2<1)requestAnimationFrame(anim2);else scene.remove(mesh);}
      requestAnimationFrame(anim2);
    })(m,v2,r);
  }
}

// ── DOM Effects ──
function spawnFloatingHearts(){var h=['\u{1F496}','\u{1F497}','\u{1F495}','\u{1F49C}','\u{1F90D}'];for(var i=0;i<35;i++)(function(idx){setTimeout(function(){var el=document.createElement('div');el.className='floating-heart';el.textContent=h[Math.floor(Math.random()*h.length)];el.style.cssText='left:'+(Math.random()*90+5)+'%;bottom:0px;font-size:'+(Math.random()*18+14)+'px;';var d=Math.random()*3+3;el.style.animationDuration=d+'s';document.body.appendChild(el);setTimeout(function(){el.remove();},d*1000);},idx*120);})(i);}
function spawnScreenSparkles(){for(var i=0;i<55;i++)(function(idx){setTimeout(function(){var s=document.createElement('div');s.textContent='\u2728';s.style.cssText='position:fixed;left:'+Math.random()*100+'%;top:'+Math.random()*100+'%;font-size:'+(Math.random()*16+10)+'px;pointer-events:none;z-index:9997;opacity:0;transition:all 1.5s ease;';document.body.appendChild(s);setTimeout(function(){s.style.opacity='1';s.style.transform='scale('+(Math.random()*.8+.6)+') rotate('+(Math.random()*180)+'deg)';},10);setTimeout(function(){s.style.opacity='0';},1200);setTimeout(function(){s.remove();},2500);},idx*60);})(i);}

// ── Audio FX ──
function playBlowSound(){if(!beepOn)return;try{var ctx=getCtx(),buf=ctx.createBuffer(1,Math.floor(ctx.sampleRate*.12),ctx.sampleRate),data=buf.getChannelData(0);for(var i=0;i<data.length;i++)data[i]=Math.random()*2-1;var src=ctx.createBufferSource();src.buffer=buf;var f=ctx.createBiquadFilter();f.type='bandpass';f.frequency.value=800;var g=ctx.createGain();g.gain.setValueAtTime(.2,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.12);src.connect(f);f.connect(g);g.connect(ctx.destination);src.start();}catch(e){}}
function playChime(){if(!beepOn)return;try{var ctx=getCtx(),now=ctx.currentTime;[523.25,659.25,783.99,1046.5,1318.51].forEach(function(f,i){var o=ctx.createOscillator(),g=ctx.createGain();o.type='triangle';o.frequency.value=f;g.gain.setValueAtTime(0,now+i*.08);g.gain.linearRampToValueAtTime(.12,now+i*.08+.02);g.gain.exponentialRampToValueAtTime(.001,now+i*.08+.35);o.connect(g);g.connect(ctx.destination);o.start(now+i*.08);o.stop(now+i*.08+.35);});}catch(e){}}
function playMagicSound(){if(!beepOn)return;try{var ctx=getCtx(),now=ctx.currentTime,o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(350,now);o.frequency.exponentialRampToValueAtTime(1100,now+.4);g.gain.setValueAtTime(.15,now);g.gain.exponentialRampToValueAtTime(.001,now+.4);o.connect(g);g.connect(ctx.destination);o.start(now);o.stop(now+.4);}catch(e){}}
function playCrystalSweep(){if(!beepOn)return;try{var ctx=getCtx(),now=ctx.currentTime;for(var i=0;i<8;i++){var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';var f=400+i*150;o.frequency.setValueAtTime(f,now+i*.12);o.frequency.exponentialRampToValueAtTime(f*1.5,now+i*.12+.3);g.gain.setValueAtTime(0,now+i*.12);g.gain.linearRampToValueAtTime(.08,now+i*.12+.05);g.gain.exponentialRampToValueAtTime(.001,now+i*.12+.4);o.connect(g);g.connect(ctx.destination);o.start(now+i*.12);o.stop(now+i*.12+.4);}}catch(e){}}
