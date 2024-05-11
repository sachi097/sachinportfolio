import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

@Component({
  selector: 'app-animation',
  templateUrl: './animation.component.html',
  styleUrls: ['./animation.component.scss'],
})
export class AnimationComponent implements OnInit {
  // Canvas element
  @ViewChild('canvas')
  private canvasRef!: ElementRef;

  // Cube properties
  @Input() public texture_red: string = '/assets/texture_red.png';
  @Input() public texture_blue: string = '/assets/texture_blue.png';

  //* Stage Properties
  @Input() public cameraZ: number = 75;
  @Input() public fieldOfView: number = 0.15;
  @Input('nearClipping') public nearClippingPane: number = 1;
  @Input('farClipping') public farClippingPane: number = 1000;
  @Input('shouldRotate') public shouldRotate = true;

  // Scene properties
  private camera!: THREE.PerspectiveCamera
  private controls!: OrbitControls;
  private ambientLight!: THREE.AmbientLight;
  private loader = new THREE.TextureLoader();
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;

  private geometry = new THREE.BoxGeometry(0.25, 0.25, 0.25);

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private material_red = new THREE.MeshBasicMaterial({
      map: this.loader.load(this.texture_red),
    });

  private material_blue = new THREE.MeshBasicMaterial({
      map: this.loader.load(this.texture_blue),
    });

  private createControls = () => {
      const renderer = new CSS2DRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.domElement.style.position = 'absolute';
      renderer.domElement.style.top = '0px';
      document.body.appendChild(renderer.domElement);
      this.controls = new OrbitControls(this.camera, renderer.domElement);
      this.controls.autoRotate = false;
      this.controls.enableZoom = false;
      this.controls.enablePan = false;
      this.controls.update();
  };

  private getAspectRatio() {
      return this.canvas.clientWidth / this.canvas.clientHeight;
    }


  private cubes: any;
  private singleCube: any;
  //this will be the multiplier for the cubes in the scene
  private boxLength: number = 30;
  private boxBreadth: number = 5;
  private boxHeight: number = 5;

  exclusionList = [
    '0,0,0','0,1,0','0,2,0','0,3,0','0,4,0',
    '1,0,0','1,1,0','1,2,0','1,3,0','1,4,0',
    '2,0,0','2,1,0','2,2,0','2,3,0',
    '3,0,0','3,1,0','3,2,0','3,3,0','3,4,0',
    '4,0,0','4,1,0','4,2,0','4,3,0','4,4,0',
    '0,0,1','0,1,1','0,2,1','0,3,1','0,4,1',
    '4,0,1','4,1,1','4,2,1','4,3,1','4,4,1',
    '1,0,1','1,1,1','1,2,1',
    '2,0,1','2,1,1','2,2,1',
    '3,0,1','3,1,1','3,2,1',
    '0,0,2','0,1,2','0,2,2',
    '0,3,2','0,4,2',
    '4,0,2','4,1,2','4,2,2','4,3,2','4,4,2',
    '1,0,2','1,1,2',
    '2,0,2','2,1,2',
    '3,0,2','3,1,2',
    '0,0,3','0,1,3','0,2,3','1,0,3',
    '2,0,3',
    '3,0,3',
    '4,0,3','4,1,3','4,2,3',
    '0,0,4','0,1,4','0,2,4',
    '1,0,4',
    '2,0,4',
    '3,0,4',
    '4,0,4','4,1,4','4,2,4',
  ];

  highlightList = ['3,4,15', '4,4,29', '2,3,19', '4,2,12'];
  

/*Create Cubes */
private createCubes = () => {
  //initilize our 3 dimentioanl array
  this.cubes = new Array(this.boxHeight);
  for (let i = 0; i < this.cubes.length; i++) {
    this.cubes[i] = new Array(this.boxBreadth);
    for (let j = 0; j < this.cubes[i].length; j++) {
      this.cubes[i][j] = new Array(this.boxLength);
    }
  }

 for (var i = 0; i < this.boxHeight; i++) {
  for (var j = 0; j < this.boxBreadth; j++) {
    for (var k = 0; k < this.boxLength; k++) {
      //index is in exclusion list
      if (this.exclusionList.includes(
            i.toString() + ',' + j.toString() + ',' + k.toString(),
            0
          ) == true)
          continue;

      var item;
      if (this.highlightList.includes(
            i.toString() + ',' + j.toString() + ',' + k.toString(),
            0
          ) == true)
        item = new THREE.Mesh(this.geometry, this.material_red);
      else item = new THREE.Mesh(this.geometry, this.material_blue);
      item.position.x = i * 0.35;
      item.position.y = j * 0.35;
      item.position.z = k * 0.35;
      this.cubes[i][j][k] = item;
     }
    }
  }
};

private createSingleCube(){
  //const material = new THREE.MeshBasicMaterial({ color: 0x64ffda });
  this.singleCube = new THREE.Mesh(this.geometry, this.material_blue);
}

/* Create the scene */
  private createScene() {
    //* Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a192f);
    //this.createCubes();

    this.createSingleCube();
    
    for (var i = 0; i < this.boxHeight; i++) {
      for (var j = 0; j < this.boxBreadth; j++) {
        for (var k = 0; k < this.boxLength; k++) {
          this.scene.add(this.singleCube);
        }
      }
    }

    //*Camera
  let aspectRatio = this.getAspectRatio();
  this.camera = new THREE.PerspectiveCamera(
    this.fieldOfView,
    aspectRatio,
    this.nearClippingPane,
    this.farClippingPane
  );
  this.camera.position.x = 100;
  this.camera.position.y = 100;
  this.camera.position.z = 100;
  this.ambientLight = new THREE.AmbientLight(0xffffff, 80);
  this.scene.add(this.ambientLight);
  }

  private animateCube(){
    if(this.shouldRotate){
      this.singleCube.rotation.x += 0.02;
      this.singleCube.rotation.y += 0.02;
    }
  }

  private startRenderingLoop() {
    //* Renderer
    // Use canvas element in template
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    let component: AnimationComponent = this;
    (function render() {
      component.renderer.render(component.scene, component.camera);
      component.animateCube();
      requestAnimationFrame(render);
    })();
  }

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.createScene();
    this.startRenderingLoop();
    this.createControls();
  }
}
