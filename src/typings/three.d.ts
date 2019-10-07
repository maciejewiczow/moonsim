import * as Three from 'three'

declare global {
    namespace THREE {
        class Uniform<T> {
            value: T;
            constructor(value: T);
            onUpdateCallback: Function;

            /**
             * @deprecated
             */
            constructor(type: string, value: any);
            /**
             * @deprecated
             */
            type: string;
            /**
             * @deprecated Use {@link Object3D#onBeforeRender object.onBeforeRender()} instead.
             */
            dynamic: boolean;

            /**
             * @deprecated Use {@link Object3D#onBeforeRender object.onBeforeRender()} instead.
             */
            onUpdate(callback: Function): Uniform<T>;
        }

        export interface IUniforms {
            [key: string]: Uniform<unknown>
        }
    }
}