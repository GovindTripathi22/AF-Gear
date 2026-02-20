"use client";

import { useRef, useEffect, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, OrbitControls, ContactShadows, Decal } from "@react-three/drei";
import * as THREE from "three";

// Preload the model
useGLTF.preload("/assets/tshirt-model.glb");

// Helper to load base64 image as texture
function useBase64Texture(base64: string | null | undefined) {
    const [texture, setTexture] = useState<THREE.Texture | null>(null);

    useEffect(() => {
        if (!base64) {
            setTexture(null);
            return;
        }
        const img = new Image();
        img.src = base64;
        img.onload = () => {
            const tex = new THREE.Texture(img);
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.needsUpdate = true;
            setTexture(tex);
        };
    }, [base64]);

    return texture;
}

// Helper to create a texture from text
function createTextTexture(text: string, font: string, color: string, width = 512, height = 256) {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (ctx) {
        ctx.fillStyle = "transparent";
        ctx.fillRect(0, 0, width, height);
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, width / 2, height / 2);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 16;
    return texture;
}

function Model({ zoneColors, customizations }: { zoneColors: Record<string, string>, customizations: any }) {
    const { nodes, materials } = useGLTF("/assets/tshirt-model.glb") as any;
    const group = useRef<THREE.Group>(null);
    const meshRef = useRef<THREE.Mesh>(null as any);

    // Zone colors with fallbacks
    const bodyColor = zoneColors.body || "#ffffff";
    const sleevesColor = zoneColors.sleeves || bodyColor;
    const shouldersColor = zoneColors.shoulders || bodyColor;
    const collarColor = zoneColors.collar || bodyColor;
    const sidePanelsColor = zoneColors.sidePanels || bodyColor;
    const cuffsColor = zoneColors.cuffs || sleevesColor;

    // Find the main mesh
    const mainMesh = useMemo(() => {
        return Object.values(nodes).find((n: any) => n.isMesh) as THREE.Mesh;
    }, [nodes]);

    // Apply body color to materials when zoneColors change
    useEffect(() => {
        if (!materials) return;
        Object.values(materials).forEach((material: any) => {
            if (material.color) {
                material.color.set(bodyColor);
                material.roughness = 0.8;
                material.metalness = 0.1;
                material.needsUpdate = true;
            }
        });
    }, [materials, bodyColor]);

    const sponsorTextTex = useMemo(() => customizations.showSponsor && customizations.sponsorText && !customizations.sponsorImage
        ? createTextTexture(customizations.sponsorText, "bold 60px Inter", "#ffffff", 512, 128)
        : null, [customizations.showSponsor, customizations.sponsorText, customizations.sponsorImage]);

    const teamTex = useMemo(() => customizations.teamName
        ? createTextTexture(customizations.teamName, "900 70px Inter", "#ffffff", 512, 128)
        : null, [customizations.teamName]);

    const playerNameTex = useMemo(() => customizations.playerName
        ? createTextTexture(customizations.playerName, "bold 50px Inter", "#ffffff", 512, 128)
        : null, [customizations.playerName]);

    const playerNumTex = useMemo(() => customizations.playerNumber
        ? createTextTexture(customizations.playerNumber, "900 150px Inter", "#ffffff", 256, 256)
        : null, [customizations.playerNumber]);

    const crestTextTex = useMemo(() => customizations.showCrest && !customizations.crestImage
        ? createTextTexture("CREST", "bold 40px Inter", "#ffffff", 128, 128)
        : null, [customizations.showCrest, customizations.crestImage]);

    const loadedCrestTex = useBase64Texture(customizations.crestImage);
    const loadedSponsorTex = useBase64Texture(customizations.sponsorImage);

    const crestFinalTex = (customizations.showCrest && loadedCrestTex) ? loadedCrestTex : crestTextTex;
    const sponsorFinalTex = (customizations.showSponsor && loadedSponsorTex) ? loadedSponsorTex : sponsorTextTex;

    const clonedGeometry = useMemo(() => {
        const geo = mainMesh.geometry.clone();
        geo.computeVertexNormals();
        return geo;
    }, [mainMesh]);

    const clonedMaterial = useMemo(() => {
        const mat = (mainMesh.material as THREE.MeshStandardMaterial).clone();
        mat.color.set(bodyColor);
        mat.roughness = 0.8;
        mat.metalness = 0.1;
        return mat;
    }, [mainMesh, bodyColor]);

    // Slow rotation
    useFrame((state) => {
        if (group.current) {
            group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
        }
    });

    if (!mainMesh) return null;

    return (
        <group ref={group} dispose={null} scale={10} position={[0, -2, 0]}>
            <mesh ref={meshRef} geometry={clonedGeometry} material={clonedMaterial}>
                {/*
                    New Model Bounding Box: X is depth (0.42), Z is width (0.99), Y is height (1.0).
                    Assuming +X is the front of the shirt. We project along the X axis.
                    Rotation for facing +X is [0, Math.PI/2, 0].
                    For the back (-X), rotation is [0, -Math.PI/2, 0].
                */}

                {/* ═══ ZONE-SPECIFIC COLOR DECALS ═══ */}

                {/* Left Sleeve (+Z direction) */}
                {sleevesColor !== bodyColor && (
                    <Decal mesh={meshRef} position={[0, 0.1, 0.35]} rotation={[0, 0, 0]} scale={[0.5, 0.5, 0.7]}>
                        <meshStandardMaterial color={sleevesColor} roughness={0.8} metalness={0.1} polygonOffset polygonOffsetFactor={-1} depthTest={true} />
                    </Decal>
                )}

                {/* Right Sleeve (-Z direction) */}
                {sleevesColor !== bodyColor && (
                    <Decal mesh={meshRef} position={[0, 0.1, -0.35]} rotation={[0, Math.PI, 0]} scale={[0.5, 0.5, 0.7]}>
                        <meshStandardMaterial color={sleevesColor} roughness={0.8} metalness={0.1} polygonOffset polygonOffsetFactor={-1} depthTest={true} />
                    </Decal>
                )}

                {/* Shoulders (Top Front/Back Yoke) */}
                {shouldersColor !== bodyColor && (
                    <Decal mesh={meshRef} position={[0, 0.35, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[0.6, 0.5, 0.3]}>
                        <meshStandardMaterial color={shouldersColor} roughness={0.8} metalness={0.1} polygonOffset polygonOffsetFactor={-1} depthTest={true} />
                    </Decal>
                )}

                {/* Collar Block (Top-center) */}
                {collarColor !== bodyColor && (
                    <Decal mesh={meshRef} position={[0, 0.45, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[0.35, 0.35, 0.35]}>
                        <meshStandardMaterial color={collarColor} roughness={0.8} metalness={0.1} polygonOffset polygonOffsetFactor={-1.5} depthTest={true} />
                    </Decal>
                )}

                {/* Side Panels Left */}
                {sidePanelsColor !== bodyColor && (
                    <Decal mesh={meshRef} position={[0, -0.05, 0.28]} rotation={[0, 0, 0]} scale={[0.35, 0.7, 0.12]}>
                        <meshStandardMaterial color={sidePanelsColor} roughness={0.8} metalness={0.1} polygonOffset polygonOffsetFactor={-1} depthTest={true} />
                    </Decal>
                )}

                {/* Side Panels Right */}
                {sidePanelsColor !== bodyColor && (
                    <Decal mesh={meshRef} position={[0, -0.05, -0.28]} rotation={[0, Math.PI, 0]} scale={[0.35, 0.7, 0.12]}>
                        <meshStandardMaterial color={sidePanelsColor} roughness={0.8} metalness={0.1} polygonOffset polygonOffsetFactor={-1} depthTest={true} />
                    </Decal>
                )}

                {/* Cuffs Left (end of left sleeve) */}
                {cuffsColor !== sleevesColor && (
                    <Decal mesh={meshRef} position={[0, -0.15, 0.42]} rotation={[0, 0, 0]} scale={[0.15, 0.12, 0.15]}>
                        <meshStandardMaterial color={cuffsColor} roughness={0.8} metalness={0.1} polygonOffset polygonOffsetFactor={-1.5} depthTest={true} />
                    </Decal>
                )}

                {/* Cuffs Right (end of right sleeve) */}
                {cuffsColor !== sleevesColor && (
                    <Decal mesh={meshRef} position={[0, -0.15, -0.42]} rotation={[0, Math.PI, 0]} scale={[0.15, 0.12, 0.15]}>
                        <meshStandardMaterial color={cuffsColor} roughness={0.8} metalness={0.1} polygonOffset polygonOffsetFactor={-1.5} depthTest={true} />
                    </Decal>
                )}

                {/* ═══ TEXT/LOGO DECALS ═══ */}

                {/* Sponsor (Front Center) */}
                {sponsorFinalTex && (
                    <Decal mesh={meshRef} position={[0.22, 0.05, 0]} rotation={[0, Math.PI / 2, 0]} scale={[0.4, 0.1, 0.2]}>
                        <meshBasicMaterial map={sponsorFinalTex} transparent polygonOffset polygonOffsetFactor={-2} depthTest={true} />
                    </Decal>
                )}

                {/* Team Name (Front Top) */}
                {teamTex && (
                    <Decal mesh={meshRef} position={[0.22, 0.2, 0]} rotation={[0, Math.PI / 2, 0]} scale={[0.3, 0.08, 0.2]}>
                        <meshBasicMaterial map={teamTex} transparent polygonOffset polygonOffsetFactor={-2} depthTest={true} />
                    </Decal>
                )}

                {/* Crest (Front Right Chest) */}
                {crestFinalTex && (
                    <Decal mesh={meshRef} position={[0.21, 0.2, -0.15]} rotation={[0, Math.PI / 2, 0]} scale={[0.1, 0.1, 0.2]}>
                        <meshBasicMaterial map={crestFinalTex} transparent polygonOffset polygonOffsetFactor={-2} depthTest={true} />
                    </Decal>
                )}

                {/* Player Number (Back Center) */}
                {playerNumTex && (
                    <Decal mesh={meshRef} position={[-0.22, 0.0, 0]} rotation={[0, -Math.PI / 2, 0]} scale={[0.3, 0.3, 0.2]}>
                        <meshBasicMaterial map={playerNumTex} transparent polygonOffset polygonOffsetFactor={-2} depthTest={true} />
                    </Decal>
                )}

                {/* Player Name (Back Shoulders) */}
                {playerNameTex && (
                    <Decal mesh={meshRef} position={[-0.22, 0.25, 0]} rotation={[0, -Math.PI / 2, 0]} scale={[0.3, 0.08, 0.2]}>
                        <meshBasicMaterial map={playerNameTex} transparent polygonOffset polygonOffsetFactor={-2} depthTest={true} />
                    </Decal>
                )}
            </mesh>
        </group>
    );
}

interface JerseyPreview3DProps {
    colors: Record<string, string>;
    title: string;
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

export function JerseyPreview3D({ colors, title, customizations = {} }: JerseyPreview3DProps) {
    return (
        <div className="w-full h-[500px] md:h-[600px] bg-gradient-to-br from-[#1a1c23] to-black rounded-xl overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5">
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

                {/* Premium studio lighting */}
                <Environment preset="city" />

                <Model zoneColors={colors} customizations={customizations} />

                <OrbitControls
                    enablePan={false}
                    minDistance={4}
                    maxDistance={12}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 2 + 0.1}
                />

                {/* Soft ground shadow */}
                <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={15} blur={2} far={4.5} />
            </Canvas>
        </div>
    );
}
