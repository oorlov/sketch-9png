const sketch    = require('sketch')
const ui        = require("sketch/ui")
const Rectangle = require('sketch/dom').Rectangle
const Group     = require('sketch/dom').Group
const Artboard  = require('sketch/dom').Artboard
const Shape     = require('sketch/dom').Shape
const ShapePath = require('sketch/dom').ShapePath

function l(str) {
    var time = new Date();
    log("" + time.toISOString().substring(0, 23) + " 9pngit| " + str)
}

function str(obj) {
    return JSON.stringify(obj)
}

function onRun(context) {
	l(" --- onRun --- ");
	
    var document = sketch.getSelectedDocument();
	
	var selectedLayers = document.selectedLayers;
	var selectedCount = selectedLayers.length;

	if (selectedCount === 0) {
        ui.message('No layers are selected.');
        return;
    }
	if (selectedCount > 1) {
        console.log('Too many layers:');
        selectedLayers.forEach(function (layer, i) {
            console.log((i) + ': ' + layer.name + ", id: " + layer.id + ", " + JSON.stringify(layer));
        });
        ui.message('Select 1 Artboard. Selected: ' + selectedCount);
        return;
    } 
    if (selectedLayers.layers[0].type !== "Artboard") {
        ui.message("Select an artboard! Selected: " + selectedLayers.layers[0].type);
        return
    }
    ui.message("Working on: " + selectedLayers.layers[0].name)

    // in native context
    var layer = context.selection[0];
    var layer2 = layer.duplicate();
    layer2.multiplyBy(2);
    var layer4 = layer.duplicate();
    layer4.multiplyBy(4);
    // in JS context
    const jsLayer   = sketch.fromNative(layer);
    const jsLayer2  = sketch.fromNative(layer2);
    const jsLayer4  = sketch.fromNative(layer4);
    
    l("jsLayer:  " + str(jsLayer));
    l("jsLayer2: " + str(jsLayer2));
    l("jsLayer4: " + str(jsLayer4));
    jsLayer2.frame.x = jsLayer.frame.x;
    jsLayer2.frame.y = jsLayer.frame.y + jsLayer.frame.height + 20;
    jsLayer4.frame.x = jsLayer.frame.x;
    jsLayer4.frame.y = jsLayer2.frame.y + jsLayer2.frame.height + 20;

    wrap9png(jsLayer2, 2, "drawable-xhdpi/");
    add9pngLayers(jsLayer2, 4);
    wrap9png(jsLayer4, 4, "drawable-xxxhdpi/");
    add9pngLayers(jsLayer4, 8);
    
};

function wrap9png(artboard, patchSize, exportPrefix) {
    artboard.name = artboard.name + ".9";
    artboard.frame.width = artboard.frame.width + 2;
    artboard.frame.height = artboard.frame.height + 2;
    artboard.exportFormats = [{
      fileFormat: "png",
      prefix:     exportPrefix,
      size:       "1x",
      type:       "ExportFormat"
    }];
}

function add9pngLayers(art2, patchSize) {
    
    var layersOrigs = [];
    var protoLayers = art2.layers.forEach(function(layer, i) {
        layersOrigs.push(layer);
    });

    // content group with mask overlay
    var grpContent = new sketch.Group({
        parent : art2,
        name : "9_content",
        frame : {x:1, y:1, width:art2.frame.width-2, height:art2.frame.height-2},
    });
    l("grpContent  s: " + str(grpContent))
    
    grpContent.layers = layersOrigs;

    l("art2         : " + str(art2))

    // setup mask
    var mask = new ShapePath({
        parent : grpContent,
        name : "9_mask",
        frame : {x:0, y:0, width:grpContent.frame.width, height:grpContent.frame.height},
    });
    mask.sketchObject.hasClippingMask = true;
    mask.sketchObject.clippingMaskMode = 0;
    mask.moveToBack();
    l("mask         : " + str(mask))
    l("grpContent   : " + str(grpContent))    

    var left = new ShapePath({
        parent : art2,
        name : "9_left",
        frame : {x: 0, y: (grpContent.frame.height / 2) - (patchSize / 2) + 1/*trans*/, width: 1, height: patchSize},
        style : { fills: ['#000000'], borders: [] }
    });

    var top = new ShapePath({
        parent : art2,
        name : "9_top",
        frame : {x: (grpContent.frame.width / 2) - (patchSize / 2) + 1/*trans*/, y: 0, width: patchSize, height: 1},
        style : { fills: ['#000000'], borders: [] }
    });

    var right = new ShapePath({
        parent : art2,
        name : "9_right",
        frame : {x: grpContent.frame.width + 1/*trans*/, y: 1, width: 1, height: grpContent.frame.height},
        style : { fills: ['#000000'], borders: [] }
    });

    var bottom = new ShapePath({
        parent : art2,
        name : "9_bottom",
        frame : {x: 1, y: grpContent.frame.height + 1/*trans*/, width: grpContent.frame.width, height: 1},
        style : { fills: ['#000000'], borders: [] }
    });
    
    l("art2        f: " + str(art2))

    return art2;

}

function testRect() {
    var testRect = new sketch.ShapePath({
        name : "9_test",
        frame : {x:0, y:0, width: 8, height: 8},
        shapeType: "Rectangle",
        style : {
            fills: ['#abcdef'],
            borders: []
        }
    });
    var testRects = [ testRect ];
    l("testRect     : " + str(testRect));
    l("testRects    : " + str(testRects));

}
