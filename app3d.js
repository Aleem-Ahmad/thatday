// ══════════════════════════════════════════════════
// STAR BACKGROUND (2D Canvas)
// ══════════════════════════════════════════════════
(function(){
  const c=document.getElementById('starCanvas'),cx=c.getContext('2d');
  let W,H,stars=[];
  function resize(){W=c.width=window.innerWidth;H=c.height=window.innerHeight;stars=Array.from({length:200},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.5+.2,o:Math.random(),sp:Math.random()*.006+.002}));}
  function draw(){cx.clearRect(0,0,W,H);stars.forEach(s=>{s.o+=s.sp;if(s.o>1)s.o=0;cx.beginPath();cx.arc(s.x,s.y,s.r,0,Math.PI*2);cx.fillStyle='rgba(255,255,255,'+Math.abs(Math.sin(s.o*Math.PI))+')';cx.fill();});requestAnimationFrame(draw);}
  resize();window.addEventListener('resize',resize);draw();
})();

// ══════════════════════════════════════════════════
// FIREWORKS
// ══════════════════════════════════════════════════
const fwC=document.getElementById('fireworkCanvas'),fwX=fwC.getContext('2d');
let fwOn=false,parts=[];
(function(){fwC.width=window.innerWidth;fwC.height=window.innerHeight;})();
window.addEventListener('resize',()=>{fwC.width=window.innerWidth;fwC.height=window.innerHeight;});
class Pt{constructor(x,y,col){this.x=x;this.y=y;this.col=col;const a=Math.random()*Math.PI*2,s=Math.random()*6+2;this.vx=Math.cos(a)*s;this.vy=Math.sin(a)*s;this.al=1;this.dc=Math.random()*.015+.01;this.g=.12;this.sz=Math.random()*3+1;}upd(){this.x+=this.vx;this.y+=this.vy;this.vy+=this.g;this.vx*=.98;this.al-=this.dc;}drw(ctx){ctx.save();ctx.globalAlpha=this.al;ctx.fillStyle=this.col;ctx.shadowBlur=12;ctx.shadowColor=this.col;ctx.beginPath();ctx.arc(this.x,this.y,this.sz,0,Math.PI*2);ctx.fill();ctx.restore();}}
function fwLaunch(){const cols=['#e8b86d','#f4a5b4','#b76e79','#ffd1dc','#c19a6b','#ff9eb5'];const x=Math.random()*fwC.width,y=Math.random()*fwC.height*.6,col=cols[Math.floor(Math.random()*cols.length)];for(let i=0;i<90;i++)parts.push(new Pt(x,y,col));}
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
// LETTER TEXT
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
let trunkOpened=false,candlesBlown=[false,false,false,false],cakeCut=false,letterRead=false,crystalActivated=false;
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
  theta:0,phi:1.35,radius:9.5,y:1.5,z:0,
  targetTheta:0,targetPhi:1.35,targetRadius:9.5,targetY:1.5,targetZ:0,
  isDragging:false,autoRotate:false
};

function launch3DScene(){
  document.getElementById('threeCanvas').style.display='block';
  document.getElementById('gameHud').style.display='block';
  init3D();
  animate3D();
}

function M(color,rough,metal,opts){return new THREE.MeshStandardMaterial(Object.assign({color,roughness:rough,metalness:metal},opts||{}));}
function pos(obj,x,y,z){obj.position.set(x,y,z);return obj;}
function shd(obj,cast,recv){if(cast)obj.castShadow=true;if(recv)obj.receiveShadow=true;return obj;}

function init3D(){
  const canvas=document.getElementById('threeCanvas');
  clock=new THREE.Clock();
  scene=new THREE.Scene();
  scene.background=new THREE.Color(0x08010f);
  scene.fog=new THREE.FogExp2(0x0a0118,.028);
  camera=new THREE.PerspectiveCamera(50,window.innerWidth/window.innerHeight,.1,100);
  camera.position.set(0,3.5,11);
  camera.lookAt(0,1.5,0);
  renderer=new THREE.WebGLRenderer({canvas,antialias:true});
  renderer.setSize(window.innerWidth,window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.1;
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

function buildLighting(){
  scene.add(new THREE.AmbientLight(0x1a0830,1.0));
  const moon=new THREE.DirectionalLight(0x8899cc,.5);
  moon.position.set(-5,12,8);moon.castShadow=true;
  moon.shadow.mapSize.set(2048,2048);
  moon.shadow.camera.near=.1;moon.shadow.camera.far=50;
  moon.shadow.camera.left=-12;moon.shadow.camera.right=12;
  moon.shadow.camera.top=12;moon.shadow.camera.bottom=-12;
  scene.add(moon);
  scene.add(pos(new THREE.PointLight(0xf4a070,3.0,8),0,2,2.5));
  scene.add(pos(new THREE.PointLight(0x6600aa,1.0,4),0,-.1,0));
  scene.add(pos(new THREE.PointLight(0xff2200,3.5,6),-3.0,1.2,2.5));
  scene.add(pos(new THREE.PointLight(0xff2200,3.5,6),3.0,1.2,2.5));
}

function buildGround(){
  const road=new THREE.Mesh(new THREE.PlaneGeometry(40,40),M(0x080810,.95,.1));
  road.rotation.x=-Math.PI/2;road.position.y=-.05;road.receiveShadow=true;scene.add(road);
  const stripe=new THREE.Mesh(new THREE.PlaneGeometry(.14,9),M(0xffdd44,.4,.0,{emissive:0xffdd44,emissiveIntensity:.2}));
  stripe.rotation.x=-Math.PI/2;stripe.position.set(0,-.04,8);scene.add(stripe);
}

function createLicensePlate(){
  const cv=document.createElement('canvas');cv.width=512;cv.height=128;
  const ctx=cv.getContext('2d');
  ctx.fillStyle='#fdfdfd';ctx.fillRect(0,0,512,128);
  ctx.strokeStyle='#333';ctx.lineWidth=10;ctx.strokeRect(5,5,502,118);
  ctx.fillStyle='#222';ctx.font='bold 78px Montserrat,sans-serif';
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText('FATIMA',256,68);
  return new THREE.CanvasTexture(cv);
}

function buildCar(){
  carGroup=new THREE.Group();scene.add(carGroup);

  // WHITE PEARL PAINT (matches carBack.jfif)
  const white=M(0xe8e8ea,.18,.35);
  const chrome=M(0xd4d4d4,.05,1);
  const dark=M(0x0a0a0f,.9,.05);
  const glass=M(0x050810,.1,0,{transparent:true,opacity:.7});
  const black=M(0x020202,.95,.0);
  const rgold=M(0xb76e79,.15,.8);

  // ── LOWER BODY ──
  const mainBody=new THREE.Mesh(new THREE.BoxGeometry(6.8,1.4,3.6),white);
  mainBody.position.set(0,.9,-.35);mainBody.castShadow=true;carGroup.add(mainBody);

  const rfL=new THREE.Mesh(new THREE.BoxGeometry(.35,1.4,1.3),white);rfL.position.set(-3.225,.9,1.85);rfL.castShadow=true;carGroup.add(rfL);
  const rfR=new THREE.Mesh(new THREE.BoxGeometry(.35,1.4,1.3),white);rfR.position.set(3.225,.9,1.85);rfR.castShadow=true;carGroup.add(rfR);

  const tFloor=new THREE.Mesh(new THREE.BoxGeometry(6.1,.45,1.3),white);tFloor.position.set(0,.45,1.85);tFloor.castShadow=true;carGroup.add(tFloor);
  const rBumper=new THREE.Mesh(new THREE.BoxGeometry(7.0,.55,.45),white);rBumper.position.set(0,.45,2.35);rBumper.castShadow=true;carGroup.add(rBumper);
  const rWall=new THREE.Mesh(new THREE.BoxGeometry(6.1,1.1,.12),white);rWall.position.set(0,1.1,2.42);rWall.castShadow=true;carGroup.add(rWall);

  // ── UPPER CABIN ──
  const cabin=new THREE.Mesh(new THREE.BoxGeometry(5.9,1.2,2.1),white);cabin.position.set(-.15,2.1,-.5);cabin.castShadow=true;carGroup.add(cabin);

  // Rear windshield
  const rws=new THREE.Mesh(new THREE.BoxGeometry(4.4,1.0,.08),glass);
  rws.position.set(-.15,1.85,.88);rws.rotation.x=-.58;carGroup.add(rws);
  for(let i=0;i<5;i++){
    const d=new THREE.Mesh(new THREE.BoxGeometry(3.8,.01,.01),M(0xcc7700,.3,.2,{emissive:0xcc7700,emissiveIntensity:.15}));
    d.position.set(-.15,1.5+i*.14,1.08-i*.08);d.rotation.x=-.58;carGroup.add(d);
  }

  // ── TAILLIGHTS (wide, SUV-style) ──
  indicatorLMat=M(0xff8800,.2,.1,{emissive:0xff8800,emissiveIntensity:.1});
  indicatorRMat=M(0xff8800,.2,.1,{emissive:0xff8800,emissiveIntensity:.1});
  const brkMat=M(0xff0000,.2,.1,{emissive:0xff0000,emissiveIntensity:5});
  const tlbMat=M(0x1a0000,.3,.2);

  carGroup.add(pos(new THREE.Mesh(new THREE.BoxGeometry(1.8,.38,.14),tlbMat),-2.55,1.22,2.46));
  carGroup.add(pos(new THREE.Mesh(new THREE.BoxGeometry(1.5,.16,.11),brkMat),-2.55,1.28,2.49));
  carGroup.add(pos(new THREE.Mesh(new THREE.BoxGeometry(.55,.1,.1),indicatorLMat),-3.15,1.1,2.49));
  carGroup.add(pos(new THREE.Mesh(new THREE.BoxGeometry(1.8,.38,.14),tlbMat),2.55,1.22,2.46));
  carGroup.add(pos(new THREE.Mesh(new THREE.BoxGeometry(1.5,.16,.11),brkMat),2.55,1.28,2.49));
  carGroup.add(pos(new THREE.Mesh(new THREE.BoxGeometry(.55,.1,.1),indicatorRMat),3.15,1.1,2.49));
  carGroup.add(pos(new THREE.Mesh(new THREE.BoxGeometry(3.5,.07,.09),brkMat),0,1.28,2.49));

  // Diffuser
  carGroup.add(pos(new THREE.Mesh(new THREE.BoxGeometry(5.5,.28,.38),black),0,.18,2.3));

  // Exhaust
  const exG=new THREE.CylinderGeometry(.13,.16,.42,20),exMat=M(0x999999,.25,1);
  const ex1=new THREE.Mesh(exG,exMat);ex1.rotation.x=Math.PI/2;ex1.position.set(-1.9,.28,2.4);carGroup.add(ex1);
  const ex2=new THREE.Mesh(exG,exMat);ex2.rotation.x=Math.PI/2;ex2.position.set(1.9,.28,2.4);carGroup.add(ex2);

  // License plate
  const plateMat=M(0xffffff,.5,.1,{map:createLicensePlate()});
  carGroup.add(pos(new THREE.Mesh(new THREE.BoxGeometry(1.5,.38,.04),plateMat),0,.88,2.44));
  scene.add(pos(new THREE.PointLight(0xffffff,.8,1.8),0,.95,2.7));

  // Rose-gold chrome strips
  carGroup.add(pos(new THREE.Mesh(new THREE.BoxGeometry(6.85,.06,.06),rgold),0,.6,-.35));
  carGroup.add(pos(new THREE.Mesh(new THREE.BoxGeometry(6.85,.06,.06),rgold),0,1.62,-.35));

  // ── WHEELS ──
  const tireMat=M(0x111111,.96,.0),rimMat=M(0xc8b8a2,.1,.95);
  [[3.3,.82,1.8],[-3.3,.82,1.8],[3.3,.82,-1.8],[-3.3,.82,-1.8]].forEach(p=>{
    const tire=new THREE.Mesh(new THREE.CylinderGeometry(.82,.82,.56,32),tireMat);
    tire.rotation.z=Math.PI/2;tire.position.set(...p);tire.castShadow=true;carGroup.add(tire);
    const rim=new THREE.Mesh(new THREE.CylinderGeometry(.48,.48,.58,12),rimMat);
    rim.rotation.z=Math.PI/2;rim.position.set(...p);carGroup.add(rim);
    for(let s=0;s<5;s++){
      const sp=new THREE.Mesh(new THREE.BoxGeometry(.58,.06,.06),rimMat);
      sp.rotation.set(0,s*(Math.PI*2/5),Math.PI/2);sp.position.set(...p);carGroup.add(sp);
    }
    const sd=new THREE.Mesh(new THREE.CircleGeometry(.83,20),M(0x000000,.9,.0,{transparent:true,opacity:.45}));
    sd.rotation.x=-Math.PI/2;sd.position.set(p[0],.02,p[2]);scene.add(sd);
  });

  // ── TRUNK LID ──
  const lidGroup=new THREE.Group();
  lidGroup.position.set(0,1.58,1.22);
  const lidPanel=new THREE.Mesh(new THREE.BoxGeometry(6.55,.1,1.25),white);lidPanel.position.set(0,0,.62);lidPanel.castShadow=true;lidGroup.add(lidPanel);
  const lidEdge=new THREE.Mesh(new THREE.BoxGeometry(6.55,.07,.22),white);lidEdge.position.set(0,.05,1.16);lidGroup.add(lidEdge);
  lidGroup.add(pos(new THREE.Mesh(new THREE.BoxGeometry(6.6,.04,.04),rgold),0,.04,1.22));
  const emb=new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,.05,24),chrome);emb.position.set(0,.05,.62);emb.rotation.x=Math.PI/2;lidGroup.add(emb);

  const cz=new THREE.Mesh(new THREE.BoxGeometry(6.6,.55,1.3),new THREE.MeshBasicMaterial({transparent:true,opacity:0}));
  cz.position.set(0,0,.62);cz.name='TRUNK_LID';lidGroup.add(cz);clickableObjects.push(cz);
  carGroup.add(lidGroup);
  trunkLid=lidGroup;

  // ── TRUNK INTERIOR ──
  trunkInterior=new THREE.Group();
  trunkInterior.visible=false;
  trunkInterior.position.set(0,.68,1.22);
  carGroup.add(trunkInterior);
  buildTrunkContents();
}

// ══════════════════════════════════════════════════
// TRUNK CONTENTS — matches brdy.png
// ══════════════════════════════════════════════════
function buildTrunkContents(){
  // Interior walls
  const linerM=M(0x5c2e1a,.95,.05);
  const flrM=M(0x1a0c05,.9,.05);
  trunkInterior.add(pos(new THREE.Mesh(new THREE.BoxGeometry(6.1,.05,1.2),flrM),0,.025,.6));
  trunkInterior.add(pos(new THREE.Mesh(new THREE.BoxGeometry(6.1,.95,.06),linerM),0,.5,.025));
  trunkInterior.add(pos(new THREE.Mesh(new THREE.BoxGeometry(6.1,.95,.06),linerM),0,.5,1.195));
  trunkInterior.add(pos(new THREE.Mesh(new THREE.BoxGeometry(.06,.95,1.2),linerM),-3.025,.5,.6));
  trunkInterior.add(pos(new THREE.Mesh(new THREE.BoxGeometry(.06,.95,1.2),linerM),3.025,.5,.6));

  // Rose-gold tinsel curtain
  const tinselM=M(0xb87333,.3,.9,{emissive:0xb87333,emissiveIntensity:.5});
  for(let t=0;t<22;t++){
    const strip=new THREE.Mesh(new THREE.BoxGeometry(.055,.9,.02),tinselM);
    strip.position.set(-2.75+t*.26,.5,.04);
    strip.userData={fp:Math.random()*Math.PI*2,fs:2+Math.random()};
    trunkInterior.add(strip);
  }
  trunkInterior.add(pos(new THREE.PointLight(0xffa060,2.5,2.5),0,.9,.08));

  // Fairy lights along top
  const flCols=[0xffd700,0xffb6c1,0xffa07a,0xffd1dc];
  for(let i=0;i<26;i++){
    const col=flCols[i%4];
    const bm=M(col,.2,.1,{emissive:col,emissiveIntensity:4});
    const b=new THREE.Mesh(new THREE.SphereGeometry(.044,8,8),bm);
    b.position.set(-2.9+i*.23,.88,.04+Math.sin(i*.5)*.025);trunkInterior.add(b);
    if(i%4===0){const pl=new THREE.PointLight(col,.8,1.2);pl.position.copy(b.position);trunkInterior.add(pl);}
  }

  // "HAPPY BIRTHDAY" banner — triangular pennants
  const bannerM=M(0xf4a5b4,.6,.0,{emissive:0xf4a5b4,emissiveIntensity:.25});
  const bannerM2=M(0xb76e79,.5,.0,{emissive:0xb76e79,emissiveIntensity:.15});
  for(let i=0;i<13;i++){
    const flag=new THREE.Mesh(new THREE.BoxGeometry(.2,.28,.02),(i%2===0)?bannerM:bannerM2);
    flag.position.set(-2.05+i*.34,.68,.05);
    trunkInterior.add(flag);
  }
  // Banner string
  const bstring=new THREE.Mesh(new THREE.CylinderGeometry(.006,.006,5.8,4),M(0xd4af37,.5,.3));
  bstring.rotation.z=Math.PI/2;bstring.position.set(0,.84,.05);trunkInterior.add(bstring);
  trunkInterior.add(pos(new THREE.PointLight(0xffb6c1,1.5,2.5),0,.7,.12));

  // "Fatima" neon sign
  const neonM=M(0xffa0c8,.2,.1,{emissive:0xff6eb4,emissiveIntensity:5.5});
  // Series of segments forming the neon sign shape
  for(let n=0;n<14;n++){
    const seg=new THREE.Mesh(new THREE.BoxGeometry(.16,.055,.025),neonM);
    seg.position.set(-1.1+n*.165,.54,.055);
    trunkInterior.add(seg);
  }
  // Heart glow
  const heartM=M(0xff1493,.2,.1,{emissive:0xff1493,emissiveIntensity:7});
  const hL=new THREE.Mesh(new THREE.SphereGeometry(.06,8,8),heartM);hL.position.set(1.2,.57,.055);trunkInterior.add(hL);
  const hR=hL.clone();hR.position.x=1.32;trunkInterior.add(hR);
  trunkInterior.add(pos(new THREE.PointLight(0xff6eb4,3.0,2.2),0,.52,.1));

  // "24" BALLOON (left, rose gold)
  const rgM=M(0xb76e79,.12,.6,{emissive:0xb76e79,emissiveIntensity:.2,transparent:true,opacity:.96});
  const num24=new THREE.Group();
  // "2" balloon
  const n2top=new THREE.Mesh(new THREE.TorusGeometry(.13,.05,8,12,Math.PI),rgM);n2top.position.set(-2.32,.9,.45);n2top.rotation.z=Math.PI;num24.add(n2top);
  for(let s=0;s<3;s++){const seg=new THREE.Mesh(new THREE.BoxGeometry(.12,.055,.04),rgM);seg.position.set(-2.28+s*.04,.72+s*.07,.45);num24.add(seg);}
  // "4" balloon
  const n4v=new THREE.Mesh(new THREE.BoxGeometry(.055,.34,.04),rgM);n4v.position.set(-2.0,.75,.45);num24.add(n4v);
  const n4h=new THREE.Mesh(new THREE.BoxGeometry(.22,.055,.04),rgM);n4h.position.set(-1.93,.78,.45);num24.add(n4h);
  num24.userData={fp:0.2,fs:1.1};trunkInterior.add(num24);
  trunkInterior.add(pos(new THREE.PointLight(0xb76e79,1.5,1.5),-2.15,.8,.5));

  // BALLOON CLUSTER (rose gold, gold, pink, transparent)
  const balloonData=[
    {x:-.65,y:.58,z:.55,col:0xb76e79},{x:.0,y:.63,z:.5,col:0xd4af37},
    {x:.65,y:.56,z:.58,col:0xf4a5b4},{x:-.3,y:.48,z:.42,col:0xb76e79},
    {x:.32,y:.5,z:.44,col:0xffd700},{x:1.05,y:.55,z:.55,col:0xf4a5b4},
    {x:-1.05,y:.47,z:.5,col:0xd4af37},{x:.0,y:.42,z:.36,col:0xb76e79},
    {x:.78,y:.44,z:.4,col:0xffd700},{x:-.78,y:.46,z:.43,col:0xf4a5b4},
  ];
  balloonData.forEach((bd,i)=>{
    const bm=M(bd.col,.3,.35,{transparent:true,opacity:.93});
    const bl=new THREE.Mesh(new THREE.SphereGeometry(.22+Math.random()*.04,16,16),bm);
    bl.position.set(bd.x,bd.y,bd.z);
    bl.userData={fp:Math.random()*Math.PI*2,fs:1+Math.random()*.8};
    trunkInterior.add(bl);
    const bstr=new THREE.Mesh(new THREE.CylinderGeometry(.006,.006,.18,4),M(0xffffff,.5,.0));
    bstr.position.set(bd.x,bd.y-.22,bd.z);trunkInterior.add(bstr);
    if(i%3===0){const bpl=new THREE.PointLight(bd.col,.5,1);bpl.position.set(bd.x,bd.y,bd.z);trunkInterior.add(bpl);}
  });

  // BIRTHDAY CAKE (center)
  candleFlames=[];
  cakeObj=buildCakeMesh();
  cakeObj.scale.set(1.15,1.15,1.15);
  cakeObj.position.set(0,.05,.72);cakeObj.name='CAKE';trunkInterior.add(cakeObj);

  // LETTER / LIGHTBOX (left)
  letterObj=new THREE.Group();
  const lbMat=M(0xf5f5f5,.5,.1,{emissive:0xffffff,emissiveIntensity:.35});
  const lbBody=new THREE.Mesh(new THREE.BoxGeometry(.9,.65,.06),lbMat);lbBody.position.set(0,.33,0);letterObj.add(lbBody);
  letterObj.add(pos(new THREE.Mesh(new THREE.BoxGeometry(.88,.045,.06),M(0xcccccc,.5,.1)),0,.66,0));
  letterObj.add(pos(new THREE.Mesh(new THREE.BoxGeometry(.88,.045,.06),M(0xcccccc,.5,.1)),0,.01,0));
  const textM=M(0x222222,.8,.0);
  for(let row=0;row<4;row++){
    const tl=new THREE.Mesh(new THREE.BoxGeometry(.6,.04,.01),textM);tl.position.set(0,.54-row*.12,.032);letterObj.add(tl);
  }
  letterObj.add(pos(new THREE.PointLight(0xffffff,1.8,1.2),0,.35,.15));
  letterObj.position.set(-1.85,.05,.68);letterObj.rotation.y=.28;letterObj.name='LETTER';
  const lhb=new THREE.Mesh(new THREE.BoxGeometry(1.1,.85,.55),new THREE.MeshBasicMaterial({transparent:true,opacity:0}));
  lhb.position.set(0,.33,0);lhb.name='LETTER';letterObj.add(lhb);clickableObjects.push(lhb);
  trunkInterior.add(letterObj);

  // FLOWER BOUQUET (right)
  const bouquet=new THREE.Group();
  const stemMat=M(0x2d6a2d,.7,.0);
  const wrap=new THREE.Mesh(new THREE.ConeGeometry(.28,.55,16,1,true),M(0xffc0cb,.6,.0,{transparent:true,opacity:.9,side:THREE.DoubleSide}));
  wrap.position.set(0,.28,0);bouquet.add(wrap);
  const roseCols=[0xe91e8c,0xff9eb5,0xdc143c,0xff69b4,0xffb6c1];
  for(let r=0;r<9;r++){
    const rm=M(roseCols[r%5],.4,.0,{emissive:roseCols[r%5],emissiveIntensity:.12});
    const rose=new THREE.Mesh(new THREE.SphereGeometry(.1+r*.008,10,10),rm);
    rose.position.set(Math.cos(r*0.9)*.16,.6+Math.sin(r*.5)*.04,Math.sin(r*0.9)*.16);
    bouquet.add(rose);
  }
  for(let g=0;g<5;g++){
    const leaf=new THREE.Mesh(new THREE.SphereGeometry(.072,8,8),stemMat);
    leaf.scale.set(1,.28,1.5);leaf.position.set(Math.cos(g*1.3)*.21,.56,Math.sin(g*1.3)*.21);bouquet.add(leaf);
  }
  bouquet.add(pos(new THREE.PointLight(0xff9eb5,1.8,1.5),0,.62,0));
  bouquet.position.set(2.25,.05,.68);bouquet.rotation.y=-.38;bouquet.userData={fp:1.2,fs:.8};
  trunkInterior.add(bouquet);

  // GIFT BOX (right front, coral with pink bow)
  giftObj=buildGiftMesh();
  giftObj.scale.set(1.1,1.1,1.1);
  giftObj.position.set(1.78,.05,.4);giftObj.rotation.y=-.22;giftObj.name='GIFT';giftObj.userData.opened=false;
  trunkInterior.add(giftObj);

  // Tea candles on floor
  const tcFlame=M(0xffa060,.3,.0,{emissive:0xff6600,emissiveIntensity:3.5});
  [[-1.15,.04,.88],[-.42,.04,.92],[.42,.04,.88],[1.15,.04,.9]].forEach((cp,i)=>{
    const tc=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,.04,12),M(0xe8e0d0,.6,.0));
    tc.position.set(cp[0],cp[1],cp[2]);trunkInterior.add(tc);
    const fl=new THREE.Mesh(new THREE.SphereGeometry(.03,8,8),tcFlame);
    fl.position.set(cp[0],cp[1]+.05,cp[2]);
    fl.userData={baseY:cp[1]+.05,phase:i*.9,alive:true,isFlame:true,candleIndex:i};
    trunkInterior.add(fl);candleFlames.push(fl);
    const fpl=new THREE.PointLight(0xff6600,.8,.85);
    fpl.position.set(cp[0],cp[1]+.06,cp[2]);
    fpl.userData={baseY:cp[1]+.06,phase:i*.9,alive:true,isLight:true,candleIndex:i};
    trunkInterior.add(fpl);candleFlames.push(fpl);
    const chb=new THREE.Mesh(new THREE.BoxGeometry(.32,.4,.32),new THREE.MeshBasicMaterial({transparent:true,opacity:0}));
    chb.position.set(cp[0],cp[1]+.1,cp[2]);chb.name='CANDLE_'+(i+1);trunkInterior.add(chb);clickableObjects.push(chb);
  });
}

function buildCakeMesh(){
  const cg=new THREE.Group();
  cg.add(pos(new THREE.Mesh(new THREE.CylinderGeometry(.42,.42,.06,22),M(0xc8c8c8,.3,.9)),0,.03,0));
  cg.add(pos(new THREE.Mesh(new THREE.CylinderGeometry(.38,.40,.3,22),M(0xfef3e2,.7,.0)),0,.21,0));
  const c1=pos(new THREE.Mesh(new THREE.TorusGeometry(.38,.04,8,22),M(0xfbbf24,.5,.1,{emissive:0xf59e0b,emissiveIntensity:.2})),0,.38,0);c1.rotation.x=Math.PI/2;cg.add(c1);
  cg.add(pos(new THREE.Mesh(new THREE.CylinderGeometry(.28,.30,.25,22),M(0xfda4af,.5,.0)),0,.53,0));
  const c2=pos(new THREE.Mesh(new THREE.TorusGeometry(.28,.034,8,22),M(0xff6b8b,.4,.1,{emissive:0xff6b8b,emissiveIntensity:.3})),0,.66,0);c2.rotation.x=Math.PI/2;cg.add(c2);
  const rgMat=M(0xb76e79,.2,.8,{emissive:0xb76e79,emissiveIntensity:.4});
  cg.add(pos(new THREE.Mesh(new THREE.BoxGeometry(.08,.22,.04),rgMat),-.12,.78,0));
  cg.add(pos(new THREE.Mesh(new THREE.BoxGeometry(.08,.22,.04),rgMat),.12,.78,0));
  cg.add(pos(new THREE.PointLight(0xb76e79,1.2,.8),0,.8,.1));

  // Cake candles (3)
  const ccols=[0xf472b6,0x67e8f9,0x86efac];
  for(let ci=0;ci<3;ci++){
    const angle=((ci-1)/3)*Math.PI*.9;
    const cx2=Math.cos(angle)*.15,cz2=Math.sin(angle)*.15;
    const candle=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,.2,10),M(ccols[ci],.7,.0));
    candle.position.set(cx2,.79,cz2);candle.name='CANDLE_'+(ci+5);cg.add(candle);
    const chb=new THREE.Mesh(new THREE.BoxGeometry(.45,1.1,.45),new THREE.MeshBasicMaterial({transparent:true,opacity:0}));
    chb.position.set(cx2,.9,cz2);chb.name='CANDLE_'+(ci+5);cg.add(chb);
    const fm=M(0xfbbf24,.3,.0,{emissive:0xff8800,emissiveIntensity:4.5,transparent:true,opacity:.92});
    const flame=new THREE.Mesh(new THREE.SphereGeometry(.038,8,8),fm);
    flame.position.set(cx2,.92,cz2);flame.name='CANDLE_'+(ci+5);
    flame.userData={baseY:.92,phase:ci*.8,alive:true,candleIndex:ci+4,isFlame:true};cg.add(flame);
    const fpl=new THREE.PointLight(0xff8800,.85,.75);
    fpl.position.set(cx2,.93,cz2);
    fpl.userData={baseY:.93,phase:ci*.8,alive:true,candleIndex:ci+4,isLight:true};cg.add(fpl);
    candleFlames.push(flame,fpl);
  }

  const ccs=new THREE.Mesh(new THREE.BoxGeometry(.88,.72,.88),new THREE.MeshBasicMaterial({transparent:true,opacity:0}));
  ccs.position.y=.35;ccs.name='CAKE';cg.add(ccs);clickableObjects.push(ccs);
  return cg;
}

function buildGiftMesh(){
  const gg=new THREE.Group();
  gg.add(pos(new THREE.Mesh(new THREE.BoxGeometry(.72,.72,.72),M(0xff6b6b,.4,.1)),0,.36,0));
  gg.add(pos(new THREE.Mesh(new THREE.BoxGeometry(.74,.14,.74),M(0xff8fa3,.35,.15)),0,.75,0));
  const rm=M(0xffd700,.3,.4,{emissive:0xffd700,emissiveIntensity:.4});
  gg.add(pos(new THREE.Mesh(new THREE.BoxGeometry(.74,.72,.06),rm),0,.36,0));
  gg.add(pos(new THREE.Mesh(new THREE.BoxGeometry(.06,.72,.74),rm),0,.36,0));
  const bm=M(0xff9eb5,.4,.1,{emissive:0xff9eb5,emissiveIntensity:.2});
  const b1=new THREE.Mesh(new THREE.TorusGeometry(.11,.035,8,12,Math.PI),bm);b1.position.set(-.1,.88,0);b1.rotation.z=.55;gg.add(b1);
  const b2=b1.clone();b2.position.x=.1;b2.rotation.z=-.55;gg.add(b2);
  gg.add(pos(new THREE.PointLight(0xff9eb5,1.8,1.2),0,.5,0));
  const ghb=new THREE.Mesh(new THREE.BoxGeometry(.85,1.1,.85),new THREE.MeshBasicMaterial({transparent:true,opacity:0}));
  ghb.position.y=.45;ghb.name='GIFT';gg.add(ghb);clickableObjects.push(ghb);
  return gg;
}

function buildExhaustSmoke(){
  for(let pipe=0;pipe<2;pipe++){
    const count=60,positions=new Float32Array(count*3),vel=[],ages=[];
    for(let i=0;i<count;i++){positions[i*3]=positions[i*3+1]=positions[i*3+2]=0;vel.push({x:(Math.random()-.5)*.01,y:Math.random()*.02+.005,z:Math.random()*.035+.008});ages.push(Math.random());}
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(positions,3));
    const pts=new THREE.Points(geo,new THREE.PointsMaterial({color:0xaabbcc,size:.1,transparent:true,opacity:.14,depthWrite:false}));
    pts.position.set(-1.9+pipe*.4,.25,2.85);pts.userData={p:positions,v:vel,a:ages,c:count};
    scene.add(pts);exhaustSystems.push(pts);
  }
}

function animate3D(){
  if(!threeRunning)return;
  requestAnimationFrame(animate3D);
  const dt=clock.getDelta(),elapsed=clock.getElapsedTime();
  const os=orbitState;
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

  const flash=Math.sin(elapsed*Math.PI/.35)>0;
  if(indicatorLMat)indicatorLMat.emissiveIntensity=flash?6:.1;
  if(indicatorRMat)indicatorRMat.emissiveIntensity=flash?6:.1;

  candleFlames.forEach(f=>{
    if(!f.userData.alive)return;
    const p=f.userData.phase,fl=Math.sin(elapsed*12+p)*.008+Math.sin(elapsed*19+p)*.004;
    if(f.userData.isFlame){f.position.y=f.userData.baseY+fl;if(f.material)f.material.emissiveIntensity=3.8+Math.sin(elapsed*15+p)*1.5;}
    else if(f.userData.isLight){f.position.y=f.userData.baseY+fl;f.intensity=.82+Math.sin(elapsed*14+p)*.3;}
  });

  if(trunkLid&&trunkLid.userData.opening){
    trunkLid.userData.openProgress=Math.min(1,(trunkLid.userData.openProgress||0)+dt*.65);
    trunkLid.rotation.x=-trunkLid.userData.openProgress*1.95;
    if(trunkLid.userData.openProgress>=1){
      trunkLid.userData.opening=false;
      trunkInterior.visible=true;
      setHint('\uD83D\uDCA8 Tap \u201CBlow Candles\u201D \u2014 then read the letter and open the gift!');
      updateSteps();playChime();
    }
  }

  if(trunkInterior.visible){
    trunkInterior.children.forEach(ch=>{
      if(ch.userData.fp!==undefined)ch.position.y+=Math.sin(elapsed*(ch.userData.fs||1.5)+ch.userData.fp)*.0004;
    });
  }

  exhaustSystems.forEach(sys=>{
    const d=sys.userData;
    for(let i=0;i<d.c;i++){
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
  const rect=renderer.domElement.getBoundingClientRect();
  const cx=e.touches?e.changedTouches[0].clientX:e.clientX;
  const cy=e.touches?e.changedTouches[0].clientY:e.clientY;
  mouse.x=((cx-rect.left)/rect.width)*2-1;
  mouse.y=-((cy-rect.top)/rect.height)*2+1;
}
function onCanvasTouch(e){getMouseNDC(e);doRaycast();}
function onCanvasClick(e){getMouseNDC(e);doRaycast();}
function doRaycast(){
  raycaster.setFromCamera(mouse,camera);
  const hits=raycaster.intersectObjects(clickableObjects,true);
  if(!hits.length)return;
  let obj=hits[0].object;
  while(obj&&!obj.name)obj=obj.parent;
  if(!obj)return;
  const n=obj.name;
  if(n==='TRUNK_LID'||n==='TRUNK_BTN')handleTrunkClick();
  else if(n.startsWith('CANDLE_'))handleCandleClick(parseInt(n.split('_')[1]));
  else if(n==='CAKE')handleCakeClick();
  else if(n==='LETTER')handleLetterClick();
  else if(n==='GIFT')handleGiftClick();
}

// ══════════════════════════════════════════════════
// INTERACTIONS
// ══════════════════════════════════════════════════
function handleTrunkClick(){
  if(trunkOpened)return;trunkOpened=true;
  orbitState.autoRotate=false;
  const btnHud=document.getElementById('openTrunkHudBtn');
  if(btnHud)btnHud.style.display='none';

  // Build reliable UI action buttons
  const gameHud=document.getElementById('gameHud');
  if(gameHud&&!document.getElementById('blowBtn')){
    const btnCont=document.createElement('div');
    Object.assign(btnCont.style,{position:'absolute',bottom:'90px',width:'100%',
      textAlign:'center',zIndex:'100',pointerEvents:'none'});

    const mkBtn=(id,txt,handler,bg)=>{
      const b=document.createElement('button');
      b.id=id;b.innerHTML=txt;b.style.display='none';
      Object.assign(b.style,{
        padding:'15px 32px',margin:'4px',borderRadius:'30px',background:bg,
        color:'#fff',fontWeight:'800',fontSize:'1rem',border:'none',cursor:'pointer',
        pointerEvents:'auto',boxShadow:'0 8px 25px rgba(0,0,0,0.4)',
        fontFamily:'Montserrat,sans-serif',letterSpacing:'.04em',
        textShadow:'0 1px 3px rgba(0,0,0,.4)',transition:'transform .2s'
      });
      b.onmouseenter=()=>b.style.transform='scale(1.06)';
      b.onmouseleave=()=>b.style.transform='scale(1)';
      b.onclick=handler;return b;
    };

    const blowBtn=mkBtn('blowBtn','\uD83D\uDCA8 Blow Candles',()=>{
      for(let i=1;i<=7;i++)handleCandleClick(i);
    },'linear-gradient(135deg,#f4a5b4,#b76e79)');

    const cutBtn=mkBtn('cutBtn','\uD83C\uDF70 Cut Cake',handleCakeClick,
      'linear-gradient(135deg,#fbbf24,#f59e0b)');

    const letterBtn=mkBtn('letterBtn','\uD83D\uDCE8 Read Letter',handleLetterClick,
      'linear-gradient(135deg,#c4b5fd,#7c3aed)');

    const giftBtn=mkBtn('giftBtn','\uD83C\uDF81 Open Gift',handleGiftClick,
      'linear-gradient(135deg,#fb7185,#e11d48)');

    btnCont.append(blowBtn,cutBtn,letterBtn,giftBtn);
    gameHud.appendChild(btnCont);
  }

  const bBtn=document.getElementById('blowBtn');
  if(bBtn)bBtn.style.display='inline-block';

  trunkLid.userData.opening=true;trunkLid.userData.openProgress=0;
  triggerBurst3D(new THREE.Vector3(0,2.5,2));

  clickableObjects=clickableObjects.filter(o=>o.name!=='TRUNK_LID'&&o.name!=='TRUNK_BTN');

  orbitState.targetPhi=0.52;
  orbitState.targetRadius=4.8;
  orbitState.targetY=0.65;
  orbitState.targetZ=1.85;

  // AUTO-PILOT: blow candles after 8s
  setTimeout(()=>{for(let i=1;i<=7;i++)handleCandleClick(i);},8000);
}

function handleCandleClick(num){
  if(!trunkOpened)return;
  const idx=num-1;
  while(candlesBlown.length<=idx)candlesBlown.push(false);
  if(candlesBlown[idx])return;
  candlesBlown[idx]=true;
  candleFlames.forEach(f=>{
    if(f.userData.candleIndex===idx){
      f.userData.alive=false;
      if(f.userData.isFlame)f.visible=false;
      else if(f.userData.isLight)f.intensity=0;
    }
  });
  playBlowSound();
  if(cakeObj){const wp=new THREE.Vector3();cakeObj.getWorldPosition(wp);wp.y+=.8;triggerBurst3D(wp);}
  // Check all 7 candles (4 tea + 3 cake)
  const totalCandles=7;
  const allBlown=candlesBlown.slice(0,totalCandles).every(b=>b);
  if(allBlown){
    setHint('\uD83C\uDF82 Candles blown! Tap \u201CCut Cake\u201D!');updateSteps();
    const bBtn=document.getElementById('blowBtn'),cBtn=document.getElementById('cutBtn');
    if(bBtn)bBtn.style.display='none';if(cBtn)cBtn.style.display='inline-block';
    setTimeout(()=>{if(!cakeCut)handleCakeClick();},7000);
  }
}

function handleCakeClick(){
  if(!trunkOpened){setHint('\u26A0\uFE0F Open the trunk first!');return;}
  if(cakeCut)return;cakeCut=true;
  cutCakeAnim();playChime();
  if(cakeObj){const wp=new THREE.Vector3();cakeObj.getWorldPosition(wp);wp.y+=.5;triggerConfetti3D(wp);}
  setHint('\uD83C\uDF82 Now read the letter \uD83D\uDCE8 or open the gift \uD83C\uDF81!');updateSteps();
  const cBtn=document.getElementById('cutBtn'),lBtn=document.getElementById('letterBtn'),gBtn=document.getElementById('giftBtn');
  if(cBtn)cBtn.style.display='none';
  if(lBtn)lBtn.style.display='inline-block';
  if(gBtn)gBtn.style.display='inline-block';
  setTimeout(()=>{if(!letterRead)handleLetterClick();},10000);
  setTimeout(()=>{if(giftObj&&!giftObj.userData.opened)handleGiftClick();},22000);
}

function cutCakeAnim(){
  const start=clock.getElapsedTime();
  function step(){const p=Math.min(1,(clock.getElapsedTime()-start)/.9);if(cakeObj.children[1])cakeObj.children[1].position.x=-p*.35;if(cakeObj.children[3])cakeObj.children[3].position.x=p*.35;if(p<1)requestAnimationFrame(step);}
  requestAnimationFrame(step);
}

// LETTER — opens immediately, no locks
function handleLetterClick(){
  if(!trunkOpened){setHint('\u26A0\uFE0F Open the trunk first!');return;}
  if(letterRead)return;
  letterRead=true;
  const lBtn=document.getElementById('letterBtn');if(lBtn)lBtn.style.display='none';
  playMagicSound();
  const m=document.getElementById('letterModal');
  m.style.display='flex';
  setTimeout(()=>m.classList.add('active'),10);
  checkAllComplete();updateSteps();
  setHint('\uD83D\uDCE8 A letter from the heart...');
}

// GIFT — opens immediately, no locks
function handleGiftClick(){
  if(!trunkOpened){setHint('\u26A0\uFE0F Open the trunk first!');return;}
  if(giftObj&&giftObj.userData.opened)return;
  if(giftObj)giftObj.userData.opened=true;
  const gBtn=document.getElementById('giftBtn');if(gBtn)gBtn.style.display='none';
  playMagicSound();
  const m=document.getElementById('giftModal');
  m.style.display='flex';
  setTimeout(()=>m.classList.add('active'),10);
  updateSteps();
  setHint('\uD83C\uDF81 Opening your gift...');
}

function closeLetter(){const m=document.getElementById('letterModal');m.classList.remove('active');setTimeout(()=>m.style.display='none',400);}
function closeGift(){const m=document.getElementById('giftModal');m.classList.remove('active');setTimeout(()=>m.style.display='none',400);}
function unwrapGift(){
  const w=document.getElementById('giftBoxWrap');w.classList.add('gift-opened');playChime();
  if(giftObj){const wp=new THREE.Vector3();giftObj.getWorldPosition(wp);wp.y+=.5;triggerConfetti3D(wp);}
  setTimeout(()=>{w.style.display='none';document.getElementById('crystalContainer').style.display='flex';},700);
}
function activateCrystal(){
  if(crystalActivated)return;crystalActivated=true;playCrystalSweep();closeGift();
  setTimeout(()=>{spawnFloatingHearts();spawnScreenSparkles();setHint('\u2728 The magic has been unleashed! \u2728');checkAllComplete();updateSteps();},500);
}
function checkAllComplete(){
  if(trunkOpened&&candlesBlown.every(b=>b)&&cakeCut&&letterRead&&crystalActivated)setTimeout(showFinalOverlay,4000);
}
function showFinalOverlay(){const o=document.getElementById('finalOverlay');o.style.display='flex';setTimeout(()=>o.classList.add('active'),50);spawnFloatingHearts();}

function replayExperience(){
  const o=document.getElementById('finalOverlay');o.classList.remove('active');setTimeout(()=>o.style.display='none',1500);
  trunkOpened=false;candlesBlown=new Array(7).fill(false);cakeCut=false;letterRead=false;crystalActivated=false;
  if(trunkLid){trunkLid.rotation.x=0;trunkLid.userData.opening=false;trunkLid.userData.openProgress=0;}
  if(trunkInterior)trunkInterior.visible=false;
  candleFlames.forEach(f=>{f.userData.alive=true;if(f.userData.isFlame)f.visible=true;else if(f.userData.isLight)f.intensity=.82;});
  if(cakeObj&&cakeObj.children[1])cakeObj.children[1].position.x=0;
  if(cakeObj&&cakeObj.children[3])cakeObj.children[3].position.x=0;
  if(giftObj)giftObj.userData.opened=false;
  document.getElementById('giftBoxWrap').style.display='block';
  document.getElementById('giftBoxWrap').classList.remove('gift-opened');
  document.getElementById('crystalContainer').style.display='none';
  const btnHud=document.getElementById('openTrunkHudBtn');if(btnHud)btnHud.style.display='block';
  ['blowBtn','cutBtn','letterBtn','giftBtn'].forEach(id=>{const el=document.getElementById(id);if(el)el.style.display='none';});
  if(trunkLid){trunkLid.children.forEach(c=>{if(c.name==='TRUNK_LID')clickableObjects.push(c);});}
  orbitState.targetPhi=1.35;orbitState.targetRadius=9.5;orbitState.targetY=1.5;orbitState.targetZ=0;
  setHint('\uD83D\uDE97 Tap the button below to open the Birthday Surprise!');updateSteps();
}

// ── 3D Particles ──
function triggerBurst3D(p){
  const count=30,geo=new THREE.BufferGeometry(),p3=new Float32Array(count*3),v=[];
  for(let i=0;i<count;i++){p3[i*3]=p.x;p3[i*3+1]=p.y;p3[i*3+2]=p.z;v.push(new THREE.Vector3((Math.random()-.5)*.2,Math.random()*.2+.06,(Math.random()-.5)*.2));}
  geo.setAttribute('position',new THREE.BufferAttribute(p3,3));
  const pts=new THREE.Points(geo,new THREE.PointsMaterial({color:0xffd700,size:.09,transparent:true,opacity:1,depthWrite:false}));
  scene.add(pts);let life=0;
  function anim(){life+=.04;for(let i=0;i<count;i++){v[i].y-=.007;p3[i*3]+=v[i].x;p3[i*3+1]+=v[i].y;p3[i*3+2]+=v[i].z;}geo.attributes.position.needsUpdate=true;pts.material.opacity=Math.max(0,1-life);if(life<1)requestAnimationFrame(anim);else scene.remove(pts);}
  requestAnimationFrame(anim);
}
function triggerConfetti3D(p){
  const cols=[0xb76e79,0xf4a5b4,0xffd700,0xff9eb5,0xd4af37];
  for(let i=0;i<40;i++){
    const m=new THREE.Mesh(new THREE.BoxGeometry(.055,.055,.01),M(cols[i%5],.4,.0));
    m.position.copy(p);const v2=new THREE.Vector3((Math.random()-.5)*.55,Math.random()*.65+.2,(Math.random()-.5)*.55);
    const r=new THREE.Euler(Math.random()*6,Math.random()*6,Math.random()*6);scene.add(m);let life2=0;
    (function(mesh,vel,rot){function anim2(){life2+=.022;vel.y-=.01;mesh.position.add(vel);mesh.rotation.x+=rot.x*.04;mesh.rotation.y+=rot.y*.04;if(life2<1)requestAnimationFrame(anim2);else scene.remove(mesh);}requestAnimationFrame(anim2);})(m,v2,r);
  }
}

// ── DOM Effects ──
function spawnFloatingHearts(){const h=['\u{1F496}','\u{1F497}','\u{1F495}','\u{1F49C}','\u{1F90D}'];for(let i=0;i<35;i++)(function(idx){setTimeout(()=>{const el=document.createElement('div');el.className='floating-heart';el.textContent=h[Math.floor(Math.random()*h.length)];el.style.cssText='left:'+(Math.random()*90+5)+'%;bottom:0;font-size:'+(Math.random()*18+14)+'px;';const d=Math.random()*3+3;el.style.animationDuration=d+'s';document.body.appendChild(el);setTimeout(()=>el.remove(),d*1000);},idx*120);})(i);}
function spawnScreenSparkles(){for(let i=0;i<50;i++)(function(idx){setTimeout(()=>{const s=document.createElement('div');s.textContent='\u2728';s.style.cssText='position:fixed;left:'+Math.random()*100+'%;top:'+Math.random()*100+'%;font-size:'+(Math.random()*16+10)+'px;pointer-events:none;z-index:9997;opacity:0;transition:all 1.5s ease;';document.body.appendChild(s);setTimeout(()=>{s.style.opacity='1';s.style.transform='scale('+(Math.random()*.8+.6)+') rotate('+(Math.random()*180)+'deg)';},10);setTimeout(()=>s.style.opacity='0',1200);setTimeout(()=>s.remove(),2500);},idx*60);})(i);}

// ── Audio FX ──
function playBlowSound(){if(!beepOn)return;try{const ctx=getCtx(),buf=ctx.createBuffer(1,Math.floor(ctx.sampleRate*.12),ctx.sampleRate),data=buf.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;const src=ctx.createBufferSource();src.buffer=buf;const f=ctx.createBiquadFilter();f.type='bandpass';f.frequency.value=800;const g=ctx.createGain();g.gain.setValueAtTime(.2,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.12);src.connect(f);f.connect(g);g.connect(ctx.destination);src.start();}catch(e){}}
function playChime(){if(!beepOn)return;try{const ctx=getCtx(),now=ctx.currentTime;[523.25,659.25,783.99,1046.5,1318.51].forEach((f,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type='triangle';o.frequency.value=f;g.gain.setValueAtTime(0,now+i*.08);g.gain.linearRampToValueAtTime(.12,now+i*.08+.02);g.gain.exponentialRampToValueAtTime(.001,now+i*.08+.35);o.connect(g);g.connect(ctx.destination);o.start(now+i*.08);o.stop(now+i*.08+.35);});}catch(e){}}
function playMagicSound(){if(!beepOn)return;try{const ctx=getCtx(),now=ctx.currentTime,o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(350,now);o.frequency.exponentialRampToValueAtTime(1100,now+.4);g.gain.setValueAtTime(.15,now);g.gain.exponentialRampToValueAtTime(.001,now+.4);o.connect(g);g.connect(ctx.destination);o.start(now);o.stop(now+.4);}catch(e){}}
function playCrystalSweep(){if(!beepOn)return;try{const ctx=getCtx(),now=ctx.currentTime;for(let i=0;i<8;i++){const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';const f=400+i*150;o.frequency.setValueAtTime(f,now+i*.12);o.frequency.exponentialRampToValueAtTime(f*1.5,now+i*.12+.3);g.gain.setValueAtTime(0,now+i*.12);g.gain.linearRampToValueAtTime(.08,now+i*.12+.05);g.gain.exponentialRampToValueAtTime(.001,now+i*.12+.4);o.connect(g);g.connect(ctx.destination);o.start(now+i*.12);o.stop(now+i*.12+.4);}}catch(e){}}
