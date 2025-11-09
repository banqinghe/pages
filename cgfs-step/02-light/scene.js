import { vec3 } from 'gl-matrix';

export class Sphere {
    center;
    radius;
    color;
    constructor(center, radius, color, specular, reflective){
        this.center = center;
        this.radius = radius;
        this.color = color;
    }
}

class Light {
    intensity;
    constructor(intensity){
        this.intensity = intensity;
    }
}
export class AmbientLight extends Light {
    constructor(intensity){
        super(intensity);
    }
}
export class DirectionalLight extends Light {
    direction;
    constructor(intensity, direction){
        super(intensity);
        this.direction = direction;
    }
}
export class PointLight extends Light {
    position;
    constructor(intensity, position){
        super(intensity);
        this.position = position;
    }
}

export const scene = {
    spheres: [
        new Sphere(vec3.fromValues(0, -1, 3), 1, vec3.fromValues(255, 0, 0), 500, 0.2),
        new Sphere(vec3.fromValues(2, 0, 4), 1, vec3.fromValues(0, 0, 255), 500, 0.3),
        new Sphere(vec3.fromValues(-2, 0, 4), 1, vec3.fromValues(0, 255, 0), 10, 0.4),
        new Sphere(vec3.fromValues(0, -5001, 0), 5000, vec3.fromValues(255, 255, 0), 1000, 0.5)
    ],
    lights: [
        new AmbientLight(0.2),
        new PointLight(0.6, vec3.fromValues(2, 1, 0)),
        new DirectionalLight(0.2, vec3.fromValues(1, 4, 4)),
    ],
    backgroundColor: vec3.fromValues(211, 227, 253),
};
