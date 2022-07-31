
let username = sessionStorage.getItem("username");
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

let prices = new Map(),
    names = new Map(),
    descri = new Map(),
    inrHTM = '';

function dispd(k, inr) {
    var sst;

    // sst = '<a href="#" class="list-group-item list-group-item-action flex-column align-items-start" id="'+k+'"; style=" position: relative; width: 99%; margin: 8px; border-radius: 20px; border-style: solid; border-color: rgb(88, 160, 244);  " ><div class="d-flex w-100 justify-content-between" style="border: #39c0ed;"><h5 class="mb-1">' +
    sst =    '<a href="#" class="list-group-item list-group-item-action flex-column align-items-start" style="position: absolute; left:1; width: 93%; margin-top: 8px; margin-right:60px; border-radius: 20px;border-style: solid; border-color: rgb(88, 160, 244);" id="'+k+'"><div class="d-flex w-100 justify-content-between" style="border: #39c0ed;"><h5 class="mb-1">'+ 
        names.get(k)
        + '</h5><small>' +
        prices.get(k)
        + '</small></div><small>' +
        descri.get(k)
        + '</small></a>';

    console.log(k);
    console.log(inr);
    inr = inr + sst;
    console.log(inr);
}
function mapss() {

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

    prices.set("worldModels/vestido_anos_50/scene.gltf", '596 Rs.');
    names.set("worldModels/vestido_anos_50/scene.gltf", 'Women Fit and Flare Red');
    descri.set("worldModels/vestido_anos_50/scene.gltf", "Machine wash warm wash with like colours only non-chlorine bleach when needed tumble dry low warm iron if needed.");

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

}
function attachF() {
    let ss = 'Cart/' + username;
    const starCountRef = ref(database, ss);
    var vv = true;

    onValue(starCountRef, (snapshot) => {
        snapshot.forEach(function (childr) {
            document.getElementById('herr').innerHTML = '';
            childr.forEach(function (chh) {
                let k = chh.child('obb').val();
                
                var sst;
                sst = '<a href="#" onClick="reply_click(this.id)" id="' + k + '" class="list-group-item list-group-item-action flex-column align-items-start"><div class="d-flex w-100 justify-content-between"><h5 class="mb-1">' +
                    names.get(k)
                    + '</h5><small>' +
                    prices.get(k)
                    + '</small></div><small>' +
                    descri.get(k)
                    + '</small></a>';
                document.getElementById('herr').insertAdjacentHTML('afterend', sst);
                vv = false;
            })
            if (vv) {
                document.getElementById('herr').innerHTML = '<center>empty</center>';
            }
        })
    });
}


mapss();
attachF();