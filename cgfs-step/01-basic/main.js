import { vec3 } from 'gl-matrix';
import { canvasWidth, canvasHeight, putPixel, updateCanvas } from './canvas.js';
import { scene } from './scene.js';

const cameraPosition = vec3.fromValues(0, 0, 0);

function canvasToViewport(x, y) {
    return vec3.fromValues(x * (1 / canvasWidth), y * (1 / canvasHeight), 1);
}

function intersectRaySphere(origin, direction, sphere) {
    const CO = vec3.create();
    vec3.subtract(CO, origin, sphere.center);
    const a = vec3.dot(direction, direction);
    const b = 2 * vec3.dot(CO, direction);
    const c = vec3.dot(CO, CO) - sphere.radius * sphere.radius;
    const discriminant = b * b - 4 * a * c;
    if (discriminant < 0) {
        return [
            Infinity,
            Infinity
        ];
    }
    const sqrtDiscriminant = Math.sqrt(discriminant);
    const t1 = (-b + sqrtDiscriminant) / (2 * a);
    const t2 = (-b - sqrtDiscriminant) / (2 * a);
    return [
        t1,
        t2
    ];
}

function getClosestIntersection(origin, direction, tMin, tMax) {
    let closestT = Infinity;
    let closestSphere = null;
    for (const sphere of scene.spheres){
        const [t1, t2] = intersectRaySphere(origin, direction, sphere);
        if (t1 < closestT && t1 > tMin && t1 < tMax) {
            closestT = t1;
            closestSphere = sphere;
        }
        if (t2 < closestT && t2 > tMin && t2 < tMax) {
            closestT = t2;
            closestSphere = sphere;
        }
    }
    return [
        closestSphere,
        closestT
    ];
}

function traceRay(cameraPosition, direction, minT, maxT) {
    const [closestSphere, closestT] = getClosestIntersection(cameraPosition, direction, minT, maxT);
    if (closestSphere === null) {
        return scene.backgroundColor;
    }
    return closestSphere.color;
}

function main() {
    for(let x = -canvasWidth / 2; x < canvasWidth / 2; x++){
        for(let y = -canvasHeight / 2; y < canvasHeight / 2; y++){
            const direction = canvasToViewport(x, y);
            const color = traceRay(cameraPosition, direction, 1, Infinity);
            putPixel(x + canvasWidth / 2, -y + canvasHeight / 2, color);
        }
    }
    updateCanvas();
}

main();
