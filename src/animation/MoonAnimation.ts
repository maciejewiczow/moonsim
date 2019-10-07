import { PerspectiveCamera, Scene, WebGLRenderer, IUniforms } from 'three'

// import moonModel from 'assets/objects/moon/moon.dae'

export default class MoonAnimation {
    private renderer: WebGLRenderer
    private camera: PerspectiveCamera
    private scene: Scene
    private uniforms: IUniforms = {
        angle: {
            value: 0
        }
    }

    constructor(private root: HTMLElement) {
        this.renderer = new WebGLRenderer()
        this.camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 10, 5000)
        this.scene = new Scene()

        this.root.appendChild(this.renderer.domElement)
    }

    async loadAssets() {}
    animate() {}
    set angle(angle: number) {
        this.uniforms.angle.value = angle
    }
}
