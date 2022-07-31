import * as THREE from "https://threejs.org/build/three.module.js";
import { OrbitControls } from '/libs/OrbitalControl.js';
import { GLTFLoader } from "/libs/GLTFLoader.js";

// for world
import { RGBELoader } from "/libs/RGBELoader.js";

// // firebase setup
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


class world {
    constructor() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xb3d9ff);
        // this.scene.fog = new THREE.Fog(0xf1ff1f1, 60, 100);
        this.setCamera();
        // this.addPlane();
        this.addLight();
        // this.addGeometry();
    }

    setCamera() {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        let canvas = document.querySelector('#c');
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild(this.renderer.domElement);
        this.camera.position.z = -80;
        this.camera.position.x = 0;
        this.camera.position.y = 30;
        this.orbitCon = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbitCon.minPolarAngle = 0;// Math.PI/6;
        this.orbitCon.maxPolarAngle = Math.PI / 2;
        this.orbitCon.rotatespeed = 3;
    }

    addPlane() {
        this.floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
        this.floorMaterial = new THREE.MeshPhongMaterial({
            color: 0xeeeeee,
            shininess: 0,
        });
        this.floor = new THREE.Mesh(this.floorGeometry, this.floorMaterial);
        this.floor.rotation.x = -0.5 * Math.PI; // This is 90 degrees by the way
        this.floor.receiveShadow = true;
        this.floor.position.y = -11;
        this.scene.add(this.floor);
    }

    addLight() {
        this.hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
        this.hemiLight.position.set(0, 50, 0);
        // Add hemisphere light to scene
        this.scene.add(this.hemiLight);
        let d = 8.25;
        this.dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
        this.dirLight.position.set(-8, 12, 8);
        this.dirLight.castShadow = true;
        this.dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
        this.dirLight.shadow.camera.near = 0.1;
        this.dirLight.shadow.camera.far = 1500;
        this.dirLight.shadow.camera.left = d * -1;
        this.dirLight.shadow.camera.right = d;
        this.dirLight.shadow.camera.top = d;
        this.dirLight.shadow.camera.bottom = d * -1;
        // Add directional Light to scene
        this.scene.add(this.dirLight);
    }

    addGeometry() {
        this.geometry = new THREE.SphereGeometry(8, 32, 32);
        this.material = new THREE.MeshBasicMaterial({ color: 0x9bffaf }); // 0xf2ce2e 
        this.sphere = new THREE.Mesh(this.geometry, this.material);
        this.sphere.position.z = -15;
        this.sphere.position.y = -2.5;
        this.sphere.position.x = -0.25;
        this.scene.add(this.sphere);
    }

    resizeRendererToDisplaySize(renderer) {
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

    update() {
        this.orbitCon.update();
        this.renderer.render(this.scene, this.camera);
        if (this.resizeRendererToDisplaySize(this.renderer)) {
            const canvas = this.renderer.domElement;
            this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
            this.camera.updateProjectionMatrix();
        }
    }
}


// global variables

let worldVisible = true,
    loaded = false,
    characters = new Map(),
    Amixers = new Map(),
    shouldMove = new Map(),
    mixer,
    moveClipA = new Map(),
    idleClipA = new Map(),
    toSell = new Map(),
    clock = new THREE.Clock(),
    psec = 0,
    shouldupload = true,
    dir = new THREE.Vector3(),
    pos = new THREE.Vector3(),
    shouldrotate = new Map(),
    groupmap = new Map(),
    chatboxsmc = document.getElementById('chats'),
    other_un = document.getElementById('otherun'),
    hidec = document.getElementById('hs'),
    inp = document.getElementById('tA'),
    llld = true,
    sendc = document.getElementById('send');

var pointer = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
let INTERSECTED;

let username = sessionStorage.getItem("username");
if (username.length == 0) {
    worldVisible = false;
    window.location.replace("index.html");
}

// helper functions
function addToWorld(scene) {
    new RGBELoader()
        .load("worldModels/shanghai_bund_4k.hdr", function (texture) {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            scene.background = texture;
            scene.environment = texture;
        });

    var geometry_area = new THREE.BoxGeometry(10000, 0.02, 8000);
    var material_area = new THREE.MeshBasicMaterial({ color: 0x34a56f });
    var area = new THREE.Mesh(geometry_area, material_area);
    scene.add(area);
    area.position.set(0, 0, 0);

    var obj;
    var loader = new GLTFLoader();
    loader.load("worldModels/coffee_table/scene.gltf", function (gltf) {
        obj = gltf.scene;
        
        var modelBee = new THREE.Object3D( );
        modelBee.add(obj.clone());
        modelBee.scale.set(8, 8, 8);
        modelBee.position.set(-335, 0, -400);
        modelBee.add(gltf.scene);
        scene.add(modelBee);

        var modelBee = new THREE.Object3D( );
        modelBee.add(obj.clone());
        modelBee.scale.set(8, 8, 8);
        modelBee.position.set(-150, 0, -400);
        scene.add(modelBee);
        
    })
    var obj4;
    var loader = new GLTFLoader();
    loader.load("worldModels/shop/scene.gltf", function (gltf) {
        obj4 = gltf.scene;
        obj4.position.set(-270, -5, -640);
        obj4.scale.set(3, 3, 3);
        scene.add(gltf.scene);
    })
    var obj5;
    var loader = new GLTFLoader();
    loader.load("worldModels/candy_shop/scene.gltf", function (gltf) {
        obj5 = gltf.scene;
        obj5.position.set(-1100, -5, -440);
        obj5.scale.set(50, 50, 50);
        scene.add(gltf.scene);
    })
    var obj6;
    var loader = new GLTFLoader();
    loader.load("worldModels/classic_shop/scene.gltf", function (gltf) {
        obj6 = gltf.scene;
        obj6.position.set(600, -5, -650);
        obj6.scale.set(1.5, 1.5, 1.5);
        scene.add(gltf.scene);
    })
    var fountain;
    var loader = new GLTFLoader();
    loader.load("worldModels/fountain/scene.gltf", function (gltf) {
        fountain = gltf.scene;
        fountain.position.set(550, 0, -200);
        fountain.scale.set(0.5, 0.5, 0.5);
        scene.add(gltf.scene);
    })
    var obj7;
    var loader = new GLTFLoader();
    loader.load("worldModels/low_poly_coffee_shop_-_mm/scene.gltf", function (gltf) {
        obj7 = gltf.scene;
        obj7.position.set(-1070, -5, 70);
        obj7.scale.set(50, 50, 50);
        scene.add(gltf.scene);
    })
    var obj9;
    var loader = new GLTFLoader();
    loader.load("worldModels/wooden__bench/scene.gltf", function (gltf) {


        obj9 = gltf.scene;
        
        var modelBee = new THREE.Object3D( );
        modelBee.add(obj9.clone());
        modelBee.position.set(400, 10, 100);
        modelBee.scale.set(0.5, 0.5, 0.5);
        scene.add(modelBee);

        var modelBee = new THREE.Object3D( );
        modelBee.add(obj9.clone());
        modelBee.position.set(600, 10, 100);
        modelBee.scale.set(0.5, 0.5, 0.5);
        scene.add(modelBee);

    })
    var obj10;
    var loader = new GLTFLoader();
    loader.load("worldModels/stylized_tree/scene.gltf", function (gltf) {
        obj10 = gltf.scene;
        obj10.position.set(-420, 0, -480);
        obj10.scale.set(500, 500, 500);
        scene.add(gltf.scene);
    })
    var floor;
    var loader = new GLTFLoader();
    loader.load("worldModels/modelo_12_-_pizarra_102/scene.gltf", function (gltf) {
        floor = gltf.scene;
        // floor.position.set(-55, 1, 0);
        // floor.scale.set(8, 1, 1200);
        
        var modelBee = new THREE.Object3D( );
        modelBee.add(floor.clone());
        modelBee.scale.set(8, 1, 1200);
        modelBee.position.set(-55, 1, 0);
        scene.add(modelBee);

        var modelBee = new THREE.Object3D( );
        modelBee.add(floor.clone());
        modelBee.position.set(700, 1, 0);
        modelBee.scale.set(8, 1, 1200);
        scene.add(modelBee);

        var modelBee = new THREE.Object3D( );
        modelBee.add(floor.clone());
        modelBee.position.set(850, 1, 0);
        modelBee.scale.set(8, 1, 1200);
        scene.add(modelBee);

        var modelBee = new THREE.Object3D( );
        modelBee.add(floor.clone());
        modelBee.scale.set(8, 1, 1200);
        modelBee.position.set(-950, 1, 0);
        scene.add(modelBee);

        var modelBee = new THREE.Object3D( );
        modelBee.add(floor.clone());
        modelBee.scale.set(11, 1, 1200);
        modelBee.position.set(-1200, 1, 0);
        scene.add(modelBee);

        var modelBee = new THREE.Object3D( );
        modelBee.add(floor.clone());
        modelBee.scale.set(8, 1, 1200);
        modelBee.position.set(-225, 1, 0);
        scene.add(modelBee);

        var modelBee = new THREE.Object3D( );
        modelBee.add(floor.clone());
        modelBee.position.set(5450, 1, -700);
        modelBee.scale.set(11, 1, 1200);
        modelBee.rotateY(-Math.PI / 2)
        scene.add(modelBee);

        var modelBee = new THREE.Object3D( );
        modelBee.add(floor.clone());
        modelBee.position.set(850, 1, -550);
        modelBee.scale.set(11, 1, 1200);
        modelBee.rotateY(-Math.PI / 2)
        scene.add(modelBee);

        var modelBee = new THREE.Object3D( );
        modelBee.add(floor.clone());
        modelBee.scale.set(11, 1, 1200);
        modelBee.rotateY(Math.PI / 2)
        modelBee.position.set(0, 1, -30);
        scene.add(modelBee);
        
        // var modelBee = new THREE.Object3D( );
        // modelBee.add(floor.clone());
        // modelBee.position.set(0, 0, 400);
        // scene.add(modelBee);
        
        var modelBee = new THREE.Object3D( );
        modelBee.add(floor.clone());
        modelBee.position.set(0, 1, 10);
        modelBee.scale.set(11, 1, 1200);
        modelBee.rotateY(-Math.PI / 2)
        scene.add(modelBee);
        
        var modelBee = new THREE.Object3D( );
        modelBee.add(floor.clone());
        modelBee.scale.set(11, 1, 1200);
        modelBee.rotateY(-Math.PI / 2)
        modelBee.position.set(0, 1, 200);
        scene.add(modelBee);
        
        var modelBee = new THREE.Object3D( );
        modelBee.add(floor.clone());
        modelBee.scale.set(11, 1, 1200);
        modelBee.rotateY(Math.PI / 2)
        modelBee.position.set(-5500, 1, 90);
        scene.add(modelBee);  
    })
    var road1;
    var loader = new GLTFLoader();
    loader.load("worldModels/voxel_roads/scene.gltf", function (gltf) {
        road1 = gltf.scene;

        var modelBee = new THREE.Object3D( );
        modelBee.add(road1.clone());
        modelBee.scale.set(25, 1, 2000);
        modelBee.position.set(0, 1, 200);
        scene.add(modelBee);  

        var modelBee = new THREE.Object3D( );
        modelBee.add(road1.clone());
        modelBee.scale.set(25, 1, 2000);
        modelBee.position.set(0,0,400);
        scene.add(modelBee);  
        
        var modelBee = new THREE.Object3D( );
        modelBee.add(road1.clone());
        modelBee.position.set(912, 0, 1200);
        modelBee.scale.set(25, 1, 2000);
        scene.add(modelBee);  
        
        var modelBee = new THREE.Object3D( );
        modelBee.add(road1.clone());
        modelBee.position.set(1000, 0, 410);
        modelBee.scale.set(25, 1, 2500);
        modelBee.rotateY(Math.PI / 2)
        scene.add(modelBee);  
        
        var modelBee = new THREE.Object3D( );
        modelBee.add(road1.clone());
        modelBee.position.set(-800, 0, 310);
        modelBee.scale.set(25, 1, 2000);
        modelBee.rotateY(-Math.PI / 2)
        scene.add(modelBee);  
        
        var modelBee = new THREE.Object3D( );
        modelBee.add(road1.clone());
        modelBee.position.set(10000, 0, -300);
        modelBee.scale.set(25, 1, 2500);
        modelBee.rotateY(Math.PI / 2)
        scene.add(modelBee);  
        
        var modelBee = new THREE.Object3D( );
        modelBee.add(road1.clone());
        modelBee.position.set(-7930, 0, -295);
        modelBee.scale.set(25, 1, 2000);
        modelBee.rotateY(-Math.PI / 2)
        scene.add(modelBee);  
        
        var modelBee = new THREE.Object3D( );
        modelBee.add(road1.clone());
        modelBee.position.set(-888, 0, 1800);
        modelBee.scale.set(25, 1, 2000);
        scene.add(modelBee);  
        
    })
    var croad1;
    var loader = new GLTFLoader();
    loader.load("worldModels/crossing_road_texture_2/scene.gltf", function (gltf) {
        croad1 = gltf.scene;

        var modelBee = new THREE.Object3D( );
        modelBee.add(croad1.clone());
        modelBee.scale.set(0.03, 0.03, 0.03);
        modelBee.position.set(38, 9, -250);
        scene.add(modelBee); 
        
        var modelBee = new THREE.Object3D( );
        modelBee.add(croad1.clone());
        modelBee.position.set(38, 9, -355);
        modelBee.scale.set(0.03, 0.03, 0.03);
        scene.add(modelBee); 
        
        var modelBee = new THREE.Object3D( );
        modelBee.add(croad1.clone());
        modelBee.position.set(950, 9, -355);
        modelBee.scale.set(0.03, 0.03, 0.03);
        scene.add(modelBee); 
        
        var modelBee = new THREE.Object3D( );
        modelBee.add(croad1.clone());
        modelBee.position.set(-850, 9, -250);
        modelBee.scale.set(0.03, 0.03, 0.03);
        scene.add(modelBee); 
        
        var modelBee = new THREE.Object3D( );
        modelBee.add(croad1.clone());
        modelBee.position.set(-850, 9, 355);
        modelBee.scale.set(0.03, 0.03, 0.03);
        scene.add(modelBee); 
        
        var modelBee = new THREE.Object3D( );
        modelBee.add(croad1.clone());
        modelBee.position.set(38, 9, 350);
        modelBee.scale.set(0.03, 0.03, 0.03);
        scene.add(modelBee); 
        
        var modelBee = new THREE.Object3D( );
        modelBee.add(croad1.clone());
        modelBee.position.set(950, 9, 350);
        modelBee.scale.set(0.03, 0.03, 0.03);
        scene.add(modelBee); 
        
    })
    var low_poly_road_blocker;
    var loader = new GLTFLoader();
    loader.load("worldModels/low_poly_road_blocker/scene.gltf", function (gltf) {
        low_poly_road_blocker = gltf.scene;

        var modelBee = new THREE.Object3D( );
        modelBee.add(low_poly_road_blocker.clone());
        modelBee.scale.set(40, 40, 40);
        modelBee.position.set(45, 0, -550);
        scene.add(modelBee); 
        
        var modelBee = new THREE.Object3D( );
        modelBee.add(low_poly_road_blocker.clone());
        modelBee.position.set(970, 0, -550);
        modelBee.scale.set(40, 40, 40);
        scene.add(modelBee); 

        var modelBee = new THREE.Object3D( );
        modelBee.add(low_poly_road_blocker.clone());
        modelBee.position.set(970, 0, 550);
        modelBee.scale.set(40, 40, 40);
        scene.add(modelBee); 
        
        var modelBee = new THREE.Object3D( );
        modelBee.add(low_poly_road_blocker.clone());
        modelBee.position.set(-850, 0, 550);
        modelBee.scale.set(40, 40, 40);
        scene.add(modelBee); 
        
        var modelBee = new THREE.Object3D( );
        modelBee.add(low_poly_road_blocker.clone());
        modelBee.position.set(1080, 0, -370);
        modelBee.scale.set(40, 40, 40);
        modelBee.rotateY(Math.PI / 2)
        scene.add(modelBee); 
        
        var modelBee = new THREE.Object3D( );
        modelBee.add(low_poly_road_blocker.clone());
        modelBee.position.set(1080, 0, 370);
        modelBee.scale.set(40, 40, 40);
        modelBee.rotateY(Math.PI / 2)
        scene.add(modelBee); 
        
        var modelBee = new THREE.Object3D( );
        modelBee.add(low_poly_road_blocker.clone());
        modelBee.position.set(-1080, 0, 370);
        modelBee.scale.set(40, 40, 40);
        scene.add(modelBee); 
        
        var modelBee = new THREE.Object3D( );
        modelBee.add(low_poly_road_blocker.clone());
        modelBee.position.set(-1080, 0, -230);
        modelBee.scale.set(40, 40, 40);
        modelBee.rotateY(Math.PI / 2);
        scene.add(modelBee); 
        
        var modelBee = new THREE.Object3D( );
        modelBee.add(low_poly_road_blocker.clone());
        modelBee.position.set(-840, 0, -550);
        modelBee.scale.set(40, 40, 40);
        scene.add(modelBee); 

    })
    var trees_low_poly;
    var loader = new GLTFLoader();
    loader.load("worldModels/tree/scene.gltf", function (gltf) {

        trees_low_poly = gltf.scene;
        var modelBee = new THREE.Object3D( );
        modelBee.add(trees_low_poly.clone());
        modelBee.position.set(660, 0, -140);
        modelBee.scale.set(0.15, 0.15, 0.15);
        modelBee.rotateY(Math.PI / 2)
        scene.add(modelBee);

        var modelBee = new THREE.Object3D( );
        modelBee.add(trees_low_poly.clone());
        modelBee.position.set(250, 0, 80);
        modelBee.scale.set(0.15, 0.15, 0.15);
        scene.add(modelBee);
        
        var modelBee = new THREE.Object3D( );
        modelBee.add(trees_low_poly.clone());
        modelBee.position.set(-200, 0, -30);
        modelBee.scale.set(0.2, 0.2, 0.2);
        scene.add(modelBee);
    })
    var mickey_and_minnie_mouse;
    var loader = new GLTFLoader();
    loader.load("worldModels/mickey_and_minnie_mouse/scene.gltf", function (gltf) {
        mickey_and_minnie_mouse = gltf.scene;
        mickey_and_minnie_mouse.position.set(250, 17.8, -50);
        mickey_and_minnie_mouse.scale.set(15, 15, 15);
        scene.add(gltf.scene);
    })
    var Tree1;
    var loader = new GLTFLoader();
    loader.load("worldModels/Tree1/scene.gltf", function (gltf) {
        trees_low_poly = gltf.scene;

        var modelBee = new THREE.Object3D( );
        modelBee.add(trees_low_poly.clone());
        modelBee.position.set(540, 0, 120);
        modelBee.scale.set(0.6, 0.6, 0.6);
        scene.add(modelBee);
        
        var modelBee = new THREE.Object3D( );
        modelBee.add(trees_low_poly.clone());
        modelBee.position.set(310, 0, -50);
        modelBee.scale.set(0.6, 0.6, 0.6);
        scene.add(modelBee);
    })
    var park_trash_bin;
    var loader = new GLTFLoader();
    loader.load("worldModels/park_trash_bin/scene.gltf", function (gltf) {
        park_trash_bin = gltf.scene;
        park_trash_bin.position.set(800, 0, 120);
        park_trash_bin.scale.set(0.3, 0.3, 0.3);
        park_trash_bin.rotateY(-Math.PI / 2)
        scene.add(gltf.scene);
    })
    var warehouse;
    var loader = new GLTFLoader();
    loader.load("worldModels/warehouse/scene.gltf", function (gltf) {
        warehouse = gltf.scene;
        warehouse.position.set(-60, -4, 820);
        warehouse.scale.set(0.063, 0.063, 0.063);
        warehouse.rotateY(-Math.PI)
        scene.add(gltf.scene);
    })
    var lobuild_design_v2;
    var loader = new GLTFLoader();
    loader.load("worldModels/build_design_v2/scene.gltf", function (gltf) {
        lobuild_design_v2 = gltf.scene;
        lobuild_design_v2.position.set(1300, 90, 0);
        lobuild_design_v2.scale.set(0.6, 0.8, 0.9);
        lobuild_design_v2.rotateY(-Math.PI / 2)
        scene.add(gltf.scene);
    })
    var lobuilding_05;
    var loader = new GLTFLoader();
    loader.load("worldModels/building_05/scene.gltf", function (gltf) {
        lobuilding_05 = gltf.scene;
        
        var modelBee = new THREE.Object3D( );
        modelBee.add(lobuilding_05.clone());
        modelBee.position.set(740, 61, 865);
        modelBee.scale.set(190, 120, 190);
        scene.add(modelBee);
        
        var modelBee = new THREE.Object3D( );
        modelBee.add(lobuilding_05.clone());
        modelBee.position.set(400, 52, -570);
        modelBee.scale.set(100, 100, 100);
        scene.add(modelBee);
    })
    var lohi_rise_apartment_building;
    var loader = new GLTFLoader();
    loader.load("worldModels/hi_rise_apartment_building/scene.gltf", function (gltf) {
        lohi_rise_apartment_building = gltf.scene;
        lohi_rise_apartment_building.position.set(-560, 0, 680);
        lohi_rise_apartment_building.scale.set(0.06, 0.06, 0.06);
        lohi_rise_apartment_building.rotateY(Math.PI)
        // obj.setSize(1000);
        scene.add(gltf.scene);
    })
    var locoffee_shop;
    var loader = new GLTFLoader();
    loader.load("worldModels/coffee_shop/scene.gltf", function (gltf) {
        locoffee_shop = gltf.scene;
        locoffee_shop.position.set(-190, -90, 235);
        locoffee_shop.scale.set(2, 2, 2);
        scene.add(gltf.scene);
    })
    var lshopping_center;
    var loader = new GLTFLoader();
    loader.load("worldModels/shopping_center/scene.gltf", function (gltf) {
        lshopping_center = gltf.scene;
        lshopping_center.position.set(-700, -15, 20);
        lshopping_center.scale.set(3, 10, 5);
        lshopping_center.rotateY(-Math.PI / 2);
        // obj.setSize(1000);
        scene.add(gltf.scene);
    })
    var lcommercial_building;
    var loader = new GLTFLoader();
    loader.load("worldModels/modern_building_06/scene.gltf", function (gltf) {
        lcommercial_building = gltf.scene;
        lcommercial_building.position.set(-500, -1, 155);
        lcommercial_building.scale.set(60, 250, 220);
        lcommercial_building.rotateY(Math.PI / 2);
        // obj.setSize(1000);
        scene.add(gltf.scene);
    })
    var lramen_shop;
    var loader = new GLTFLoader();
    loader.load("worldModels/ramen_shop/scene.gltf", function (gltf) {
        lramen_shop = gltf.scene;
        lramen_shop.position.set(-280, -1, 155);
        lramen_shop.scale.set(0.5, 0.5, 0.5);
        scene.add(gltf.scene);
    })
    var ldonut_shop;
    var loader = new GLTFLoader();
    loader.load("worldModels/donut_shop/scene.gltf", function (gltf) {
        ldonut_shop = gltf.scene;
        ldonut_shop.position.set(-440, -1, 115);
        ldonut_shop.scale.set(50, 50, 50);
        scene.add(gltf.scene);
    })

    var folding_table;
    var loader = new GLTFLoader();
    loader.load("worldModels/folding_table/scene.gltf", function (gltf) {
        folding_table = gltf.scene;
        folding_table.position.set(38, 14, 660);;
        folding_table.scale.set(20, 10, 20);
        folding_table.rotateY(-Math.PI / 2);
        scene.add(gltf.scene);
    })
    var amelinco_office_building;
    var loader = new GLTFLoader();
    loader.load("worldModels/amelinco_office_building/scene.gltf", function (gltf) {
        amelinco_office_building = gltf.scene;
        amelinco_office_building.position.set(1350, -1, -725);
        amelinco_office_building.scale.set(20, 20, 20);
        amelinco_office_building.rotateY(-Math.PI / 2);
        // obj.setSize(1000);
        scene.add(gltf.scene);
    })
    var building_beveled_corners_shiny;
    var loader = new GLTFLoader();
    loader.load("worldModels/building_-_beveled_corners_-_shiny/scene.gltf", function (gltf) {
        building_beveled_corners_shiny = gltf.scene;
        building_beveled_corners_shiny.position.set(1250, -1, 700);
        building_beveled_corners_shiny.scale.set(10, 10, 10);
        building_beveled_corners_shiny.rotateY(-Math.PI / 2);
        // obj.setSize(1000);
        scene.add(gltf.scene);
    })
    var folding_table;
    var loader = new GLTFLoader();
    loader.load("worldModels/folding_table/scene.gltf", function (gltf) {
        folding_table = gltf.scene;
        folding_table.position.set(38, 10, 850);;
        folding_table.scale.set(20, 20, 20);
        folding_table.rotateY(-Math.PI / 2);
        scene.add(gltf.scene);
    })
    var folding_table;
    var loader = new GLTFLoader();
    loader.load("worldModels/folding_table/scene.gltf", function (gltf) {
        folding_table = gltf.scene;
        folding_table.position.set(24, 10, 975);;
        folding_table.scale.set(20, 20, 20);
        folding_table.rotateY(-Math.PI / 2);
        scene.add(gltf.scene);
    })



    // SHOP

    var television;
    var loader = new GLTFLoader();
    loader.load("worldModels/television/scene.gltf", function (gltf) {
        television = gltf.scene;
        television.position.set(0, 4, 654);;
        television.scale.set(2, 2, 2);
        television.rotateY(-Math.PI / 2);
        scene.add(gltf.scene);
        gltf.scene.traverse(o => {
            if (o.isMesh) {
                toSell.set(o.uuid, "worldModels/television/scene.gltf");
                shouldrotate.set(o.uuid, gltf.scene);
            }
        });
        groupmap.set(gltf.scene, false);
    })
    var cupboard;
    var loader = new GLTFLoader();
    loader.load("worldModels/cupboard/scene.gltf", function (gltf) {
        cupboard = gltf.scene;
        cupboard.position.set(10, 4, 604);;
        cupboard.scale.set(0.4, 0.4, 0.4);
        cupboard.rotateY(-Math.PI / 2);
        scene.add(gltf.scene);
        gltf.scene.traverse(o => {
            if (o.isMesh) {
                toSell.set(o.uuid, "worldModels/cupboard/scene.gltf");
                shouldrotate.set(o.uuid, gltf.scene);
            }
        });
        groupmap.set(gltf.scene, false);
    })
    var laptop;
    var loader = new GLTFLoader();
    loader.load("worldModels/laptop/scene.gltf", function (gltf) {
        laptop = gltf.scene;
        laptop.position.set(38, 18, 850);
        laptop.scale.set(3, 3, 3);
        laptop.rotateY(-Math.PI / 2);
        scene.add(gltf.scene);
        gltf.scene.traverse(o => {
            if (o.isMesh) {
                toSell.set(o.uuid, "worldModels/laptop/scene.gltf");
                shouldrotate.set(o.uuid, gltf.scene);
            }
        });
        groupmap.set(gltf.scene, false);
    })
    var jamo_s803_speakers;
    var loader = new GLTFLoader();
    loader.load("worldModels/jamo_s803_speakers/scene.gltf", function (gltf) {
        jamo_s803_speakers = gltf.scene;
        jamo_s803_speakers.position.set(48, -1, 902);
        jamo_s803_speakers.scale.set(4, 4, 4);
        jamo_s803_speakers.rotateY(-Math.PI / 2);
        scene.add(gltf.scene);
        gltf.scene.traverse(o => {
            if (o.isMesh) {
                toSell.set(o.uuid, "worldModels/jamo_s803_speakers/scene.gltf");
                shouldrotate.set(o.uuid, gltf.scene);
            }
        });
        groupmap.set(gltf.scene, false);
    })
    var canon_camera;
    var loader = new GLTFLoader();
    loader.load("worldModels/canon_camera/scene.gltf", function (gltf) {
        canon_camera = gltf.scene;
        canon_camera.position.set(18, 26, 975);;
        canon_camera.scale.set(1.7, 1.7, 1.7);
        canon_camera.rotateY(-Math.PI / 2);
        gltf.scene.traverse(o => {
            if (o.isMesh) {
                toSell.set(o.uuid, "worldModels/canon_camera/scene.gltf");
                shouldrotate.set(o.uuid, gltf.scene);
            }
        });
        groupmap.set(gltf.scene, false);
    })
    var fridge;
    var loader = new GLTFLoader();
    loader.load("worldModels/fridge/scene.gltf", function (gltf) {
        fridge = gltf.scene;
        fridge.position.set(38, 3, 725);;
        fridge.scale.set(0.3, 0.3, 0.3);
        fridge.rotateY(-Math.PI / 2);
        scene.add(gltf.scene);
        gltf.scene.traverse(o => {
            if (o.isMesh) {
                toSell.set(o.uuid, "worldModels/fridge/scene.gltf");
                shouldrotate.set(o.uuid, gltf.scene);
            }
        });
        groupmap.set(gltf.scene, false);
    })
    var stylized_washing_machine;
    var loader = new GLTFLoader();
    loader.load("worldModels/stylized_washing_machine/scene.gltf", function (gltf) {
        stylized_washing_machine = gltf.scene;
        stylized_washing_machine.position.set(28, 16, 789);;
        stylized_washing_machine.scale.set(0.05, 0.05, 0.05);
        stylized_washing_machine.rotateY(-Math.PI);
        scene.add(gltf.scene);
        gltf.scene.traverse(o => {
            if (o.isMesh) {
                toSell.set(o.uuid, "worldModels/stylized_washing_machine/scene.gltf");
                shouldrotate.set(o.uuid, gltf.scene);
            }
        });
        groupmap.set(gltf.scene, false);
    })
    var kurta_and_palazzo;
    var loader = new GLTFLoader();
    loader.load("worldModels/kurta_and_palazzo/scene.gltf", function (gltf) {
        kurta_and_palazzo = gltf.scene;
        kurta_and_palazzo.position.set(-140, 8, 600);
        kurta_and_palazzo.scale.set(0.03, 0.03, 0.03);
        kurta_and_palazzo.rotateY(Math.PI / 2);
        scene.add(gltf.scene);
        gltf.scene.traverse(o => {
            if (o.isMesh) {
                toSell.set(o.uuid, "worldModels/kurta_and_palazzo/scene.gltf");
                shouldrotate.set(o.uuid, gltf.scene);
            }
        });
        groupmap.set(gltf.scene, false);
    })
    var nycfashion_t__shirt_dress;
    var loader = new GLTFLoader();
    loader.load("worldModels/nycfashion_t-_shirt_dress/scene.gltf", function (gltf) {
        nycfashion_t__shirt_dress = gltf.scene;
        nycfashion_t__shirt_dress.position.set(-220, 25, 600);
        nycfashion_t__shirt_dress.scale.set(0.1, 0.1, 0.1);
        nycfashion_t__shirt_dress.rotateY(Math.PI / 2);
        scene.add(gltf.scene);
        gltf.scene.traverse(o => {
            if (o.isMesh) {
                toSell.set(o.uuid, "worldModels/nycfashion_t-_shirt_dress/scene.gltf");
                shouldrotate.set(o.uuid, gltf.scene);
            }
        });
        groupmap.set(gltf.scene, false);
    })
    var skirt_and_t_shirt;
    var loader = new GLTFLoader();
    loader.load("worldModels/skirt_and_t-shirt/scene.gltf", function (gltf) {
        skirt_and_t_shirt = gltf.scene;
        skirt_and_t_shirt.position.set(-280, -24, 600);
        skirt_and_t_shirt.scale.set(0.06, 0.06, 0.06);
        skirt_and_t_shirt.rotateY(Math.PI / 2);
        scene.add(gltf.scene);
        gltf.scene.traverse(o => {
            if (o.isMesh) {
                toSell.set(o.uuid, "worldModels/skirt_and_t-shirt/scene.gltf");
                shouldrotate.set(o.uuid, gltf.scene);
            }
        });
        groupmap.set(gltf.scene, false);
    })
    var frock_design;
    var loader = new GLTFLoader();
    loader.load("worldModels/frock_design/scene.gltf", function (gltf) {
        frock_design = gltf.scene;
        frock_design.position.set(-280, -5, 786);
        frock_design.scale.set(0.4, 0.4, 0.4);
        frock_design.rotateY(Math.PI / 2);
        scene.add(gltf.scene);
        gltf.scene.traverse(o => {
            if (o.isMesh) {
                toSell.set(o.uuid, "worldModels/frock_design/scene.gltf");
                shouldrotate.set(o.uuid, gltf.scene);
            }
        });
        groupmap.set(gltf.scene, false);
    })
    var long_red_sleeveless;
    var loader = new GLTFLoader();
    loader.load("worldModels/long_red_sleeveless/scene.gltf", function (gltf) {
        long_red_sleeveless = gltf.scene;
        long_red_sleeveless.position.set(-155, 5, 786);
        long_red_sleeveless.scale.set(0.03, 0.03, 0.03);
        long_red_sleeveless.rotateY(Math.PI / 2);
        scene.add(gltf.scene);
        gltf.scene.traverse(o => {
            if (o.isMesh) {
                toSell.set(o.uuid, "worldModels/long_red_sleeveless/scene.gltf");
                shouldrotate.set(o.uuid, gltf.scene);
            }
        });
        groupmap.set(gltf.scene, false);
    })
    var dillard_darren_joggers;
    var loader = new GLTFLoader();
    loader.load("worldModels/dillard_darren_joggers/scene.gltf", function (gltf) {
        dillard_darren_joggers = gltf.scene;
        dillard_darren_joggers.position.set(-155, 5, 666);
        dillard_darren_joggers.scale.set(10, 10, 10);
        dillard_darren_joggers.rotateY(Math.PI / 2);
        scene.add(gltf.scene);
        gltf.scene.traverse(o => {
            if (o.isMesh) {
                toSell.set(o.uuid, "worldModels/dillard_darren_joggers/scene.gltf");
                shouldrotate.set(o.uuid, gltf.scene);
            }
        });
        groupmap.set(gltf.scene, false);
    })
    var joggers;
    var loader = new GLTFLoader();
    loader.load("worldModels/joggers/scene.gltf", function (gltf) {
        joggers = gltf.scene;
        joggers.position.set(-275, 5, 666);
        joggers.scale.set(10, 10, 10);
        joggers.rotateY(Math.PI / 2);
        scene.add(gltf.scene);
        gltf.scene.traverse(o => {
            if (o.isMesh) {
                toSell.set(o.uuid, "worldModels/joggers/scene.gltf");
                shouldrotate.set(o.uuid, gltf.scene);
            }
        });
        groupmap.set(gltf.scene, false);
    })
    var the_pants;
    var loader = new GLTFLoader();
    loader.load("worldModels/the_pants/scene.gltf", function (gltf) {
        the_pants = gltf.scene;
        the_pants.position.set(-220, 5, 666);
        the_pants.scale.set(50, 50, 50);
        the_pants.rotateY(Math.PI / 2);
        scene.add(gltf.scene);
        gltf.scene.traverse(o => {
            if (o.isMesh) {
                toSell.set(o.uuid, "worldModels/the_pants/scene.gltf");
                shouldrotate.set(o.uuid, gltf.scene);
            }
        });
        groupmap.set(gltf.scene, false);
    })
    var t_shirt;
    var loader = new GLTFLoader();
    loader.load("worldModels/t-shirt/scene.gltf", function (gltf) {
        t_shirt = gltf.scene;
        t_shirt.position.set(-220, 25, 726);
        t_shirt.scale.set(0.4, 0.4, 0.4);
        t_shirt.rotateY(Math.PI / 2);
        scene.add(gltf.scene);
        gltf.scene.traverse(o => {
            if (o.isMesh) {
                toSell.set(o.uuid, "worldModels/t-shirt/scene.gltf");
                shouldrotate.set(o.uuid, gltf.scene);
            }
        });
        groupmap.set(gltf.scene, false);
    })

    var t_shirt__b;
    var loader = new GLTFLoader();
    loader.load("worldModels/t-shirt__b/scene.gltf", function (gltf) {
        t_shirt__b = gltf.scene;
        t_shirt__b.position.set(-300, 5, 726);
        t_shirt__b.scale.set(10, 10, 10);
        t_shirt__b.rotateY(Math.PI / 2);
        scene.add(gltf.scene);
        gltf.scene.traverse(o => {
            if (o.isMesh) {
                toSell.set(o.uuid, "worldModels/t-shirt__b/scene.gltf");
                shouldrotate.set(o.uuid, gltf.scene);
            }
        });
        groupmap.set(gltf.scene, false);
    })
    var worn_t_shirt;
    var loader = new GLTFLoader();
    loader.load("worldModels/worn_t-shirt/scene.gltf", function (gltf) {
        worn_t_shirt = gltf.scene;
        worn_t_shirt.position.set(-150, 25, 726);
        worn_t_shirt.scale.set(20, 20, 20);
        worn_t_shirt.rotateY(Math.PI / 2);
        scene.add(gltf.scene);
        gltf.scene.traverse(o => {
            if (o.isMesh) {
                toSell.set(o.uuid, "worldModels/worn_t-shirt/scene.gltf");
                shouldrotate.set(o.uuid, gltf.scene);
            }
        });
        groupmap.set(gltf.scene, false);
    })
    var bmx;
    var loader = new GLTFLoader();
    loader.load("worldModels/bmx/scene.gltf", function (gltf) {
        bmx = gltf.scene;
        bmx.position.set(-275, 38, 986);
        bmx.scale.set(0.40, 0.40, 0.40);
        // bmx.rotateY(Math.PI / 2);
        scene.add(gltf.scene);
        gltf.scene.traverse(o => {
            if (o.isMesh) {
                toSell.set(o.uuid, "worldModels/bmx/scene.gltf");
                shouldrotate.set(o.uuid, gltf.scene);
            }
        });
        groupmap.set(gltf.scene, false);
    })
    var mountain_bike;
    var loader = new GLTFLoader();
    loader.load("worldModels/mountain_bike/scene.gltf", function (gltf) {
        mountain_bike = gltf.scene;
        mountain_bike.position.set(-175, 28, 986);
        mountain_bike.scale.set(30, 30, 30);
        mountain_bike.rotateY(Math.PI / 2);
        scene.add(gltf.scene);
        gltf.scene.traverse(o => {
            if (o.isMesh) {
                toSell.set(o.uuid, "worldModels/mountain_bike/scene.gltf");
                shouldrotate.set(o.uuid, gltf.scene);
            }
        });
        groupmap.set(gltf.scene, false);
    })
}
function loadMove(j) {
    var loaderr = new GLTFLoader();
    loaderr.load('/worldModels/moveIdle.glb',
        function (gltf) {
            loaded = true;
            if (j == username) {
                writeUserData();
                document.getElementById("textb").innerText = "";
            }
            shouldMove.set(j, false);
            let moveAnim = THREE.AnimationClip.findByName(gltf.animations, 'Armature|mixamo.com|Layer0');
            let moveClip = Amixers.get(j).clipAction(moveAnim);
            moveClipA.set(j, moveClip);
            moveClipA.get(j).reset();
            // moveClipA.get(j).play();
        },
        undefined,
        function (error) {
            console.error(error);
        }
    );
}
function loadIdle(j) {
    var loaderr = new GLTFLoader();
    loaderr.load('/worldModels/standIdle.glb',
        function (gltf) {
            let moveAnim = THREE.AnimationClip.findByName(gltf.animations, 'Armature|mixamo.com|Layer0');
            let idleClip = Amixers.get(j).clipAction(moveAnim);
            idleClipA.set(j, idleClip);
            // idle.setLoop(THREE.LoopOnce);
            idleClipA.get(j).reset();
            idleClipA.get(j).play();
            loadMove(j);
        },
        undefined,
        function (error) {
            console.error(error);
        }
    );
}
function myAvatar(x, z, j, r) {
    var loader = new GLTFLoader();
    loader.load('/worldModels/Remy.glb',
        function (gltf) {
            let avatar = gltf.scene;
            avatar.traverse(o => {
                if (o.isBone) {
                }
                if (o.isMesh) {
                    o.castShadow = true;
                    o.receiveShadow = true;
                }
            });
            characters.set(j, avatar);
            characters.get(j).scale.set(12, 12, 12);
            characters.get(j).position.y = 2;
            if (x != null) {
                characters.get(j).position.x = x;
                characters.get(j).position.z = z;
            }
            worl.scene.add(characters.get(j));
            if (r != null) {
                characters.get(j).rotation.y = r;
            }

            mixer = new THREE.AnimationMixer(characters.get(j));
            Amixers.set(j, mixer);
            loadIdle(j);
        },
        function (xhr) {
            if (j == username) {
                writeUserData();
                let pc = Math.floor(xhr.loaded / xhr.total * 100);
                document.getElementById("textb").innerText = "loading models " + pc + "% ...";
            }
        },
        undefined,
        function (error) {
            console.error(error);
        }
    );
}
function changePos(j, vel) {
    if (loaded) {
        var dir = new THREE.Vector3();
        characters.get(j).getWorldDirection(dir);
        var pos = new THREE.Vector3();
        characters.get(j).getWorldPosition(pos);
        var cam = new THREE.Vector3();
        worl.camera.getWorldDirection(cam);
        var camp = new THREE.Vector3();
        worl.camera.getWorldPosition(camp);
        let costh = (dir.x * cam.x + dir.z * cam.z) / ((dir.x ** 2 + dir.z ** 2) * (cam.x ** 2 + cam.z ** 2)) ** 0.5;
        var x = vel * dir.x + pos.x;
        var z = vel * dir.z + pos.z;
        characters.get(j).position.set(x, pos.y, z);
        if (j == username) {
            worl.orbitCon.target = pos;
            if (costh > 0) {
                x = vel * cam.x + camp.x;
                z = vel * cam.z + camp.z;
            }
            else {
                x = -vel * cam.x + camp.x;
                z = -vel * cam.z + camp.z;
            }
            worl.camera.position.set(x, camp.y, z);
        }
    }
}
function update() {
    // groupmap.forEach(function (value, key) {
    //     if (value) {
    //         if (key)
    //             key.rotation.y += 0.05;
    //     }
    // }
    // )
    if (worldVisible) {
        worl.update();
        requestAnimationFrame(update);
    }
    shouldMove.forEach(function (value, key) {
        if (value) {
            changePos(key, 1.5);
        }
    })
    Amixers.forEach(function (value, key) {
        if (value) {
            let scl = 80;
            const dlta = clock.getDelta();
            if (key == username) scl = 1;
            value.update(scl * dlta);
        }
    })
    if (loaded) {
        var cdir = new THREE.Vector3();
        characters.get(username).getWorldDirection(cdir);
        var cpos = new THREE.Vector3();
        characters.get(username).getWorldPosition(cpos);
        if (cdir.x != dir.x || cdir.y != dir.y || cdir.z != dir.z || cpos.x != pos.x || cpos.y != pos.y || cpos.z != pos.z) {
            if (shouldupload) {
                shouldupload = false;
                characters.get(username).getWorldDirection(dir);
                characters.get(username).getWorldPosition(pos);
                writeUserData();
            }
        }
    }

}
function startW(j) {
    if (!shouldMove.get(j)) {
        shouldMove.set(j, true);
        moveClipA.get(j).reset();
        idleClipA.get(j).fadeOut(0.1);
        moveClipA.get(j).play();
    }
    writeUserData();
}
function stopW(j) {
    if (shouldMove.get(j)) {
        shouldMove.set(j, false);
        idleClipA.get(j).reset();
        moveClipA.get(j).fadeOut(0.2);
        idleClipA.get(j).play();
    }
    writeUserData();
}
function delet(j) {
    worl.scene.remove(characters.get(j));
    characters.delete(j);
    Amixers.delete(j);
    idleClipA.delete(j);
    moveClipA.delete(j);
    shouldMove.delete(j);
    if (j == username) {
        loaded = false;
        shouldupload = false;
    }
}
function gotocart() {
    window.open("cart.html");
}
function writeMes(str, b) {
    let dd = '';
    if (b==username) {
        dd = '<div class="d-flex flex-row justify-content-end mb-2"><div class="p-2 me-1 border" style="border-radius: 15px; background-color: #fbfbfb;"><p class="small mb-0">';
    } else {
        dd = '<div class="d-flex flex-row justify-content-start mb-2"><div class="p-2 ms-1" style="border-radius: 15px; background-color: rgba(57, 192, 237,.2);"><h6 style="color:brown; font-size:10px; margin:1px;padding:1px;">'+b+'</h6><p class="small mb-0">';
    }
    dd += (str + '</p></div></div>');
    return dd;
}

// Key event
function sendM() {
    var str = inp.value.trim();
    if(str.length==0) return;
    inp.value = '';
    const d = new Date();
    llld = false;
    if (loaded) {
        set(ref(database, 'chats/' + d.getTime()), {
            from: username,
            msg: str
        }).then(() => {
        }).catch((error) => {
            console.log(error);
        });
    }
    else {
        console.log('failed');
    };
}
function hideM() {
    if (llld) {
        document.getElementById("chats").style.display = 'none';
        llld = false;
        hidec.innerText = 'Show';
        document.getElementById("ttt").style.height = "20%";
    }
    else{
        document.getElementById("chats").style.display = 'block';
        document.getElementById('asd').scrollTop = document.getElementById('asd').scrollHeight;
        llld = true;
        hidec.innerText = 'Hide';
        document.getElementById("ttt").style.height = "80%";
    }
}
function keyPressed(event) {
    // console.log(event.keyCode);
    if (event.keyCode == 38 ) {
        startW(username);
        shouldMove.set(username, true);
    }
    if (event.keyCode == 37 ) {  // left
        characters.get(username).rotation.y += 0.3;
    }
    if (event.keyCode == 39 ) {
        characters.get(username).rotation.y -= 0.3;
    }
}
function keyReleased(event) {
    if (event.keyCode == 38 ) {
        stopW(username);
        shouldMove.set(username, false);
    }
}
function hoverPieces(camera, scene) {
    raycaster.setFromCamera(pointer, camera);
    var intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {

        // var targetDistance = intersects[0].distance;

        // camera.focusAt(targetDistance); // using Cinematic camera focusAt method

        if (INTERSECTED != intersects[0].object) {
            INTERSECTED = intersects[0].object;
            // INTERSECTED.material.transparent = true;
            // INTERSECTED.material.opacity = 0.5;
            var uud = INTERSECTED.uuid;
            if (toSell.has(uud)) {
                console.log(toSell.get(uud));
                sessionStorage.setItem('item', toSell.get(uud));
                window.open("details.html");
            }
        }
    }
    // else {

    //     if (INTERSECTED) {
    //         INTERSECTED.material.transparent = false;
    //         INTERSECTED.material.opacity = 1;
    //     }
    //     INTERSECTED = null;
    // }
}
function hoverPieces2(camera, scene) {
    raycaster.setFromCamera(pointer, camera);
    var intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        if (INTERSECTED != intersects[0].object) {
            if (INTERSECTED) {
                groupmap.set(shouldrotate.get(INTERSECTED.uuid), false);
            }
            INTERSECTED = intersects[0].object;
            var uud = INTERSECTED.uuid;
            if (toSell.has(uud)) {
                groupmap.set(shouldrotate.get(uud), true);
            }
        }
    }
}
function onClick(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
    hoverPieces(worl.camera, worl.scene);

}
function onPointerMove(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
    hoverPieces2(worl.camera, worl.scene);
}

window.addEventListener("click", onClick, false);
// window.addEventListener("pointermove", onPointerMove, false);
window.addEventListener("keydown", keyPressed);
window.addEventListener("keyup", keyReleased);
document.getElementById('usern').innerText = 'Welcome ' + username;
document.getElementById('gotoCart').onclick = gotocart;
sendc.onclick = sendM;
hidec.onclick = hideM;

// setting world and avatar
myAvatar(null, null, username, null);
var worl = new world();
hideM();
addToWorld(worl.scene);
update();

// communication with server
function writeUserData() {
    if (loaded) {
        var status = 0;
        if (shouldMove.get(username)) status = 1;
        characters.get(username).getWorldPosition(pos);
        set(ref(database, 'users/' + username), {
            id: username,
            x: pos.x,
            y: pos.y,
            z: pos.z,
            wy: characters.get(username).rotation.y,
            status: status
        }).then(() => {
            // attachF();
            shouldupload = true;
            var sec = new Date();
            psec = sec.getSeconds();
            console.log("uploaded");
        })
            .catch((error) => {
                console.log(error);
            });
    }
    else shouldupload = true;
}
function attachF() {
    const starCountRef = ref(database, 'users/');
    onValue(starCountRef, (snapshot) => {
        snapshot.forEach(function (childr) {
            var id = childr.child("id").val();
            if (id == username) {
                return;
            }
            var sts = childr.child("status").val();
            var rot = childr.child("wy").val();
            var xx = childr.child("x").val();
            var zz = childr.child("z").val();
            if (characters.has(id)) {
                characters.get(id).position.x = xx;
                characters.get(id).position.z = zz;
                characters.get(id).rotation.y = rot;
                if (sts == 1) {
                    startW(id);
                }
                else {
                    stopW(id);
                }
            }
            else {
                myAvatar(xx, zz, id, rot);
            }
        })
        shouldupload = true;
    });
}
function listenMsg() {
    const starCountRef = ref(database, 'chats');
    onValue(starCountRef, (snapshot) => {

        let msggs = new Map();
        snapshot.forEach(function (childr) {
            var id = childr.child("msg").val();
            var uu = childr.child("from").val();
            if (!msggs.has(childr.key)) {
                // writeMes(id, uu == username);
                msggs.set(childr.key, writeMes(id, uu));
            }
        })
        document.getElementById('asd').innerHTML = '';
        var txtt = '';
        msggs.forEach(function (value, key) {
            // document.getElementById('asd').insertAdjacentHTML('afterend', value);
            txtt += value;
        })
        document.getElementById('asd').innerHTML = txtt;
        document.getElementById('asd').scrollTop = document.getElementById('asd').scrollHeight;
    });
}

const presenceRef = ref(database, 'users/' + username);
onDisconnect(presenceRef).remove();
// const presenceRe = ref(database, 'chats/' + username);
// onDisconnect(presenceRe).hideM();
attachF();
listenMsg();
