const sketch    = require('sketch')
const ui        = require("sketch/ui")
const Rectangle = require('sketch/dom').Rectangle
const Group     = require('sketch/dom').Group
const Artboard  = require('sketch/dom').Artboard
const Shape     = require('sketch/dom').Shape
const ShapePath = require('sketch/dom').ShapePath

var l = function(str) {
    var time = new Date();
    log("" + time.toISOString().substring(0, 23) + " 9pngit| " + str)
}

var str = function(obj) {
    return JSON.stringify(obj)
}

var onRun = function(context) {
	console.log('This is an example Sketch script.')
    
    l("shape: " + str(Shape));

	var document = sketch.getSelectedDocument()
	
	var selectedLayers = document.selectedLayers
	var selectedCount = selectedLayers.length

	if (selectedCount === 0) {
        ui.message('No layers are selected.')
        return;
    }
	if (selectedCount > 1) {
        console.log('Too many layers:');
        selectedLayers.forEach(function (layer, i) {
            console.log((i) + ': ' + layer.name + ", id: " + layer.id + ", " + JSON.stringify(layer))
        })
        ui.message('Select 1 Artboard. Selected: ' + selectedCount)
        return;
    } 

    // do the job
    l(" --- onRun --- ")
    var artProto = selectedLayers.layers[0]
    if (artProto.type !== "Artboard") {
        ui.message("Select an artboard! Selected: " + artProto.type)
        return
    }
    ui.message("Working on: " + artProto.name)
    l("artProto     : " + str(artProto))

    var art2 = build9png(artProto, 2, 4);
    art2.frame.y = artProto.frame.y + artProto.frame.height + 20;
    var art4 = build9png(artProto, 4, 8);
    art4.frame.y = artProto.frame.y + artProto.frame.height + 20 + art2.frame.height + 20;

};

var build9png = function(artProto, scale, patchSize) {
    
    // duplicate source layers
    var layersDup = []
    var protoLayers = artProto.layers.forEach(function(layer, i) {
        layersDup.push(layer.duplicate())
    });
    l("layersDup    : " + str(layersDup));

    // making artboard
    var art2 = new Artboard({
        parent: artProto.parent,
        name: artProto.name + ".9",
        flowStartPoint: true,
        frame : {
            x:      artProto.frame.x,
            y:      artProto.frame.y + artProto.frame.height,
            width:  artProto.frame.width * scale + 2,
            height: artProto.frame.height * scale + 2
        },
    })
    l("art2         : " + str(art2))

    // content group with mask overlay
    var grpContent = new sketch.Group({
        parent : art2,
        name : "9_content",
        frame : {x:0, y:0, width:artProto.frame.width, height:artProto.frame.height},
    });
    grpContent.layers = layersDup;

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

    // content is ready
    // - zoom
    // - translate
    grpContent.frame.width *= scale;
    grpContent.frame.height *= scale;
    grpContent.frame.x = 1;
    grpContent.frame.y = 1;
    l("grpContent  s: " + str(grpContent))

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

var testRect = function() {
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
