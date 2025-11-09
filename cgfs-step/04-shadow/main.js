import { vec3 } from 'gl-matrix';
import { canvasWidth, canvasHeight, putPixel, updateCanvas } from './canvas.js';
import { scene, AmbientLight, PointLight } from './scene.js';

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

function computeLighting(point, normal, specular) {
    let intensity = 0;
    for (const light of scene.lights){
        if (light instanceof AmbientLight) {
            // 环境光直接累加强度
            intensity += light.intensity;
        } else {
            let l = vec3.create();
            let tMax;
            if (light instanceof PointLight) {
                // 点光源: 计算从击中点指向光源的向量
                vec3.subtract(l, light.position, point);
                tMax = 1;
            } else {
                // 平行光: 方向向量就是光源方向
                l = light.direction;
                tMax = Infinity;
            }

            // 检查点是否在阴影中
            const [shadowSphere] = getClosestIntersection(
                point,
                l,
                0.001, // 避免自阴影
                tMax,
            );

            if (shadowSphere !== null) {
                continue;
            }

            // 如果 cos(θ) > 0, 则累加光照强度
            const nDotL = vec3.dot(normal, l);
            if (nDotL > 0) {
                intensity += light.intensity * nDotL / (vec3.length(normal) * vec3.length(l));
            }

            // 无反射光
            if (specular < 0) {
                continue;
            }

            // 计算理想反射光 R = 2N(N·L) - L
            const r = vec3.create();
            vec3.scale(r, normal, 2 * vec3.dot(normal, l));
            vec3.subtract(r, r, l);

            // 计算视线方向 V, 即击中点指向 camera 的向量
            const v = vec3.create();
            vec3.subtract(v, cameraPosition, point);

            // 计算 R·V, 如果夹角小于 90 度, 则视线方向上有反射光
            const rDotV = vec3.dot(r, v);
            if (rDotV > 0) {
                // cos(α) = (R·V) / (|R||V|)
                // I_specular = I * (cos(α))^specular
                intensity += light.intensity * Math.pow(
                    rDotV / (vec3.length(r) * vec3.length(v)),
                    specular,
                );
            }
        }
    }
    return intensity;
}

function traceRay(cameraPosition, direction, minT, maxT) {
    const [closestSphere, closestT] = getClosestIntersection(cameraPosition, direction, minT, maxT);
    if (closestSphere === null) {
        return scene.backgroundColor;
    }

    // 击中点: P = O + tD
    const intersectionPoint = vec3.create();
    vec3.scaleAndAdd(intersectionPoint, cameraPosition, direction, closestT);
    // 击中点法线: N = P - C
    const normal = vec3.create();
    vec3.subtract(normal, intersectionPoint, closestSphere.center);
    vec3.normalize(normal, normal);
    // 最终颜色为球体颜色 * 光照强度
    return vec3.scale(vec3.create(), closestSphere.color, computeLighting(intersectionPoint, normal, closestSphere.specular));
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
