import {
  AR,
  ARLoadedEventData,
  ARNodeInteraction,
  ARPlaneDetectedEventData,
  ARPlaneTappedEventData,
  ARSceneTappedEventData,
  ARTrackingFaceEventData,
  ARTrackingImageDetectedEventData
} from 'nativescript-ar';
import { Color } from 'tns-core-modules/color';
import * as observable from 'tns-core-modules/data/observable';
import * as pages from 'tns-core-modules/ui/page';
import { isIOS } from 'tns-core-modules/ui/page';
import { HelloWorldModel } from './main-view-model';

const flashlight = require("nativescript-flashlight");

declare const NSBundle: any;

let ar: AR;
let model: HelloWorldModel;

// Event handler for Page 'loaded' event attached in main-page.xml
export function pageLoaded(args: observable.EventData) {
  // Get the event sender
  const page = <pages.Page>args.object;
  model = new HelloWorldModel();
  model.screenshot = page.getViewById("screenshot");
  page.bindingContext = model;

  if (isIOS) {
    const flashlightSwitch = page.getViewById("flashlightSwitch");
    flashlightSwitch.on("checkedChange", (args: any) => {
      args.value ? flashlight.on() : flashlight.off();
    });
  }
}

export function arLoaded(args: ARLoadedEventData): void {
  ar = args.object;
  model.ar = ar;

  // add some stuff to the scene
  /*
  setTimeout(() => {
    args.object.addModel({
      name: "Models.scnassets/Car.dae",
      position: {
        x: 0,
        y: 0,
        z: -1
      },
      rotation: {
        x: 0,
        y: 180, // face towards camera
        z: 0
      },
      scale: 0.1,
      onTap: node => console.log("model tapped: " + node.id)
    });
  }, 1000);

  args.object.addBox({
    position: {
      x: -0.5,
      y: -0.5,
      z: -1
    },
    dimensions: {
      x: 0.25,
      y: 0.25,
      z: 0.52
    },
    materials: [{
      diffuse: {
        contents: "Assets.scnassets/Materials/tnsgranite/tnsgranite-diffuse.png",
        wrapMode: "ClampToBorder"
      }
    }],
    onTap: node => console.log("box tapped: " + node.id),
    // onLongPress: node => console.log("box longpressed: " + node.id),
    draggingEnabled: true,
    rotatingEnabled: true
    // onPan: node => console.log("box panned: " + node.id),
  }).then(node => console.log("box added: " + node.id));

  args.object.addText({
    text: "NativeScript",
    position: {
      x: 2.7,
      y: -0.2,
      z: -4
    },
    scale: 0.1,
    depth: 1,
    materials: [new Color("blue")],
    rotation: {
      x: 5,
      y: 5,
      z: 5
    },
    onTap: node => console.log("text tapped: " + node.id),
    // onPan: node => console.log("text panned: " + node.id),
  }).then(node => console.log("text added: " + node.id));

  args.object.addText({
    text: "is COOL",
    position: {
      x: 2.7,
      y: -1,
      z: -5
    },
    scale: 0.1,
    depth: 1,
    materials: [new Color("blue")],
    rotation: {
      x: 5,
      y: 5,
      z: 5
    },
    onTap: node => console.log("text tapped: " + node.id),
  }).then(node => console.log("text added: " + node.id));

  args.object.addTube({
    position: {
      x: 0.3,
      y: 0.3,
      z: -1.2
    },
    innerRadius: 0.1,
    outerRadius: 0.15,
    height: 0.2,
    materials: [{
      diffuse: {
        contents: "Assets.scnassets/Materials/tnsgranite/tnsgranite-diffuse.png",
        wrapMode: "Repeat" // which is the default
      },
      roughness: "Assets.scnassets/Materials/tnsgranite/tnsgranite-roughness.png",
      transparency: 1 // solid (which is the default)
    }],
    rotation: {
      x: 20,
      y: 0,
      z: 0
    },
    onTap: node => console.log("tube tapped: " + node.id),
  }).then(node => console.log("tube added: " + node.id));
  */
}

export function trackingFaceDetected(args: ARTrackingFaceEventData): void {
  if (args.properties) {
    console.log(JSON.stringify(args.properties));
  }

  if (args.faceTrackingActions) {

    let textModel;

    setTimeout(() => {
      args.faceTrackingActions.addText({
        text: "Ray-Ban model S",
        depth: 0.3,
        materials: [new Color("red")],
        scale: {
          x: 0.002,
          y: 0.002,
          z: 0.002
        },
        position: {
          x: -0.1, // a bit to the left
          y: 0.15, // and a bit up
          z: 0
        },
      }).then(result => textModel = result);
    }, 500);

    args.faceTrackingActions.addModel({
      name: "Models.scnassets/glasses2.obj",
      position: {
        x: 0,
        y: -0.007, // a little lower
        z: 0.06 // a little closer to the camera
      },
      scale: {
        x: 0.0045,
        y: 0.0045,
        z: 0.0045
      },
      onTap: (interaction: ARNodeInteraction) => {
        // let's remove the current glasses, and replace it by a different model
        interaction.node.remove();

        args.faceTrackingActions.addModel({
          name: "Models.scnassets/Glasses9.dae",
          position: {
            x: 0,
            y: 0, // a little lower
            z: 0.04 // a little closer to the camera
          },
          scale: {
            x: 0.17,
            y: 0.17,
            z: 0.17
          },
          onTap: (interaction: ARNodeInteraction) => {
            interaction.node.remove();
            textModel.remove();
          }
        });

        textModel.remove();
        args.faceTrackingActions.addText({
          text: "Ray-Ban Opaque",
          materials: [new Color("orange")],
          depth: 1,
          scale: {
            x: 0.002,
            y: 0.002,
            z: 0.002
          },
          position: {
            x: -0.1, // a bit to the left
            y: 0.15, // and a bit up
            z: 0
          },
        }).then(result => textModel = result);
      }
    })
  }
}

export function trackingImageDetected(args: ARTrackingImageDetectedEventData): void {
  console.log("Tracked image detected (name).. " + args.imageName);

  if (args.imageName === "nativescripting") {
    // note that you really want to use locally stored videos, like so:
    if (isIOS) {
      const videoUrl = NSBundle.mainBundle.URLForResourceWithExtensionSubdirectory("homer video", "mov", "art.scnassets");
      if (!videoUrl) {
        console.log("Could not find video file");
        return;
      }
      args.imageTrackingActions.playVideo(videoUrl);
      // args.imageTrackingActions.playVideo(NSURL.URLWithString("http://techslides.com/demos/samples/sample.mov"));
    }

  } else if (args.imageName === "ship") {
    console.log("Adding model");
    args.imageTrackingActions.addModel({
      name: "art.scnassets/ship.scn",
      childNodeName: "shipMesh",
      position: {
        x: 0,
        y: 0,
        z: 0.03
      },
      onTap: (interaction: ARNodeInteraction) => {
        // let's move the plane out of the image a bit
        interaction.node.moveBy({
          x: 0,
          y: 0,
          z: 0.01
        });
      },
      onLongPress: (interaction: ARNodeInteraction) => {
        // let's move the plane into the image a bit
        interaction.node.moveBy({
          x: 0,
          y: 0,
          z: -0.01
        });
      }
    });

  } else if (args.imageName === "nativescript nl" || args.imageName === "nativescripting alt" || args.imageName === "hertogjan" || args.imageName === "latrappe") {
    console.log("Adding box");
    args.imageTrackingActions.addBox({
      position: {
        x: args.position.x,
        y: args.position.y,
        z: args.position.z + 0.8
      },
      dimensions: 1.6,
      chamferRadius: 0.1,
      materials: [{
        diffuse: {
          contents: "Assets.scnassets/Materials/tnsgranite/tnsgranite-diffuse.png",
          wrapMode: "ClampToBorder"
        }
      }],
      onTap: (interaction: ARNodeInteraction) => {
        console.log("box tapped: " + interaction.node.id + " at " + interaction.touchPosition);
        // let's rotate the box 5 degrees to the right
        interaction.node.rotateBy({
          x: 0,
          y: 0,
          z: -5
        });
      },
      onLongPress: (interaction: ARNodeInteraction) => {
        console.log("box longpressed: " + interaction.node.id + " at " + interaction.touchPosition);
        // let's rotate the box 5 degrees to the left
        interaction.node.rotateBy({
          x: 0,
          y: 0,
          z: 5
        });
      }
    }).then(node => console.log("box added to image, id: " + node.id));
  }
}

export function planeDetected(args: ARPlaneDetectedEventData): void {
  console.log("Plane detected (id): " + args.plane.id);
}

export function planeTapped(args: ARPlaneTappedEventData): void {
  console.log("Plane tapped @ x coordinate: " + args.position.x);

  args.object.addModel({
    name: "Models.scnassets/Car.dae",
    position: {
      x: 0,
      y: 0,
      z: -0.5
    },
    rotation: {
      x: 0,
      y: 180, // face towards camera
      z: 0
    },
    scale: 0.1,
    onTap: (interaction: ARNodeInteraction) => {
      console.log("tapped model id: " + interaction.node.id);
      console.log("tapped model position: " + interaction.node.position);
      console.log("tapped model: " + JSON.stringify(interaction.node));
    },
    onLongPress: (interaction: ARNodeInteraction) => console.log("model longpressed: " + interaction.node.id)
  });

  /*
  const boxDimensions = 0.11;

  args.object.addBox({
    position: {
      x: args.position.x,
      y: args.position.y + (boxDimensions / 2), // want to drop the box from a meter high (when mass > 0)? add +1
      z: args.position.z
    },
    // scale: 0.5, // this messes up positioning
    dimensions: boxDimensions,
    chamferRadius: 0.01,
    materials: [{
      diffuse: {
        contents: "Assets.scnassets/Materials/tnsgranite/tnsgranite-diffuse.png",
        wrapMode: "ClampToBorder"
      }
    }],
    // mass: 0.3,
    onTap: model => {
      console.log(`Box tapped: ${model.id}, gonna move it`);
      // model.rotateBy({
      //   x: 0,
      //   y: 0,
      //   z: -5
      // })
      model.moveTo({
        x: model.position.x,
        y: model.position.y + 0.01, // moves the box up a little
        z: model.position.z
      })
    },
    onLongPress: model => model.remove()
  }).then(arNode => {
    console.log("Box successfully added");
    if (arNode.ios) {
      // do something iOS specific here if you like
    }
  });
  */
}

export function sceneTapped(args: ARSceneTappedEventData): void {
  console.log(`Scene tapped @ x / y coordinate: ${args.position.x} / ${args.position.y}`);
}
