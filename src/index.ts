import { ssam } from "ssam";
import type { Sketch, WebGLProps, SketchSettings } from "ssam";
import { BoxGeometry, Mesh, PerspectiveCamera, Scene, ShaderMaterial, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import vert from "./shaders/vert.glsl";
import frag from "./shaders/frag.glsl";
import * as THREE from 'three'

const sketch = ({ wrap, canvas, width, height, pixelRatio }: WebGLProps) => {
  if (import.meta.hot) {
    import.meta.hot.dispose(() => wrap.dispose());
    import.meta.hot.accept(() => wrap.hotReload());
  }

  const renderer = new WebGLRenderer({ canvas });
  renderer.setSize(width, height);
  renderer.setPixelRatio(pixelRatio);
  renderer.setClearColor(0x000000, 1);

  const camera = new PerspectiveCamera(50, width / height, 0.1, 1000);
  camera.position.set(0, 0.0, 0.0);
  camera.lookAt(0, 0, -100);

/*   const controls = new OrbitControls(camera, renderer.domElement); */

  const stats = new Stats();
  document.body.appendChild(stats.dom);

  const scene = new Scene();

  const geometry = new THREE.PlaneGeometry(2, 2);

  const uniforms = {
    time: { value: 0.0 },
  };

  const getMaterial = (level: any) => {
    let material = new ShaderMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: {
        time: {
          value: 0.0
        },
        uLevel: {
          value: level
        }
      }

    })
    return material;
  }

  // const material = new ShaderMaterial({
  //   transparent: true,
  //   vertexShader: vert,
  //   fragmentShader: frag,
  //   uniforms,
  // });

  // const mesh = new Mesh(geometry, mat);
  // scene.add(mesh);

  let number: number = 90
  let meshes: any[] = []
  let materials: any[] = []

  for (let i: any = 0; i < number; i++) {
    let mat = getMaterial(i / 50);
    let mesh = new THREE.Mesh(geometry, mat)
    mesh.position.z = -i * 0.1;
    meshes.push(mesh)
    materials.push(mat)
    scene.add(mesh)
  }

  wrap.render = ({ playhead }: WebGLProps) => {

    camera.position.z = -playhead * 6
    materials.forEach((mat: any, i) => {
      mat.uniforms.time.value = playhead
    })
    /* controls.update(); */
    stats.update();
    renderer.render(scene, camera);
  };

  wrap.resize = ({ width, height }: WebGLProps) => {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };

  wrap.unload = () => {
    renderer.dispose();
    renderer.forceContextLoss();
  };
};

const settings: SketchSettings = {
  mode: "webgl2",
  // dimensions: [800, 800],
  pixelRatio: window.devicePixelRatio,
  animate: true,
  duration: 9_000,
  playFps: 60,
  exportFps: 60,
  framesFormat: ["mp4"],
  attributes: {
    preserveDrawingBuffer: true,
  },
};

ssam(sketch as Sketch, settings);
