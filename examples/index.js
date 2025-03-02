var canvas = document.getElementById("canvas");

var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});

var scene = new THREE.Scene();
scene.background = new THREE.Color(0.4, 0.4, 0.4);

var sky = createSky();
scene.add(sky);
var providers = createProviders();

function createProviders() {
    var DEV_MAPBOX_API_KEY = document.getElementById("mapbox_api").value;
    var DEV_HEREMAPS_APP_ID = document.getElementById("heremaps_id").value;;
    var DEV_HEREMAPS_APP_CODE = document.getElementById("heremaps_code").value;
    var DEV_BING_API_KEY = document.getElementById("bing_api").value;
    var DEV_MAPTILER_API_KEY = document.getElementById("maptiler_api").value;
    var OPEN_MAP_TILES_SERVER_MAP = document.getElementById("openmap_tiles_server").value;

    return [
        ["Vector OpenSteet Maps", new Geo.OpenStreetMapsProvider(),],
        ["Vector OpenTile Maps", new Geo.OpenMapTilesProvider(OPEN_MAP_TILES_SERVER_MAP)],
        ["Vector Map Box", new Geo.MapBoxProvider(DEV_MAPBOX_API_KEY, "mapbox/streets-v10", Geo.MapBoxProvider.STYLE)],
        ["Vector Here Maps", new Geo.HereMapsProvider(DEV_HEREMAPS_APP_ID, DEV_HEREMAPS_APP_CODE, "base", "normal.day")],
        ["Vector Here Maps Night", new Geo.HereMapsProvider(DEV_HEREMAPS_APP_ID, DEV_HEREMAPS_APP_CODE, "base", "normal.night")],
        ["Vector Here Maps Terrain", new Geo.HereMapsProvider(DEV_HEREMAPS_APP_ID, DEV_HEREMAPS_APP_CODE, "aerial", "terrain.day")],
        ["Vector Bing Maps", new Geo.BingMapsProvider(DEV_BING_API_KEY, Geo.BingMapsProvider.ROAD)],
        ["Vector Map Tiler Basic", new Geo.MapTilerProvider(DEV_MAPTILER_API_KEY, "maps", "basic", "png")],
        ["Vector Map Tiler Outdoor", new Geo.MapTilerProvider(DEV_MAPTILER_API_KEY, "maps", "outdoor", "png")],	
        ["Satellite Map Box", new Geo.MapBoxProvider(DEV_MAPBOX_API_KEY, "mapbox.satellite", Geo.MapBoxProvider.MAP_ID, "jpg70", false)],
        ["Satellite Map Box Labels", new Geo.MapBoxProvider(DEV_MAPBOX_API_KEY, "mapbox/satellite-streets-v10", Geo.MapBoxProvider.STYLE, "jpg70")],
        ["Satellite Here Maps", new Geo.HereMapsProvider(DEV_HEREMAPS_APP_ID, DEV_HEREMAPS_APP_CODE, "aerial", "satellite.day", "jpg")],
        ["Satellite Bing Maps", new Geo.BingMapsProvider(DEV_BING_API_KEY, Geo.BingMapsProvider.AERIAL)],
        ["Satellite Maps Tiler Labels", new Geo.MapTilerProvider(DEV_MAPTILER_API_KEY, "maps", "hybrid", "jpg")],
        ["Satellite Maps Tiler", new Geo.MapTilerProvider(DEV_MAPTILER_API_KEY, "tiles", "satellite", "jpg")],
        ["Height Map Box", new Geo.MapBoxProvider(DEV_MAPBOX_API_KEY, "mapbox.terrain-rgb", Geo.MapBoxProvider.MAP_ID, "pngraw")],
        ["Height Map Tiler", new Geo.MapTilerProvider(DEV_MAPTILER_API_KEY, "tiles", "terrain-rgb", "png")],
        ["Debug Height Map Box", new Geo.HeightDebugProvider(new Geo.MapBoxProvider(DEV_MAPBOX_API_KEY, "mapbox.terrain-rgb", Geo.MapBoxProvider.MAP_ID, "pngraw"))],
        ["Debug", new Geo.DebugProvider()]
    ];
}

var modes = [
    ["Planar", Geo.MapView.PLANAR],
    ["Height", Geo.MapView.HEIGHT],
    // ["Martini", Geo.MapView.MARTINI],
    ["Height Shader", Geo.MapView.HEIGHT_SHADER],
    ["Spherical", Geo.MapView.SPHERICAL]
];

var lods = [
    ["Raycast", Geo.LODRaycast],
    ["Frustum", Geo.LODFrustum],
    ["Radial", Geo.LODRadial]
];

var ids = ["mapbox_api", "heremaps_id", "heremaps_code", "bing_api", "maptiler_api", "openmap_tiles_server"];
for(var i = 0; i < ids.length; i++) {
    var box = document.getElementById(ids[i]);
    box.onchange = function(event)
    {
        providers = createProviders();
        scene.remove(map);
        map = new Geo.MapView(modes[mode.selectedIndex][1], providers[providerColor.selectedIndex][1], providers[providerHeight.selectedIndex][1]);
        scene.add(map);
    };
}

var lod = document.getElementById("lod");
lod.onchange = function(event)
{
    if(map !== undefined)
    {
        map.lod = new lods[lod.selectedIndex][1]();
    }
};
for(var i = 0; i < lods.length; i++)
{
    var option = document.createElement("option");
    option.innerHTML = lods[i][0];
    lod.appendChild(option);
}

var mode = document.getElementById("mode");
mode.onchange = function(event)
{
    if(map !== undefined)
    {
        scene.remove(map);
        map = new Geo.MapView(modes[mode.selectedIndex][1], providers[providerColor.selectedIndex][1], providers[providerHeight.selectedIndex][1]);
        scene.add(map);
    }
};
for(var i = 0; i < modes.length; i++)
{
    var option = document.createElement("option");
    option.innerHTML = modes[i][0];
    option.value = modes[i][1];
    mode.appendChild(option);
}

var providerColor = document.getElementById("providerColor");
providerColor.onchange = function(event)
{
    if(map !== undefined)
    {
        map.setProvider(providers[event.target.selectedIndex][1]);
    }
};
for(var i = 0; i < providers.length; i++)
{
    var option = document.createElement("option");
    option.innerHTML = providers[i][0];
    providerColor.appendChild(option);
}

var providerHeight = document.getElementById("providerHeight");

providerHeight.onchange = function(event)
{
    if(map !== undefined)
    {
        map.setHeightProvider(providers[event.target.selectedIndex][1]);
    }
};
for(var i = 0; i < providers.length; i++)
{
    var option = document.createElement("option");
    option.innerHTML = providers[i][0];
    providerHeight.appendChild(option);
}

mode.selectedIndex = 0;
providerColor.selectedIndex = 12;
providerHeight.selectedIndex = 15;

var map = new Geo.MapView(modes[mode.selectedIndex][1], providers[providerColor.selectedIndex][1], providers[providerHeight.selectedIndex][1]);
scene.add(map);
map.updateMatrixWorld(true);

var camera = new THREE.PerspectiveCamera(80, 1, 0.1, 1e12);

var controls = new THREE.MapControls(camera, canvas);
controls.minDistance = 1e1;
controls.zoomSpeed = 2.0;

var coords = Geo.UnitsUtils.datumsToSpherical(40.940119, -8.535589);
controls.target.set(coords.x, 0, -coords.y);
camera.position.set(0, 1000, 0);

scene.add(new THREE.AmbientLight(0x777777));

var directional = new THREE.DirectionalLight(0x888888);
directional.position.set(100, 10000, 700);
scene.add(directional);

document.body.onresize = function()
{
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}
document.body.onresize();

function animate()
{
    requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);
}
animate();

function createSky()
{
    // Add Sky
    var sky = new THREE.Sky();
    sky.scale.setScalar(1e8);

    // GUI
    var effectController = {
        turbidity: 0,
        rayleigh: 0.5,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.7,
        inclination: 0.48,
        azimuth: 0.25,
        exposure: 0.5
    };

    const uniforms = sky.material.uniforms;
    uniforms["turbidity"].value = effectController.turbidity;
    uniforms["rayleigh"].value = effectController.rayleigh;
    uniforms["mieCoefficient"].value = effectController.mieCoefficient;
    uniforms["mieDirectionalG"].value = effectController.mieDirectionalG;

    var theta = Math.PI * (effectController.inclination - 0.5);
    var phi = 2 * Math.PI * (effectController.azimuth - 0.5);

    var sun = new THREE.Vector3();
    sun.x = Math.cos(phi);
    sun.y = Math.sin(phi) * Math.sin(theta);
    sun.z = Math.sin(phi) * Math.cos(theta);
    uniforms["sunPosition"].value.copy(sun);

    return sky;
}
