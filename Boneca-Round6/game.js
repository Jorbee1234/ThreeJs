const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1,1000);

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const loader = new THREE.GLTFLoader();

loader.load("../tree/scene.gltf", function(gltf){
    scene.add(gltf.scene);
    gltf.scene.scale.set(16,16,16);
    gltf.scene.position.set(0,-6,-12);
})

class Player {
    constructor(){
        const geometry = new THREE.BoxGeometry(0.3,0.3,0.3);
        const material = new THREE.MeshBasicMaterial({color: 0xffffff});
        const player = new THREE.Mesh(geometry, material);
        scene.add(player);
        this.player = player;

        player.position.x = 3;
        player.position.y = 0;
        player.position.z = 0;

        this.playerInfo={
            positionX: 6,
            velocity: 0
        }
    }

    anda(){
        this.playerInfo.velocity = 0.1;
    }

    update(){
        this.checa();
        this.playerInfo.positionX -= this.playerInfo.velocity;
        this.player.position.x = this.playerInfo.positionX;
    }

    para(){
        this.playerInfo.velocity = 0;
    }

    checa(){
        if(this.playerInfo.velocity > 0 && !tadecostas){
            text.innerHTML = "Você perdeu!";
            gamestatus = "fimdejogo";
        }
        if(this.playerInfo.positionX < -6){
            text.innerHTML = "Você ganhou!";
            gamestatus = "fimdejogo";
        }
    }
}

function delay(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}

class boneca{
    constructor() {
        loader.load("../model/scene.gltf",  (gltf) => {
            scene.add(gltf.scene)
            gltf.scene.scale.set(0.4,0.4,0.4);
            gltf.scene.position.set(0,-1,0);
            this.boneca1 = gltf.scene;
        })
    }

    praTras(){
        gsap.to(this.boneca1.rotation, {y:-3.15, duration:1});
        setTimeout(()=> tadecostas=true,450);
    }

    praFrente(){
        gsap.to(this.boneca1.rotation, {y:0, duration:1});
        setTimeout(() => tadecostas=false,150);
    }

    async start(){
        this.praTras();
        await delay((Math.random()*1000)+1000);
        this.praFrente();
        await delay((Math.random()*1000)+1000);
        this.start();
    }
}

let player1 = new Player();
let boneca1 = new boneca();
const text = document.querySelector('.text');
let gamestatus = "esperando";
let tadecostas = true;

async function init(){
    await delay(500);
    text.innerHTML = "Começando em 3";
    await delay(500);
    text.innerHTML = "Começando em 2";
    await delay(500);
    text.innerHTML = "Começando em 1";
    await delay(500);
    text.innerHTML = "VAI!";
    startGame();
}

function startGame(){
    gamestatus = "jogando";
    boneca1.start();
}

init();

const light = new THREE.AmbientLight(0xffffff);
scene.add(light);

renderer.setClearColor("#119CE8",1)

camera.position.z = 5;

function animate() {
    if(gamestatus == "fimdejogo") return;
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    player1.update();
}

animate();

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('keydown', function(e){
    if(gamestatus != "jogando") return;
    if(e.keyCode == 37){
        player1.anda();
    }
});

window.addEventListener('keyup', function(e){
    if(e.keyCode == 37){
        player1.para();
    }
})