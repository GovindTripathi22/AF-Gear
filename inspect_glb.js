const fs = require('fs');
try {
    const buffer = fs.readFileSync('public/assets/tshirt-model.glb');
    const jsonChunkLength = buffer.readUInt32LE(12);
    const jsonString = buffer.toString('utf8', 20, 20 + jsonChunkLength);
    const gltf = JSON.parse(jsonString);
    console.log("Meshes:");
    console.log(JSON.stringify(gltf.meshes?.map(m => ({ name: m.name })) || [], null, 2));
    console.log("Materials:");
    console.log(JSON.stringify(gltf.materials?.map((m, i) => ({ index: i, name: m.name })) || [], null, 2));
    console.log("Nodes:");
    console.log(JSON.stringify(gltf.nodes?.map(n => ({ name: n.name, mesh: n.mesh })) || [], null, 2));

    // Get Bounding Box from accessors
    if (gltf.meshes && gltf.meshes.length > 0) {
        const mesh = gltf.meshes[0];
        const prim = mesh.primitives[0];
        const posAccessorId = prim.attributes.POSITION;
        const accessor = gltf.accessors[posAccessorId];
        console.log("Bounding Box (min, max):");
        console.log("min:", accessor.min);
        console.log("max:", accessor.max);

        // Size
        const dx = accessor.max[0] - accessor.min[0];
        const dy = accessor.max[1] - accessor.min[1];
        const dz = accessor.max[2] - accessor.min[2];
        console.log("Size:", [dx, dy, dz]);
        console.log("Center:", [
            accessor.min[0] + dx / 2,
            accessor.min[1] + dy / 2,
            accessor.min[2] + dz / 2
        ]);
    }
} catch (e) {
    console.error(e);
}
