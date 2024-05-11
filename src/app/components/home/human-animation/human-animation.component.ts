import { Component, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-human-animation',
  templateUrl: './human-animation.component.html',
  styleUrls: ['./human-animation.component.scss']
})
export class HumanAnimationComponent implements AfterViewInit {
  @ViewChild('humanCanvas', { static: true }) humanCanvasRef: ElementRef<HTMLCanvasElement>;

  @Input() public animationName: string = 'idle';
  @Input() public size: number = 3;
  @Input() position: number[] = [-2,-2.5,0]

  private texture_blue: string = '/assets/texture_blue.png';
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private body: THREE.Group;
  private clock = new THREE.Clock();
  private ambientLight!: THREE.AmbientLight;
  private controls: OrbitControls;
  private loader = new THREE.TextureLoader();
  private abcMixer: THREE.AnimationMixer;
  private material_blue = new THREE.MeshBasicMaterial({
    map: this.loader.load(this.texture_blue),
  });

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.initThree();
    this.createHuman();
    this.createControls();
    this.animate();
  }

  initThree(): void {
    const canvas = this.humanCanvasRef.nativeElement;

    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    this.renderer.shadowMap.enabled = true;
    this.renderer.setSize(400, 300); // Set canvas size

    this.scene = new THREE.Scene();
    this.scene.background = null;
    //this.scene.background = new THREE.Color(0x0a192f);
    const cameraZ: number = 60;
    const fieldOfView: number = 1;
    const nearClippingPane: number = 0.1;
    const farClippingPane: number = 1000;
    this.camera = new THREE.PerspectiveCamera(cameraZ, fieldOfView, nearClippingPane, farClippingPane);
    
    this.camera.position.set(5, 0, 5);

    // Floor
    let floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
    let floorMaterial = new THREE.ShadowMaterial({
      opacity: 1, 
    });

    let floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -0.5 * Math.PI; // This is 90 degrees by the way
    floor.receiveShadow = true;
    floor.position.y = -2.5;
    this.scene.add(floor);
  }

  createHuman(): void {
    const loader = new GLTFLoader();
    loader.load( '/assets/Boy.glb', ( gltf ) => {
      gltf.scene.scale.setScalar(this.size);
      gltf.scene.position.set(0, this.position[1], 0);
      const animations = gltf.animations
      this.abcMixer = new THREE.AnimationMixer(gltf.scene)
      const name = this.animationName;
      const clip = THREE.AnimationClip.findByName( animations, name );
      this.abcMixer.clipAction(clip).play()
      this.scene.add( gltf.scene );

      gltf.scene.traverse((child) => {
        if (child.isObject3D) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }, function (xhr) {
      // Calculate loading progress
      const loadingPercentage = xhr.loaded / xhr.total * 100;
      console.log(loadingPercentage + '% loaded');
  }, function ( error ) {

	  console.error( error );
} );

  // Setup lighting
  const directionalLight = new THREE.DirectionalLight(0xffffff, 40);
  directionalLight.position.set(0, 2, 4);
  directionalLight.castShadow = true;
  this.scene.add(directionalLight);

    // Adjust shadow settings
    directionalLight.shadow.mapSize.width = 500;
    directionalLight.shadow.mapSize.height = 500;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;

  this.ambientLight = new THREE.AmbientLight(0xffffff, 1);
  this.scene.add(this.ambientLight);
  }

  private createControls = () => {
    const rendererElement = this.renderer.domElement;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.autoRotate = true;
    this.controls.enableZoom = false;
    this.controls.enablePan = false;

    // Restrict vertical rotation (along the y-axis)
    this.controls.minPolarAngle = Math.PI / 2; // Minimum angle (90 degrees)
    this.controls.maxPolarAngle = Math.PI / 2; // Maximum angle (90 degrees)

    // Restrict horizontal rotation
    this.controls.minAzimuthAngle = -Math.PI / 4; // Minimum azimuth angle (-30 degrees)
    this.controls.maxAzimuthAngle = Math.PI / 4; // Maximum azimuth angle (30 degrees)

    this.controls.update();
};

  animate(): void {
    requestAnimationFrame(() => this.animate());
    const delta = this.clock.getDelta();
    if(this.abcMixer){
      this.abcMixer.update(delta);
    }
    //this.body.rotation.y += 0.05;
    //this.scene.children[1].rotation.y += 0.01;
    //this.scene.children[1].rotation.y += 0.02;
    this.renderer.render(this.scene, this.camera);
  }
}
