/*
 * Small kit shared by the model builders: named meshes from Three.js geometry,
 * PBR materials from sRGB hex, and a meshopt-compressed GLB writer.
 */
import fs from 'node:fs';
import path from 'node:path';
import * as THREE from 'three';
import { Document, NodeIO } from '@gltf-transform/core';
import { EXTMeshoptCompression, KHRMeshQuantization } from '@gltf-transform/extensions';
import { dedup, meshopt, prune } from '@gltf-transform/functions';
import { MeshoptEncoder } from 'meshoptimizer';

export { THREE };

export function makeDoc(sceneName) {
    const doc = new Document();
    const buffer = doc.createBuffer();
    const scene = doc.createScene(sceneName);
    const mats = {};

    const mat = (name, hex, rough = 0.8, metal = 0, doubleSided = false) => {
        const c = new THREE.Color(hex); // stored linear, as glTF expects
        mats[name] = doc.createMaterial(name).setBaseColorFactor([c.r, c.g, c.b, 1]).setRoughnessFactor(rough).setMetallicFactor(metal).setDoubleSided(doubleSided);
        return mats[name];
    };

    // Bake the transform into the geometry and add it as a named node.
    const add = (name, geometry, material, { pos = [0, 0, 0], rot = [0, 0, 0], scale = [1, 1, 1] } = {}) => {
        const m = new THREE.Matrix4().compose(new THREE.Vector3(...pos), new THREE.Quaternion().setFromEuler(new THREE.Euler(...rot)), new THREE.Vector3(...scale));
        const g = geometry.clone().applyMatrix4(m);
        if (!g.index) g.setIndex([...Array(g.attributes.position.count).keys()]);
        g.computeVertexNormals();
        const acc = (arr, type) => doc.createAccessor().setArray(arr).setType(type).setBuffer(buffer);
        const prim = doc
            .createPrimitive()
            .setAttribute('POSITION', acc(new Float32Array(g.attributes.position.array), 'VEC3'))
            .setAttribute('NORMAL', acc(new Float32Array(g.attributes.normal.array), 'VEC3'))
            .setAttribute('TEXCOORD_0', acc(new Float32Array(g.attributes.uv.array), 'VEC2'))
            .setIndices(acc(new Uint32Array(g.index.array), 'SCALAR'))
            .setMaterial(mats[material]);
        scene.addChild(doc.createNode(name).setMesh(doc.createMesh(name).addPrimitive(prim)));
    };

    const write = async (out) => {
        await MeshoptEncoder.ready;
        // keepAttributes: the UVs are needed for the textures the site paints on at runtime
        await doc.transform(dedup(), prune({ keepAttributes: true }), meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
        const io = new NodeIO().registerExtensions([EXTMeshoptCompression, KHRMeshQuantization]).registerDependencies({ 'meshopt.encoder': MeshoptEncoder });
        fs.mkdirSync(path.dirname(out), { recursive: true });
        await io.write(out, doc);
        console.log(`Wrote ${path.relative(process.cwd(), out)}: ${(fs.statSync(out).size / 1024).toFixed(1)} KB, ${scene.listChildren().length} named parts`);
    };

    return { doc, scene, mat, add, write, box: (w, h, d) => new THREE.BoxGeometry(w, h, d), cyl: (r, l, seg = 24) => new THREE.CylinderGeometry(r, r, l, seg) };
}
