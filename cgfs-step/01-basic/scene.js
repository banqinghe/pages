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
export const scene = {
    spheres: [
        new Sphere(vec3.fromValues(0, -1, 3), 1, vec3.fromValues(255, 0, 0), 500, 0.2),
        new Sphere(vec3.fromValues(2, 0, 4), 1, vec3.fromValues(0, 0, 255), 500, 0.3),
        new Sphere(vec3.fromValues(-2, 0, 4), 1, vec3.fromValues(0, 255, 0), 10, 0.4),
        new Sphere(vec3.fromValues(0, -5001, 0), 5000, vec3.fromValues(255, 255, 0), 1000, 0.5)
    ],
    backgroundColor: vec3.fromValues(211, 227, 253)
};
