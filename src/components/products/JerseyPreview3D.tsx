"use client";

import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, OrbitControls, ContactShadows, Decal, Text, useTexture } from "@react-three/drei";
import * as THREE from "three";

useGLTF.preload("/assets/tshirt-model.glb");

// Model bounds: X(-0.2138, 0.2138), Y(-0.5, 0.5), Z(-0.4968, 0.4968)
// X axis = front(+) / back(-), Y axis = up(+) / down(-), Z axis = left(+) / right(-)

function classifyVertex(x: number, y: number, z: number, nx: number, ny: number, nz: number): string {
    const absZ = Math.abs(z);
    const absX = Math.abs(x);

    // ── COLLAR ── Top of neckline opening (Y > 0.40, within neck radius)
    const neckRadius = Math.sqrt(x * x + z * z);
    if (y > 0.40 && neckRadius < 0.16) return "collar";

    // ── NECK BINDING ── Just below collar, inner ring (Y > 0.35, tight radius)
    if (y > 0.35 && neckRadius < 0.13) return "neckBinding";

    // ── KNITTED TUBE: BOTTOM HEM ── Very bottom of the torso
    if (y < -0.42) return "knittedTube";

    // ── KNITTED TUBE: SLEEVE CUFFS ── Outer sleeve ends (far out + below shoulder)
    if (absZ > 0.40 && y < 0.05) return "knittedTube";

    // ── SLEEVES ── Arms extend far on Z axis
    const sleeveThreshold = 0.20 + (y + 0.1) * 0.15; // Dynamic threshold: wider at top
    if (absZ > Math.max(0.22, sleeveThreshold)) return "sleeves";

    // ── SHOULDER AREA ── Top + wide = sleeve territory
    if (y > 0.25 && absZ > 0.15) return "sleeves";

    // ── BACK PIECE ── Improved Logic
    // Simplify back-piece detection using coordinate X rather than relying solely on normals
    // X < -0.02 is safely on the back half of the torso
    if (x < -0.02) return "backPiece";

    // ── FRONT PIECE ── Everything remaining
    return "frontPiece";
}

// Apply a pattern effect to a zone color based on vertex position
// Returns the modified color hex string
function applyPattern(
    pattern: string,
    baseHex: string,
    secondaryHex: string,
    x: number, y: number, z: number,
    zone: string
): string {
    // Patterns only apply to body zones (front, back, sleeves), not to collar/binding/hem
    const isBodyZone = ["frontPiece", "backPiece", "sleeves"].includes(zone);
    if (!isBodyZone || pattern === "solid") return baseHex;

    const tempA = new THREE.Color(baseHex);
    const tempB = new THREE.Color(secondaryHex);

    switch (pattern) {
        case "hoops": {
            // Horizontal bands based on Y position
            const band = Math.floor((y + 0.5) * 8); // 8 bands across height
            return band % 2 === 0 ? baseHex : secondaryHex;
        }
        case "stripes": {
            // Vertical stripes based on Z position
            const stripe = Math.floor((z + 0.5) * 6); // 6 stripes across width
            return stripe % 2 === 0 ? baseHex : secondaryHex;
        }
        case "half-half": {
            // Split down the middle on Z axis
            return z > 0 ? baseHex : secondaryHex;
        }
        case "gradient": {
            // Smooth vertical gradient from top to bottom
            const t = (y + 0.5); // 0 at bottom, 1 at top
            tempA.lerp(tempB, 1 - t);
            return "#" + tempA.getHexString();
        }
        case "chevron": {
            // V-shaped pattern based on Y and Z
            const v = y + Math.abs(z) * 0.8;
            const chevBand = Math.floor((v + 0.5) * 6);
            return chevBand % 2 === 0 ? baseHex : secondaryHex;
        }
        case "camo": {
            // Digital camo: pseudo-random blocks based on position
            const bx = Math.floor((x + 0.5) * 10);
            const by = Math.floor((y + 0.5) * 10);
            const bz = Math.floor((z + 0.5) * 10);
            const hash = ((bx * 73 + by * 37 + bz * 53) % 7);
            if (hash < 3) return baseHex;
            if (hash < 5) return secondaryHex;
            // Third shade — blend
            tempA.lerp(tempB, 0.5);
            return "#" + tempA.getHexString();
        }
        case "block": {
            // Large colour block panels — top vs bottom
            return y > 0 ? baseHex : secondaryHex;
        }
        default:
            return baseHex;
    }
}

export interface JerseyPreview3DProps {
    colors: Record<string, string>;
    title: string;
    pattern?: string;
    customizations?: {
        teamName?: string;
        playerName?: string;
        playerNumber?: string;
        showCrest?: boolean;
        crestImage?: string | null;
        sponsorText?: string;
        sponsorImage?: string | null;
        showSponsor?: boolean;
    };
}

<<<<<<< HEAD
 
=======
// eslint-disable-next-line @typescript-eslint/no-explicit-any
>>>>>>> target/main
function Model({
    zoneColors,
    pattern = "solid",
    customizations = {}
}: {
    zoneColors: Record<string, string>;
    pattern?: string;
    customizations?: JerseyPreview3DProps["customizations"];
}) {
<<<<<<< HEAD
     
=======
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
>>>>>>> target/main
    const { nodes, materials } = useGLTF("/assets/tshirt-model.glb") as any;
    const group = useRef<THREE.Group>(null);
    const meshRef = useRef<THREE.Mesh>(null);

    // Zone Colors
    const frontPieceColor = zoneColors.frontPiece || zoneColors.body || "#ffffff";
    const backPieceColor = zoneColors.backPiece || frontPieceColor;
    const sleevesColor = zoneColors.sleeves || frontPieceColor;
    const collarColor = zoneColors.collar || frontPieceColor;
    const neckBindingColor = zoneColors.neckBinding || collarColor;
    const knittedTubeColor = zoneColors.knittedTube || zoneColors.cuffs || sleevesColor;

    const zoneColorMap: Record<string, string> = useMemo(() => ({
        frontPiece: frontPieceColor,
        backPiece: backPieceColor,
        sleeves: sleevesColor,
        collar: collarColor,
        neckBinding: neckBindingColor,
        knittedTube: knittedTubeColor,
    }), [frontPieceColor, backPieceColor, sleevesColor, collarColor, neckBindingColor, knittedTubeColor]);

    // Find the main mesh
    const mainMesh = useMemo(() => {
<<<<<<< HEAD
         
=======
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
>>>>>>> target/main
        return Object.values(nodes).find((n: any) => n.isMesh) as THREE.Mesh;
    }, [nodes]);

    // Build a clean geometry with vertex colors
    const coloredGeometry = useMemo(() => {
        if (!mainMesh) return null;
        const srcGeo = mainMesh.geometry;
        const geo = new THREE.BufferGeometry();

        // Extract position data — handle both standard and interleaved attributes
        const srcPos = srcGeo.getAttribute("position");
        if (!srcPos) return null;

        const vertexCount = srcPos.count;
        const posArr = new Float32Array(vertexCount * 3);

        // Safe extraction that works with ANY attribute type
        for (let i = 0; i < vertexCount; i++) {
            posArr[i * 3] = srcPos.getX(i);
            posArr[i * 3 + 1] = srcPos.getY(i);
            posArr[i * 3 + 2] = srcPos.getZ(i);
        }
        geo.setAttribute("position", new THREE.BufferAttribute(posArr, 3));

        // Extract normals
        const srcNorm = srcGeo.getAttribute("normal");
        if (srcNorm) {
            const normArr = new Float32Array(vertexCount * 3);
            for (let i = 0; i < vertexCount; i++) {
                normArr[i * 3] = srcNorm.getX(i);
                normArr[i * 3 + 1] = srcNorm.getY(i);
                normArr[i * 3 + 2] = srcNorm.getZ(i);
            }
            geo.setAttribute("normal", new THREE.BufferAttribute(normArr, 3));
        }

        // Extract UVs
        const srcUv = srcGeo.getAttribute("uv");
        if (srcUv) {
            const uvArr = new Float32Array(vertexCount * 2);
            for (let i = 0; i < vertexCount; i++) {
                uvArr[i * 2] = srcUv.getX(i);
                uvArr[i * 2 + 1] = srcUv.getY(i);
            }
            geo.setAttribute("uv", new THREE.BufferAttribute(uvArr, 2));
        } else {
            // Polyfill uv so DecalGeometry doesn't throw Cannot read properties of undefined (reading 'getX') array index loop
            geo.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(vertexCount * 2), 2));
        }

        // Copy index
        if (srcGeo.index) {
            geo.setIndex(srcGeo.index.clone());
        }

        if (!geo.getAttribute("normal")) {
            geo.computeVertexNormals();
        }

        // Create vertex colors based on zone classification
        const colorArr = new Float32Array(vertexCount * 3);
        const tempColor = new THREE.Color();

        // Extract normals array for zone classification
        const srcNormAttr = geo.getAttribute("normal") as THREE.BufferAttribute;

        for (let i = 0; i < vertexCount; i++) {
            const x = posArr[i * 3];
            const y = posArr[i * 3 + 1];
            const z = posArr[i * 3 + 2];
            const nx = srcNormAttr ? srcNormAttr.getX(i) : 0;
            const ny = srcNormAttr ? srcNormAttr.getY(i) : 0;
            const nz = srcNormAttr ? srcNormAttr.getZ(i) : 0;
            const zone = classifyVertex(x, y, z, nx, ny, nz);
            const hex = zoneColorMap[zone] || frontPieceColor;
            tempColor.set(hex);
            colorArr[i * 3] = tempColor.r;
            colorArr[i * 3 + 1] = tempColor.g;
            colorArr[i * 3 + 2] = tempColor.b;
        }
        geo.setAttribute("color", new THREE.BufferAttribute(colorArr, 3));

        geo.computeBoundingBox();
        geo.computeBoundingSphere();
        return geo;
    }, [mainMesh, zoneColorMap, frontPieceColor]);

    // Material with vertex colors enabled
    const material = useMemo(() => {
        if (!mainMesh) return null;
        const mat = new THREE.MeshStandardMaterial({
            vertexColors: true,
            roughness: 0.8,
            metalness: 0.1,
        });
        return mat;
    }, [mainMesh]);

    // Derive secondary color for patterns (use backPiece as the secondary, or white if same)
    const secondaryColor = useMemo(() => {
        if (backPieceColor !== frontPieceColor) return backPieceColor;
        if (sleevesColor !== frontPieceColor) return sleevesColor;
        // Default contrast: darken front piece
        const t = new THREE.Color(frontPieceColor);
        t.multiplyScalar(0.6);
        return "#" + t.getHexString();
    }, [frontPieceColor, backPieceColor, sleevesColor]);

    useEffect(() => {
        if (!coloredGeometry) return;
        const posAttr = coloredGeometry.getAttribute("position");
        const normAttr = coloredGeometry.getAttribute("normal");
        const colorAttr = coloredGeometry.getAttribute("color");
        if (!posAttr || !colorAttr) return;

        const tempColor = new THREE.Color();
        const count = posAttr.count;

        for (let i = 0; i < count; i++) {
            const x = posAttr.getX(i);
            const y = posAttr.getY(i);
            const z = posAttr.getZ(i);
            const nx = normAttr ? normAttr.getX(i) : 0;
            const ny = normAttr ? normAttr.getY(i) : 0;
            const nz = normAttr ? normAttr.getZ(i) : 0;
            const zone = classifyVertex(x, y, z, nx, ny, nz);
            const zoneHex = zoneColorMap[zone] || frontPieceColor;
            const finalHex = applyPattern(pattern, zoneHex, secondaryColor, x, y, z, zone);
            tempColor.set(finalHex);
            colorAttr.setXYZ(i, tempColor.r, tempColor.g, tempColor.b);
        }
        colorAttr.needsUpdate = true;
    }, [coloredGeometry, zoneColorMap, frontPieceColor, pattern, secondaryColor]);

    // Slow rotation
    useFrame((state) => {
        if (group.current) {
            group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
        }
    });

    // Load textures safely
    // useTexture throws if the URL is invalid or empty, so we must conditionally call it or load a transparent 1x1 pixel
    const emptyTextureUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    const crestTex = useTexture(customizations.showCrest && customizations.crestImage ? customizations.crestImage : emptyTextureUrl);
    const sponsorTex = useTexture(customizations.showSponsor && customizations.sponsorImage ? customizations.sponsorImage : emptyTextureUrl);

<<<<<<< HEAD
    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        if (crestTex) crestTex.colorSpace = THREE.SRGBColorSpace;
        // eslint-disable-next-line react-hooks/immutability
        if (sponsorTex) sponsorTex.colorSpace = THREE.SRGBColorSpace;
    }, [crestTex, sponsorTex]);
=======
    if (crestTex) crestTex.colorSpace = THREE.SRGBColorSpace;
    if (sponsorTex) sponsorTex.colorSpace = THREE.SRGBColorSpace;
>>>>>>> target/main

    if (!mainMesh || !coloredGeometry || !material) return null;

    return (
        <group ref={group} dispose={null} scale={10} position={[0, -2, 0]}>
            <mesh ref={meshRef} geometry={coloredGeometry} material={material}>
                {/* Crest Decal (Left Chest - Viewer's Right) */}
                {customizations.showCrest && customizations.crestImage && (
                    <Decal
                        position={[0.08, 0.25, 0.14]} // Z is front/back
                        rotation={[0, 0, 0]}
                        scale={[0.08, 0.08, 0.08]}
                        map={crestTex}
                        depthTest={true}
                    />
                )}

                {/* Team Name Text (Right Chest - Viewer's Left) */}
                {customizations.teamName && (
                    <Text
                        position={[-0.08, 0.25, 0.17]}
                        rotation={[0, 0, 0]} // Face forwards (+Z)
                        fontSize={0.03}
                        color="#ffffff"
                        anchorX="center"
                        anchorY="middle"
                        outlineWidth={0.002}
                        outlineColor="#000000"
                        material-depthTest={false}
                        renderOrder={1} // Force render above mesh
                    >
                        {customizations.teamName.toUpperCase()}
                    </Text>
                )}

                {/* Sponsor Image Decal (Center Stomach) */}
                {customizations.showSponsor && customizations.sponsorImage && (
                    <Decal
                        position={[0, 0.1, 0.16]}
                        rotation={[0, 0, 0]}
                        scale={[0.15, 0.15, 0.15]}
                        map={sponsorTex}
                        depthTest={true}
                    />
                )}

                {/* Sponsor Text (Center Stomach) fallback if no image but text exists */}
                {customizations.showSponsor && !customizations.sponsorImage && customizations.sponsorText && (
                    <Text
                        position={[0, 0.1, 0.18]}
                        rotation={[0, 0, 0]} // Face forwards (+Z)
                        fontSize={0.04}
                        color="#ffffff"
                        anchorX="center"
                        anchorY="middle"
                        outlineWidth={0.002}
                        outlineColor="#000000"
                        material-depthTest={false}
                        renderOrder={1}
                    >
                        {customizations.sponsorText}
                    </Text>
                )}

                {/* Player Name (Upper Back) */}
                {customizations.playerName && (
                    <Text
                        position={[0, 0.25, -0.18]}
                        rotation={[0, Math.PI, 0]} // Face backwards (-Z)
                        fontSize={0.04}
                        color="#ffffff"
                        anchorX="center"
                        anchorY="middle"
                        outlineWidth={0.002}
                        outlineColor="#000000"
                        material-depthTest={false}
                        renderOrder={1}
                    >
                        {customizations.playerName.toUpperCase()}
                    </Text>
                )}

                {/* Player Number (Center Back) */}
                {customizations.playerNumber && (
                    <Text
                        position={[0, 0.05, -0.19]}
                        rotation={[0, Math.PI, 0]} // Face backwards (-Z)
                        fontSize={0.15}
                        color="#ffffff"
                        anchorX="center"
                        anchorY="middle"
                        outlineWidth={0.005}
                        outlineColor="#000000"
                        material-depthTest={false}
                        renderOrder={1}
                    >
                        {customizations.playerNumber}
                    </Text>
                )}
            </mesh>
        </group>
    );
}

export function JerseyPreview3D({ colors, title, pattern = "solid", customizations = {} }: JerseyPreview3DProps) {
    return (
        <div className="w-full h-[400px] md:h-[600px] lg:h-[700px] bg-gradient-to-br from-[#1a1c23] to-black rounded-xl overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5">
            {/* Top Indicator */}
            <div className="absolute top-4 left-6 z-10">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-white/50">LIVE 3D PREVIEW</span>
                </div>
                <h3 className="text-white font-bold text-lg leading-tight mt-1">{title}</h3>
            </div>

            {/* Color Legend */}
            <div className="absolute top-4 right-6 z-10 flex gap-1.5">
                {Object.entries(colors).map(([zone, hex]) => (
                    <div
                        key={zone}
                        className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: hex }}
                        title={zone}
                    />
                ))}
            </div>

            {/* Instruction */}
            <div className="absolute bottom-4 left-0 right-0 text-center z-10 pointer-events-none">
                <p className="text-[10px] text-white/50 uppercase tracking-widest flex items-center justify-center gap-2">
                    <span className="w-4 h-[1px] bg-white/20" />
                    Drag to rotate &bull; Scroll to zoom
                    <span className="w-4 h-[1px] bg-white/20" />
                </p>
            </div>

            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />

                <Environment preset="city" />

                <Model zoneColors={colors} pattern={pattern} customizations={customizations} />

                <OrbitControls
                    enablePan={false}
                    minDistance={4}
                    maxDistance={12}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 2 + 0.1}
                />

                <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={15} blur={2} far={4.5} />
            </Canvas>
        </div>
    );
}
