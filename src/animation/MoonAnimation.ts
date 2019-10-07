import { PerspectiveCamera, Scene, WebGLRenderer, IUniforms, Uniform, DirectionalLight } from 'three'
import { loadCollada } from 'utils/threeAsyncLoaderWrapper'

import moonModel from 'assets/objects/moon/moon.dae'

interface MoonUniforms extends IUniforms {
    angle: Uniform<number>
}

export default class MoonAnimation {
    private renderer: WebGLRenderer
    private camera: PerspectiveCamera
    private scene: Scene
    private uniforms: MoonUniforms = {
        angle: new Uniform(0)
    }
    private Sun: DirectionalLight

    constructor(private root: HTMLElement) {
        this.renderer = new WebGLRenderer()
        this.camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 10, 5000)
        this.scene = new Scene()
        this.Sun = new DirectionalLight(0xffffff, 1.1)

        this.root.appendChild(this.renderer.domElement)
    }

    async loadAssets() {
        const model = await loadCollada(moonModel, e => console.log(e))
    }

    animate() { }

    set angle(angle: number) {
        this.uniforms.angle.value = angle
    }
}
