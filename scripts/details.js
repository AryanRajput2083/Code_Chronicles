
let username = sessionStorage.getItem("username");


import * as THREE from "https://threejs.org/build/three.module.js";
import { OrbitControls } from '/libs/OrbitalControl.js';
import { GLTFLoader } from "/libs/GLTFLoader.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-app.js";
import { getDatabase, ref, set, onValue, onDisconnect, remove } from 'https://www.gstatic.com/firebasejs/9.9.0/firebase-database.js'
const firebaseConfig = {
    apiKey: "AIzaSyB88zQKVhNiLkD6Er8neuxn3YusVkLSnQ8",
    authDomain: "metaverse2214.firebaseapp.com",
    projectId: "metaverse2214",
    storageBucket: "metaverse2214.appspot.com",
    messagingSenderId: "910168238433",
    appId: "1:910168238433:web:81c3b984648453875cfd20",
    databaseURL: "https://metaverse2214-default-rtdb.firebaseio.com"
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

let scene,
    orbitCon,
    camera,
    renderer,
    canvas,
    prices = new Map(),
    names = new Map(),
    descri = new Map();



prices.set("worldModels/television/scene.gltf", '15,499 Rs.');
names.set("worldModels/television/scene.gltf", 'LJ 80 cm (32 inch) HD Ready LED Smart Android TV with Dolby Audio (2022 Model)');
descri.set("worldModels/television/scene.gltf", "Supported Apps: Netflix|Prime Video|Disney+Hotstar|Youtube Operating System: Android (Google Assistant & Chromecast in-built) Resolution: HD Ready 1366 x 768 Pixels");

prices.set("worldModels/fridge/scene.gltf", '16,690 Rs.');
names.set("worldModels/fridge/scene.gltf", 'LJ 190 L Direct Cool Double Door 4 Star Refrigerator with Base Drawer');
descri.set("worldModels/fridge/scene.gltf", "190 L : Good for couples and small families Smart Inverter Compressor 4 Star : For Energy savings up to 45% Direct Cool : Economical, consumes less electricity, requires manual defrosting Base Stand with Drawer : For storing items that d");

prices.set("worldModels/canon_camera/scene.gltf", '56,990 Rs.');
names.set("worldModels/canon_camera/scene.gltf", 'Canon EOS 200D II DSLR Camera EF-S18-55mm IS STM (Black)');
descri.set("worldModels/canon_camera/scene.gltf", "Is photography one of your passions? Bring home this EOS 200D II from Canon. This is Canon’s lightest DSLR that features a vari-angle LCD touch screen. It features a 24.1-megapixels APS-C CMOS sensor and a DIGIC 8 processor that capture stunning images. The EOS 200D II also has a lot of other features that make everyday photography a lot easier.");

prices.set("worldModels/laptop/scene.gltf", '33,990 Rs.');
names.set("worldModels/laptop/scene.gltf", 'ASUS VivoBook 15 (2022) Core i3 10th Gen ');
descri.set("worldModels/laptop/scene.gltf", "stylish & Portable Thin and Light Laptop 15.6 inch Full HD (200nits, 45% NTSC color gamut, non-OLED, Anti-glare display) Finger Print Sensor for Faster System Access Light Laptop without Optical Disk Drive");

prices.set("worldModels/stylized_washing_machine/scene.gltf", '13,999 Rs.');
names.set("worldModels/stylized_washing_machine/scene.gltf", 'SAMSUNG 6.2 kg with Monsoon Feature Fully Automatic Top Load Grey (WA62M4100HY/TL 01)');
descri.set("worldModels/stylized_washing_machine/scene.gltf", "Fully Automatic Top Load Washing Machines are ergonomically friendly and provide great wash quality 0 rpm : Higher the spin speed, lower the drying time 2 kg");

prices.set("worldModels/cupboard/scene.gltf", '2,699 Rs.');
names.set("worldModels/cupboard/scene.gltf", 'Supreme Fusion 01 Multi Purpose for Home Small Size Plastic Cupboard  (Finish Color - Dark Beige & Globus Brown, DIY');
descri.set("worldModels/cupboard/scene.gltf", "Bright colors & unique features make them an asset for the busy, modern household. These cupboards are a safe haven for storing toys, linens, Books, tools, shoes, Cleaning agents, Daily kinck-knacks & even groceries. These cupboards are amuch better choice then their conventional counterparts as they are termite-free, corrosion-free, light weight & easy to transport.");

prices.set("worldModels/jamo_s803_speakers/scene.gltf", '5,699 Rs.');
names.set("worldModels/jamo_s803_speakers/scene.gltf", 'JBL Speakers');
descri.set("worldModels/jamo_s803_speakers/scene.gltf", "Its time to delve into a playback ambience like never before courtesy boAt Blitz 2000, the 2.1 Channel Multimedia speaker with RGB LEDs. The RGB LEDs pave the way for making the ambience suit a lot more to the music being played and set the right vibe! Its 100W breath-taking sound with a subwoofer offers an amplified musical bliss.");

prices.set("worldModels/bmx/scene.gltf", '6,499 Rs.');
names.set("worldModels/bmx/scene.gltf", 'Hybrid Cycle/City Bike');
descri.set("worldModels/bmx/scene.gltf", "Urban Terrain UT7002S26 City Bicycle is the best in the class bike for the ultimate riding experience. It is made of high quality, very strong, and light steel to maximize durability, performance, and smooth ride. The wheel size of 26 inches with v-break makes it ideal for riding in all conditions in City. Premium V-Break in both front and rear wheels provide maximum safety. ");

prices.set("worldModels/mountain_bike/scene.gltf", '7,999 Rs.');
names.set("worldModels/mountain_bike/scene.gltf", 'Urban Terrain Berlin with Complete Accessories Hybrid Cycle/City Bike');
descri.set("worldModels/mountain_bike/scene.gltf", "Urban Terrain UT7001S27.5 City Bicycle is the best in the class bike for the ultimate riding experience. It is made of high quality, very strong, and light steel to maximize durability, performance, and smooth ride. The wheel size of 27.5 inches with wire brake makes it ideal for riding in all conditions in City. Premium wire brake in both front and rear wheels provide maximum safety.  ");

prices.set("worldModels/kurta_and_palazzo/scene.gltf", '495 Rs.');
names.set("worldModels/kurta_and_palazzo/scene.gltf", 'Women Kurta and Palazzo Set Pure Cotton');
descri.set("worldModels/kurta_and_palazzo/scene.gltf", "You can wear palazzo-style pants along with Indian Kurtis is one of the simplest ways to make the clothing more formal than any office dressing, you also feel comfortable in your dressing during office hours.");

prices.set("worldModels/nycfashion_t-_shirt_dress/scene.gltf", '249 Rs.');
names.set("worldModels/nycfashion_t-_shirt_dress/scene.gltf", 'Casual Regular Sleeves Solid Women Pink Top');
descri.set("worldModels/nycfashion_t-_shirt_dress/scene.gltf", "A fabric suitable for women's clothing");

prices.set("worldModels/skirt_and_t-shirt/scene.gltf", '399 Rs.');
names.set("worldModels/skirt_and_t-shirt/scene.gltf", 'Women A-line');
descri.set("worldModels/skirt_and_t-shirt/scene.gltf", "Wear this Beautiful Round Neck Dress In Polyester Blend Fabric which makes you feel and look Gorgeous");

prices.set("worldModels/frock_design/scene.gltf", '799 Rs.');
names.set("worldModels/frock_design/scene.gltf", 'Women Striped Crepe Ethnic Dress (Multicolor)');
descri.set("worldModels/frock_design/scene.gltf", "Bring out the best of you with this beautiful Kurta from the house MODLI 20 FASHION The fabric in this bright and bold color kurta will make sure that the fitting of this beautiful kurta looks elegant on you.");

prices.set("worldModels/long_red_sleeveless/scene.gltf", '896 Rs.');
names.set("worldModels/long_red_sleeveless/scene.gltf", 'Women A-line Multicolor Dress');
descri.set("worldModels/long_red_sleeveless/scene.gltf", "Western dresses for women girls dress womens stylish indo latest design 10-11 years age 15 kurtis wear below 300 knees casual girl mbo designer tops pink colour 1 piece High Law Georgette Party Western Stylish Trendy Floral Design Cold Shoulder Dress Short Frock Dresses skater knee length floral black cotton lifestyle ladies party low price long maxi miss chase mini navy blue net orange pluss size Mini Midi Skirt Collage v neck deep short under 200 white w xl x-small x small year zip front.");

// prices.set("worldModels/vestido_anos_50/scene.gltf", '596 Rs.');
// names.set("worldModels/vestido_anos_50/scene.gltf", 'Women Fit and Flare Red');
// descri.set("worldModels/vestido_anos_50/scene.gltf", "Machine wash warm wash with like colours only non-chlorine bleach when needed tumble dry low warm iron if needed.");

prices.set("worldModels/t-shirt/scene.gltf", '293 Rs.');
names.set("worldModels/t-shirt/scene.gltf", 'Printed Men Round Neck T-Shirt');
descri.set("worldModels/t-shirt/scene.gltf", "Machine wash warm wash with like colours only non-chlorine bleach when needed tumble dry low warm iron if needed.");

prices.set("worldModels/t-shirt__b/scene.gltf", '499 Rs.');
names.set("worldModels/t-shirt__b/scene.gltf", 'Solid Men Polo Neck T-Shirt');
descri.set("worldModels/t-shirt__b/scene.gltf", "Machine wash warm wash with like colours only non-chlorine bleach when needed tumble dry low warm iron if needed.");

prices.set("worldModels/worn_t-shirt/scene.gltf", '229 Rs.');
names.set("worldModels/worn_t-shirt/scene.gltf", 'Striped Men Round Neck T-Shirt');
descri.set("worldModels/worn_t-shirt/scene.gltf", "Refresh your wardrobe with the new range of Summer Collections of Organic Cotton Polo T-shirts from Scott International. This Polo T-shirts are made of is 100% Pure Premium Organic Cotton fabric, Super Combed, Solid Polo and gives utmost comfort during all temperatures.");

prices.set("worldModels/dillard_darren_joggers/scene.gltf", '999 Rs.');
names.set("worldModels/dillard_darren_joggers/scene.gltf", 'Camouflage Men Greycolor Track Pants');
descri.set("worldModels/dillard_darren_joggers/scene.gltf", "Premium quality fabric material is used to ensure comfortable and long lasting usage. Two pockets with zipper gives space to carry mobile and other valuables. Stretchable fabric makes it useful for running, gym and night wear. Atractive brand logo makes it point of attraction for your loved once. ");

prices.set("worldModels/joggers/scene.gltf", '899 Rs.');
names.set("worldModels/joggers/scene.gltf", 'Solid Men Track Pants');
descri.set("worldModels/joggers/scene.gltf", "It is important to wear the right type of workout attire while you hit the gym, and track parts are one of the best clothing options you can wear. These trousers are comfortable and designed to help you exercise in an unobstructed way. They are made out of smooth and soft fabrics that allow you to stretch and exercise while working out.");

prices.set("worldModels/the_pants/scene.gltf", '1,174 Rs.');
names.set("worldModels/the_pants/scene.gltf", 'Track Pants');
descri.set("worldModels/the_pants/scene.gltf", "Machine washable. Wash in cold water, use a mild detergent, don’t use fabric softeners. Dry in shade. We are all about comfort but still believe in looking great - hence we use the only the most comfy fabric for our tees. ");

scene = new THREE.Scene();
scene.background = new THREE.Color(0xb3d9ff);
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
canvas = document.querySelector('#c');
renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
var navi = document.querySelector('#navi')
navi.appendChild(renderer.domElement);
camera.position.z = 50;
camera.position.x = 0;
camera.position.y = -50;
orbitCon = new OrbitControls(camera, renderer.domElement);
document.getElementById("ad").style.display = 'none';
document.getElementById("rv").style.display = 'none';
// document.getElementById("rv").style.visibility = 'hidden';
// document.getElementById("ad").style.visibility = 'hidden';
// orbitCon.minPolarAngle = 0;// Math.PI/6;
// orbitCon.maxPolarAngle = Math.PI / 2;
// orbitCon.rotatespeed = 3;

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
camera.position.z = 5;

function addLight() {
    var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 2);
    hemiLight.position.set(0, 50, 0);
    // Add hemisphere light to scene
    scene.add(hemiLight);
    let d = 8.25;
    var dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(-8, 12, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 1500;
    dirLight.shadow.camera.left = d * -1;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = d * -1;
    // Add directional Light to scene
    scene.add(dirLight);
}
function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let canvasPixelWidth = canvas.width / window.devicePixelRatio;
    let canvasPixelHeight = canvas.height / window.devicePixelRatio;

    const needResize =
        canvasPixelWidth !== width || canvasPixelHeight !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}
let loaded = false;
let model;
function update() {
    orbitCon.update();
    if (loaded) {
        model.rotation.y += 0.015;
    }
    renderer.render(scene, camera);
    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }
    requestAnimationFrame(update);
    renderer.render(scene, camera);
}
function addObj(obj) {
    var loader = new GLTFLoader();
    loader.load(obj, function (gltf) {
        // obj = gltf.scene;
        // obj.position.set(-150, 0, -400);
        // obj.scale.set(8, 8, 8);
        scene.add(gltf.scene);
        loaded = true;
        model = gltf.scene;
        model.rotation.x += Math.PI / 2;
    })
}


function attachF() {
    let ss = 'Cart/' + username + '/' + obb;
    const starCountRef = ref(database, ss);
    onValue(starCountRef, (snapshot) => {
        // snapshot.forEach(function (childr) {
        var id = snapshot.child("obb").val();
        if (id == ob) {
            document.getElementById("ad").style.display = 'none';
            document.getElementById("rv").style.display = 'block';
        }
        else {

            document.getElementById("rv").style.display = 'none';
            document.getElementById("ad").style.display = 'block';
        }
    });
}
document.getElementById('ad').onclick = addtoCart;
document.getElementById('rv').onclick = removeCart;
function addtoCart() {
    let ss = 'Cart/' + username + '/' + obb;
    set(ref(database, ss), {
        obb: ob
    }).then(() => {
        document.getElementById("ad").style.display = 'none';
        document.getElementById("rv").style.display = 'block';
        // document.getElementById("ad").style.visibility = 'hidden';
        // document.getElementById("rv").style.visibility = 'visible';

    });
}
function removeCart() {
    let ss = 'Cart/' + username + '/' + obb;
    const starCountRef = ref(database, ss);
    remove(starCountRef)
        // ref(database,ss).remove()
        .then(() => {
            document.getElementById("rv").style.display = 'none';
            document.getElementById("ad").style.display = 'block';
            // document.getElementById("rv").style.visibility = 'hidden';
            // document.getElementById("ad").style.visibility = 'visible';
        });
}

let ob = sessionStorage.getItem("item");
let obb = ob.replace('.', '-*');
obb = obb.replace('/', '-+');
console.log(obb);
console.log(ob);
document.getElementById('price3').innerText = prices.get(ob);
document.getElementById('price2').innerText = descri.get(ob);
document.getElementById('price1').innerText = names.get(ob);
addObj(ob);
addLight();
attachF();
update();