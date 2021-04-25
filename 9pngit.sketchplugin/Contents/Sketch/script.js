var l = function(str) {
    log("9pngit: " + str)
}
var str = function(obj) {
    return JSON.stringify(obj)
}
var onRun = function(context) {
	console.log('This is an example Sketch script.')

	var sketch 	    = require('sketch')
	var ui          = require("sketch/ui")
    var Rectangle   = require('sketch/dom').Rectangle
    var Group       = require('sketch/dom').Group
    var Artboard    = require('sketch/dom').Artboard
    var Shape       = require('sketch/dom').Shape
    l("shape: " + str(Shape));

	//ui.message("wazzzup!")

	var document = sketch.getSelectedDocument()
	
	var selectedLayers = document.selectedLayers
	var selectedCount = selectedLayers.length

	if (selectedCount === 0) {
        ui.message('No layers are selected.')
	} else if (selectedCount > 1) {
        console.log('Too many layers:');
        selectedLayers.forEach(function (layer, i) {
            console.log((i) + ': ' + layer.name + ", id: " + layer.id + ", " + JSON.stringify(layer))
        })
        ui.message('Select 1 Artboard. Selected: ' + selectedCount)
    } else {
        console.log("selected 1: " + JSON.stringify(selectedLayers))
        var artProto = selectedLayers.layers[0]
        console.log("artProto: " + JSON.stringify(artProto))
        
        if (artProto.type !== "Artboard") {
            ui.message("Select an artboard! Selected: " + artProto.type)
            return
        }
        ui.message("Working on: " + artProto.name)
        l("processing " + str(artProto))

        l("grpContent: " + str(grpContent))
        l("artProto  : " + str(artProto))
        
        var art2 = new Artboard({
            parent: artProto.parent,
            name: artProto.name + ".9",
            flowStartPoint: true,
            frame : artProto.frame,
        })

        var layersDup = []
        l("layersDup: " + str(layersDup));
        var protoLayers = artProto.layers.forEach(function(layer, i) {
            layersDup.push(layer.duplicate())
        });
        l("layersDup: " + str(layersDup));

        var grpContent = new Group({
            parent : art2,
            name : ".content",
            layers: layersDup,
            frame : {x:0, y:0, width:artProto.frame.width, height:artProto.frame.height},
        });

        var mask = new Shape({
            parent : grpContent,
            name : ".mask",
            frame : {x:0, y:0, width:grpContent.frame.width, height:grpContent.frame.height},
        });
        mask.sketchObject.hasClippingMask = true;
        mask.sketchObject.clippingMaskMode = 0;
        mask.moveToBack();
        l("mask: " + str(mask))

        var left = new Shape({
            parent : art2,
            name : "left",
            frame : {x:0, y:0, width: 1, height: art2.frame.height},
            style : {
                fills: ['#000000'],
                borders: []
            }
        });

        
        art2.frame.y += artProto.frame.height + 20;
        art2.frame.width    = art2.frame.width * 2 + 2;
        art2.frame.height   = art2.frame.height * 2 + 2;

        l("art2      : " + str(art2))

    }

};
