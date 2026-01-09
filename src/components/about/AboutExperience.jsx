/**
 * ============================================================================
 * AboutExperience.jsx - 3D Experience Component dengan React Three Fiber
 * ============================================================================
 * 
 * PEMBELAJARAN SENIOR DEVELOPER:
 * 
 * 1. REACT THREE FIBER (@react-three/fiber)
 *    - React renderer untuk Three.js
 *    - Declarative 3D graphics di React (bukan imperative)
 *    - Canvas component sebagai container 3D
 *    - Automatic rendering loop (60fps)
 *    - Component-based 3D scene
 * 
 * 2. REACT THREE DREI (@react-three/drei)
 *    - Helper library untuk R3F
 *    - OrbitControls: Control kamera dengan mouse/touch
 *    - Environment: HDR environment lighting (realistic reflections)
 *    - ContactShadows: Realistic ground shadows
 *    - Stars: Starfield background
 *    - useGLTF: Load GLTF/GLB 3D models
 * 
 * 3. PERFORMANCE OPTIMIZATION
 *    - Suspense: Lazy loading untuk 3D models
 *    - useMemo: Cache expensive calculations
 *    - useFrame: Per-frame updates (60fps)
 *    - Float32Array: Efficient typed arrays
 *    - Points geometry: Efficient particles
 *    - Conditional rendering: Only render when needed
 *    - dpr (device pixel ratio): Limit untuk mobile
 *    - frameloop: Demand mode untuk better performance
 * 
 * 4. LAZY LOADING
 *    - Suspense boundary untuk async loading
 *    - Fallback component saat loading
 *    - Preload GLTF models
 *    - Progressive enhancement
 * 
 * PACKAGE REQUIREMENTS:
 * - npm install @react-three/fiber @react-three/drei three react-responsive
 * 
 * MODEL REQUIREMENTS:
 * - File: public/3D/low_poly_room.glb
 * - Format: GLTF/GLB
 * - Source: Sketchfab (converted to GLB)
 * 
 * PERFORMANCE NOTES:
 * - Canvas runs at 60fps
 * - useFrame called every frame
 * - Optimize particle count for mobile
 * - Use LOD (Level of Detail) for complex models
 * - Limit shadows on mobile
 * - Use lower dpr on mobile
 */

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Stars } from '@react-three/drei'
import { useMediaQuery } from 'react-responsive'
import { useTheme } from '../context/ThemeContext'
import { Room } from './Room'
import { useRef, useMemo, Suspense, useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import * as THREE from 'three'

/**
 * ============================================================================
 * Loader Component - Loading Fallback
 * ============================================================================
 * Simple loading indicator saat 3D model sedang di-load
 * Menampilkan placeholder yang ringan
 */
const Loader = () => {
    return (
        <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#888888" wireframe />
        </mesh>
    )
}

/**
 * ============================================================================
 * AutoRotateBounce Component
 * ============================================================================
 * Custom auto-rotate yang memantul kiri-kanan (bounce effect)
 * Tidak rotasi 360 derajat penuh, tapi bounce di batas tertentu
 * 
 * KONSEP:
 * - Kamera bergerak dari kiri ke kanan, lalu balik lagi
 * - Seperti mengamati ruangan dari berbagai sudut
 * - Lebih natural daripada rotasi 360 derajat
 * 
 * IMPLEMENTASI:
 * - useRef untuk track direction (1 = kanan, -1 = kiri)
 * - useFrame untuk update setiap frame (60fps)
 * - setAzimuthalAngle untuk control rotasi horizontal
 * - Balik direction ketika mencapai batas
 * 
 * PARAMETERS:
 * - orbitControlsRef: Reference ke OrbitControls component
 * 
 * MATH:
 * - minAzimuth: -60° (batas kiri)
 * - maxAzimuth: +60° (batas kanan)
 * - speed: 0.003 radians per frame
 * 
 * @param {Object} props - Component props
 * @param {React.RefObject} props.orbitControlsRef - Ref to OrbitControls
 */
const AutoRotateBounce = ({ orbitControlsRef }) => {
    // useRef untuk menyimpan direction tanpa trigger re-render
    // 1 = rotate ke kanan, -1 = rotate ke kiri
    const direction = useRef(1)
    const frameCount = useRef(0)
    
    // Batas rotasi dalam radians
    const minAzimuth = -Math.PI / 3 // -60 derajat (kiri)
    const maxAzimuth = Math.PI / 3  // +60 derajat (kanan)
    
    // useFrame: Hook yang dipanggil setiap frame (60fps)
    // Digunakan untuk animasi smooth
    useFrame(() => {
        // Optimize: Update setiap 2 frames untuk reduce CPU usage
        frameCount.current++
        if (frameCount.current % 2 !== 0) return
        
        // Check apakah OrbitControls sudah ter-mount
        if (orbitControlsRef.current) {
            const controls = orbitControlsRef.current
            const speed = 0.02 // Kecepatan rotasi (radians per frame) - reduced
            
            // Update azimuth angle (rotasi horizontal)
            // getAzimuthalAngle: Get current angle
            // setAzimuthalAngle: Set new angle
            controls.setAzimuthalAngle(
                controls.getAzimuthalAngle() + speed * direction.current
            )
            
            // Get current angle untuk check bounds
            const currentAngle = controls.getAzimuthalAngle()
            
            // Balik arah ketika mentok di batas
            if (currentAngle >= maxAzimuth) {
                direction.current = -1 // Putar ke kiri
            } else if (currentAngle <= minAzimuth) {
                direction.current = 1 // Putar ke kanan
            }
        }
    })
    
    // Return null karena ini bukan visual component
    // Hanya logic component untuk animasi
    return null
}

/**
 * ============================================================================
 * Fireflies Component - Kunang-kunang Particle System
 * ============================================================================
 * Kunang-kunang yang terbang di sekitar scene
 * Menggunakan Points geometry untuk performa optimal
 * 
 * KONSEP PARTICLE SYSTEM:
 * - Points: Efficient way untuk render banyak particles
 * - BufferGeometry: Low-level geometry untuk performance
 * - BufferAttribute: Typed arrays untuk vertex data
 * - Float32Array: Efficient memory untuk positions, colors, sizes
 * 
 * OPTIMIZATION TECHNIQUES:
 * 1. useMemo: Cache particle data (tidak recalculate setiap render)
 * 2. useFrame: Update positions setiap frame (60fps)
 * 3. BufferAttribute: Direct GPU memory access
 * 4. Additive Blending: Glow effect tanpa extra geometry
 * 
 * PARAMETERS:
 * - count: Jumlah kunang-kunang (default 50)
 * - area: 'yard' (halaman) atau 'scene' (udara)
 * 
 * AREA TYPES:
 * - 'yard': Kunang-kunang di halaman rumput (rendah, luas, lambat)
 * - 'scene': Kunang-kunang di udara (tinggi, cepat)
 * 
 * ANIMATION:
 * - Sine/Cosine waves untuk smooth floating motion
 * - Different speeds untuk natural movement
 * - Opacity pulse untuk blinking effect
 * - Bounds checking untuk keep particles in area
 * 
 * VISUAL EFFECTS:
 * - Additive blending: Glow effect
 * - Vertex colors: Yellow-green firefly color
 * - Size attenuation: Smaller when far
 * - Transparency: Soft appearance
 * 
 * @param {Object} props - Component props
 * @param {number} props.count - Number of fireflies
 * @param {string} props.area - Area type ('yard' or 'scene')
 */
const Fireflies = ({ count = 50, area = 'yard' }) => {
    // useRef untuk reference ke Points object
    // Tidak trigger re-render ketika update
    const pointsRef = useRef()
    
    // useMemo: Cache expensive calculations
    // Hanya recalculate jika count atau area berubah
    // Generate random positions untuk kunang-kunang
    const particles = useMemo(() => {
        // Float32Array: Typed array untuk efficient memory
        // count * 3: x, y, z untuk setiap particle
        const positions = new Float32Array(count * 3)
        const colors = new Float32Array(count * 3) // r, g, b
        const sizes = new Float32Array(count) // size untuk setiap particle
        
        // Loop untuk generate data setiap particle
        for (let i = 0; i < count; i++) {
            if (area === 'yard') {
                // Kunang-kunang di halaman (lebih tersebar, dekat tanah)
                positions[i * 3] = (Math.random() - 0.5) * 25 // x: -12.5 to 12.5
                positions[i * 3 + 1] = Math.random() * 1.5 + 0.2 // y: 0.2 to 1.7 (rendah)
                positions[i * 3 + 2] = (Math.random() - 0.5) * 25 // z: -12.5 to 12.5
            } else {
                // Kunang-kunang di udara (lebih tinggi)
                positions[i * 3] = (Math.random() - 0.5) * 18 // x: -9 to 9
                positions[i * 3 + 1] = Math.random() * 3 + 1 // y: 1 to 4 (tinggi)
                positions[i * 3 + 2] = (Math.random() - 0.5) * 18 // z: -9 to 9
            }
            
            // Warna kuning-hijau untuk kunang-kunang (RGB 0-1)
            colors[i * 3] = 0.9 + Math.random() * 0.1 // r: 0.9-1.0 (kuning)
            colors[i * 3 + 1] = 1 // g: 1.0 (full green)
            colors[i * 3 + 2] = 0.2 + Math.random() * 0.2 // b: 0.2-0.4 (sedikit biru)
            
            // Random size untuk variasi
            sizes[i] = area === 'yard' ? 0.15 + Math.random() * 0.1 : 0.12 + Math.random() * 0.08
        }
        
        // Return object dengan semua particle data
        return { positions, colors, sizes }
    }, [count, area]) // Dependencies: recalculate jika berubah
    
    // useFrame: Hook yang dipanggil setiap frame (60fps)
    // Digunakan untuk animasi smooth
    // state: Contains clock, camera, scene, dll
    useFrame((state) => {
        // Check apakah Points object sudah ter-mount
        if (pointsRef.current) {
            // Get positions array dari geometry
            const positions = pointsRef.current.geometry.attributes.position.array
            const time = state.clock.elapsedTime // Time in seconds
            
            // Optimize: Update setiap 2 frames untuk reduce CPU usage
            if (Math.floor(time * 60) % 2 !== 0) return
            
            // Loop untuk update position setiap particle
            for (let i = 0; i < count; i++) {
                const i3 = i * 3 // Index untuk x, y, z
                
                if (area === 'yard') {
                    // Gerakan lebih lambat untuk kunang-kunang di halaman
                    // Math.sin/cos: Smooth wave motion
                    // time * speed: Control animation speed
                    // + i: Offset untuk setiap particle (tidak sync)
                    positions[i3 + 1] += Math.sin(time * 0.4 + i) * 0.0005 // y: vertical float (reduced)
                    positions[i3] += Math.cos(time * 0.25 + i) * 0.0004 // x: horizontal drift (reduced)
                    positions[i3 + 2] += Math.sin(time * 0.2 + i) * 0.0004 // z: depth movement (reduced)
                    
                    // Keep dalam bounds (halaman rumput)
                    // Reset position jika keluar bounds
                    if (positions[i3 + 1] > 1.8) positions[i3 + 1] = 0.2
                    if (positions[i3 + 1] < 0.2) positions[i3 + 1] = 1.8
                } else {
                    // Gerakan lebih cepat untuk kunang-kunang di udara
                    positions[i3 + 1] += Math.sin(time * 0.8 + i) * 0.001 // y: faster vertical (reduced)
                    positions[i3] += Math.cos(time * 0.6 + i) * 0.0008 // x: faster horizontal (reduced)
                    positions[i3 + 2] += Math.sin(time * 0.5 + i) * 0.0008 // z: faster depth (reduced)
                    
                    // Keep dalam bounds (udara)
                    if (positions[i3 + 1] > 4) positions[i3 + 1] = 1
                    if (positions[i3 + 1] < 1) positions[i3 + 1] = 4
                }
            }
            
            // Flag untuk tell GPU to update positions
            // Tanpa ini, perubahan tidak akan ter-render
            pointsRef.current.geometry.attributes.position.needsUpdate = true
            
            // Animasi berkedip (opacity pulse) - slower update
            // Math.sin untuk smooth oscillation
            if (pointsRef.current.material && Math.floor(time * 30) % 5 === 0) {
                pointsRef.current.material.opacity = 0.7 + Math.sin(time * 2) * 0.3
            }
        }
    })
    
    return (
        // points: Three.js Points object (particle system)
        <points ref={pointsRef}>
            {/* bufferGeometry: Low-level geometry untuk performance */}
            <bufferGeometry>
                {/* bufferAttribute: Vertex data (positions, colors, sizes) */}
                {/* attach: Where to attach in geometry */}
                {/* count: Number of vertices */}
                {/* array: Typed array data */}
                {/* itemSize: Components per vertex (3 for xyz, 1 for size) */}
                
                {/* Position attribute: x, y, z untuk setiap particle */}
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={particles.positions}
                    itemSize={3} // x, y, z
                />
                
                {/* Color attribute: r, g, b untuk setiap particle */}
                <bufferAttribute
                    attach="attributes-color"
                    count={count}
                    array={particles.colors}
                    itemSize={3} // r, g, b
                />
                
                {/* Size attribute: size untuk setiap particle */}
                <bufferAttribute
                    attach="attributes-size"
                    count={count}
                    array={particles.sizes}
                    itemSize={1} // single value
                />
            </bufferGeometry>
            
            {/* pointsMaterial: Material untuk Points */}
            <pointsMaterial
                size={area === 'yard' ? 0.15 : 0.12} // Base size
                vertexColors // Use colors from bufferAttribute
                transparent // Enable transparency
                opacity={0.85} // Base opacity (animated in useFrame)
                sizeAttenuation // Smaller when far from camera
                blending={THREE.AdditiveBlending} // Glow effect (add colors)
                depthWrite={false} // Prevent z-fighting issues
            />
        </points>
    )
}

/**
 * ============================================================================
 * Ground Component - Dataran Rumput
 * ============================================================================
 * Dataran rumput hijau yang bersinar dengan tekstur dan animasi
 * 
 * KONSEP:
 * - Plane geometry untuk ground surface
 * - MeshStandardMaterial untuk realistic rendering
 * - Emissive glow untuk nighttime effect
 * - Subtle animation untuk wind effect
 * 
 * GEOMETRY:
 * - PlaneGeometry: Flat surface
 * - 50x50: Size in world units
 * - 32x32 segments: Subdivisions untuk detail
 * - More segments = more detail (tapi lebih berat)
 * 
 * MATERIAL PROPERTIES:
 * - color: Base color (hijau)
 * - roughness: 0.9 (kasar seperti rumput)
 * - metalness: 0.1 (tidak metallic)
 * - emissive: Self-illumination color
 * - emissiveIntensity: Glow strength
 * 
 * ANIMATION:
 * - useFrame untuk update setiap frame
 * - Sine wave untuk smooth pulsing
 * - Hanya di dark mode (lebih visible)
 * 
 * SHADOWS:
 * - receiveShadow: Receive shadows dari objects
 * - Tidak castShadow (ground tidak cast shadow)
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isDark - Dark mode flag
 */
const Ground = ({ isDark }) => {
    // useRef untuk reference ke mesh object
    const meshRef = useRef()
    
    // useFrame: Animasi subtle untuk rumput (wind effect)
    // Hanya di dark mode karena lebih visible
    useFrame((state) => {
        if (meshRef.current && isDark) {
            const time = state.clock.elapsedTime // Time in seconds
            
            // Animate emissive intensity (glow pulsing)
            // Math.sin: Smooth oscillation (-1 to 1)
            // 0.2 + sin * 0.1: Range 0.1 to 0.3
            meshRef.current.material.emissiveIntensity = 0.2 + Math.sin(time * 0.5) * 0.1
        }
    })
    
    return (
        // mesh: 3D object (geometry + material)
        <mesh 
            ref={meshRef}
            rotation={[-Math.PI / 2, 0, 0]} // Rotate 90° to be horizontal
            position={[0, -1.5, 0]} // Below room model
            receiveShadow // Receive shadows dari objects
        >
            {/* planeGeometry: Flat surface */}
            {/* args: [width, height, widthSegments, heightSegments] */}
            <planeGeometry args={[50, 50, 32, 32]} />
            
            {/* meshStandardMaterial: PBR material (realistic) */}
            <meshStandardMaterial 
                color={isDark ? "#1a5c3a" : "#4a9c5f"} // Hijau lebih hidup
                roughness={0.9} // Lebih kasar seperti rumput (0=smooth, 1=rough)
                metalness={0.1} // Tidak metallic (0=non-metal, 1=metal)
                emissive={isDark ? "#0f3d24" : "#000000"} // Glow hijau di dark mode
                emissiveIntensity={0.25} // Glow strength (animated in useFrame)
            />
        </mesh>
    )
}

/**
 * ============================================================================
 * Scene Component - Main 3D Scene
 * ============================================================================
 * Contains the Room model dengan conditional lighting based on theme
 * 
 * OPTIMIZATION:
 * - Conditional particle count based on device
 * - Reduced lighting on mobile
 * - Lazy loading dengan Suspense
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isDark - Dark mode flag
 * @param {boolean} props.isMobile - Mobile device flag
 * @param {Object} props.fireflyCount - Firefly count { yard, scene }
 */
const Scene = ({ isDark, isMobile, fireflyCount }) => {
    return (
        <>
            {/* ========================================
                BACKGROUND & ENVIRONMENT
            ======================================== */}
            
            {/* Starry Sky Background - Hanya muncul di dark mode */}
            {isDark && (
                <Stars 
                    radius={100}
                    depth={50}
                    count={isMobile ? 2000 : 5000} // Reduced stars on mobile
                    factor={4}
                    saturation={0}
                    fade
                    speed={1}
                />
            )}
            
            {/* Ground - Dataran rumput hijau dengan tekstur */}
            <Ground isDark={isDark} />
            
            {/* ========================================
                FIREFLIES - HANYA DI DARK MODE
            ======================================== */}
            
            {/* Fireflies - Kunang-kunang di halaman rumah (HANYA DARK MODE) */}
            {isDark && (
                <>
                    {/* Kunang-kunang di halaman rumah (responsive count) */}
                    <Fireflies count={fireflyCount.yard} area="yard" />
                    {/* Kunang-kunang terbang lebih tinggi (responsive count) */}
                    <Fireflies count={fireflyCount.scene} area="scene" />
                </>
            )}
            
            {/* ========================================
                LIGHTING SYSTEM - CONDITIONAL
            ======================================== */}
            
            {/* Conditional Lighting Based on Theme */}
            {isDark ? (
                // ========================================
                // DARK MODE - MALAM HARI (Nighttime)
                // Kamar terang dengan lampu, luar gelap dengan kunang-kunang
                // ========================================
                <>
                    {/* Ambient Light - Sangat gelap untuk suasana malam */}
                    <ambientLight color="#0a0a1a" intensity={0.03} />
                    
                    {/* Moonlight - Cahaya bulan dari atas (subtle) */}
                    <directionalLight 
                        position={[3, 10, 2]} 
                        color="#4466aa" // Cool blue moonlight
                        intensity={0.15}
                        castShadow={!isMobile}
                        shadow-mapSize-width={1024}
                        shadow-mapSize-height={1024}
                    />
                    
                    {/* ============================================
                        INDOOR LIGHTING - Lampu Kamar Malam
                        Pencahayaan hangat dari dalam kamar
                    ============================================ */}
                    
                    {/* Main Ceiling Light - Lampu plafon utama */}
                    <pointLight 
                        position={[0, 1, 0]} 
                        color="#ffeeaa" // Warm yellow
                        intensity={isMobile ? 10 : 12}
                        distance={5}
                        decay={1.5}
                    />
                    
                    {/* Monitor Glow - Cahaya monitor cyan */}
                    <pointLight 
                        position={[-0.3, 0.4, 0.6]} 
                        color="#00ddff" // Bright cyan
                        intensity={isMobile ? 6 : 8}
                        distance={3}
                        decay={2}
                    />
                    
                    {/* Desk Lamp - Lampu meja */}
                    <pointLight 
                        position={[-0.6, 0.5, 0.4]} 
                        color="#ffbb44" // Warm orange
                        intensity={isMobile ? 5 : 7}
                        distance={3}
                        decay={2}
                    />
                    
                    {/* Bedside Lamp - Lampu samping tempat tidur */}
                    <pointLight 
                        position={[0.7, 0.4, -0.6]} 
                        color="#ffcc66" // Soft warm
                        intensity={isMobile ? 4 : 6}
                        distance={2.5}
                        decay={2}
                    />
                    
                    {/* Floor Lamp - Lampu lantai */}
                    <pointLight 
                        position={[-0.9, 0.6, -0.7]} 
                        color="#ffd699" // Very warm
                        intensity={isMobile ? 5 : 7}
                        distance={3.5}
                        decay={1.8}
                    />
                    
                    {!isMobile && (
                        <>
                            {/* Ceiling Spot 1 - Lampu spot plafon */}
                            <spotLight 
                                position={[0.6, 1.5, 0.6]} 
                                target-position={[0, 0, 0]}
                                color="#ffffee" // Warm white
                                angle={0.7} 
                                penumbra={0.4} 
                                intensity={10}
                                distance={5}
                            />
                            
                            {/* Ceiling Spot 2 - Lampu spot plafon 2 */}
                            <spotLight 
                                position={[-0.6, 1.5, -0.6]} 
                                target-position={[0, 0, 0]}
                                color="#ffffee" // Warm white
                                angle={0.7} 
                                penumbra={0.4} 
                                intensity={10}
                                distance={5}
                            />
                            
                            {/* RGB LED Strip - LED strip gaming */}
                            <pointLight 
                                position={[-0.4, 0.3, 0.8]} 
                                color="#ff00ff" // Magenta
                                intensity={4}
                                distance={2}
                                decay={2}
                            />
                            
                            {/* Wall Lights - Lampu dinding */}
                            <pointLight 
                                position={[0.8, 0.5, 0]} 
                                color="#ffeecc"
                                intensity={5}
                                distance={2.5}
                                decay={2}
                            />
                            
                            <pointLight 
                                position={[-0.8, 0.5, 0]} 
                                color="#ffeecc"
                                intensity={5}
                                distance={2.5}
                                decay={2}
                            />
                        </>
                    )}
                    
                    {/* Room Fill Light - Cahaya fill dalam ruangan */}
                    <pointLight 
                        position={[0, 0.6, 0]} 
                        color="#fff8e6"
                        intensity={isMobile ? 5 : 7}
                        distance={6}
                        decay={1.8}
                    />
                </>
            ) : (
                // ========================================
                // LIGHT MODE - SIANG HARI (Daytime)
                // Cahaya matahari terang, natural lighting
                // ========================================
                <>
                    {/* Sky Ambient - Cahaya langit siang hari */}
                    <ambientLight color="#e6f2ff" intensity={0.8} />
                    
                    {/* Main Sunlight - Matahari utama */}
                    <directionalLight 
                        position={[10, 15, 8]} 
                        color="#fffaed" // Warm sunlight
                        intensity={isMobile ? 1.8 : 2.2}
                        castShadow={!isMobile}
                        shadow-mapSize-width={2048}
                        shadow-mapSize-height={2048}
                        shadow-camera-far={50}
                        shadow-camera-left={-10}
                        shadow-camera-right={10}
                        shadow-camera-top={10}
                        shadow-camera-bottom={-10}
                    />
                    
                    {/* Sky Light - Cahaya dari langit (diffuse) */}
                    <directionalLight 
                        position={[0, 20, 0]} 
                        color="#b3d9ff" // Sky blue
                        intensity={0.6}
                    />
                    
                    {/* Fill Light - Cahaya pantulan dari sisi lain */}
                    <directionalLight 
                        position={[-8, 10, -6]} 
                        color="#e6f2ff" // Cool sky light
                        intensity={0.8}
                    />
                    
                    {/* ============================================
                        SUNLIGHT THROUGH WINDOWS
                        Cahaya matahari masuk melalui jendela
                    ============================================ */}
                    
                    {/* Window Sunlight 1 - Jendela utama */}
                    <spotLight 
                        position={[2.5, 3, 1.5]} 
                        target-position={[-0.5, 0, -0.5]}
                        color="#fff9e6" // Warm sunlight
                        angle={0.6} 
                        penumbra={0.3} 
                        intensity={isMobile ? 5 : 7}
                        distance={6}
                        castShadow={!isMobile}
                    />
                    
                    {/* Window Sunlight 2 - Jendela samping */}
                    <spotLight 
                        position={[-1.5, 3.5, 2]} 
                        target-position={[0.5, 0, -0.5]}
                        color="#fff9e6" // Warm sunlight
                        angle={0.7} 
                        penumbra={0.4} 
                        intensity={isMobile ? 4 : 6}
                        distance={5}
                    />
                    
                    {!isMobile && (
                        <>
                            {/* Window Sunlight 3 - Cahaya tambahan */}
                            <spotLight 
                                position={[1, 4, -1]} 
                                target-position={[0, 0, 0.5]}
                                color="#fffaed"
                                angle={0.5} 
                                penumbra={0.5} 
                                intensity={4}
                                distance={5}
                            />
                        </>
                    )}
                    
                    {/* ============================================
                        INDOOR AMBIENT - Cahaya dalam ruangan siang
                    ============================================ */}
                    
                    {/* Room Ambient - Cahaya pantulan dalam ruangan */}
                    <pointLight 
                        position={[0, 0.5, 0]} 
                        color="#fffef5" // Very soft warm
                        intensity={isMobile ? 1.5 : 2}
                        distance={5}
                        decay={2}
                    />
                    
                    {/* Desk Area Light - Cahaya di area meja */}
                    <pointLight 
                        position={[-0.5, 0.4, 0.5]} 
                        color="#ffffff"
                        intensity={isMobile ? 1 : 1.5}
                        distance={2.5}
                        decay={2}
                    />
                    
                    {/* Bounce Light from Ground - Cahaya pantulan dari rumput */}
                    <directionalLight 
                        position={[0, -3, 0]} 
                        color="#c8e6c8" // Green tint dari rumput
                        intensity={0.4}
                    />
                    
                    {!isMobile && (
                        <>
                            {/* Ceiling Light (OFF/DIM) - Lampu plafon redup di siang */}
                            <pointLight 
                                position={[0, 0.8, 0]} 
                                color="#ffffee"
                                intensity={0.5} // Very dim, almost off
                                distance={3}
                                decay={2}
                            />
                        </>
                    )}
                </>
            )}
            
            {/* Low Poly Room Model - Wrapped in Suspense */}
            <Room 
                position={[0, -1, 0]} 
                scale={0.02}
                rotation={[0, Math.PI / 4, 0]}
            />
            
            {/* Contact Shadows - Disabled on mobile untuk performance */}
            {!isMobile && (
                <ContactShadows
                    position={[0, -1.49, 0]}
                    opacity={isDark ? 0.5 : 0.4}
                    scale={15}
                    blur={2}
                    far={3}
                    color={isDark ? "#0a1f14" : "#000000"}
                />
            )}
        </>
    )
}

const AboutExperience = () => {
    // Get theme context untuk conditional lighting
    const { isDark } = useTheme()
    
    // Detect device type untuk conditional features
    const isTablet = useMediaQuery({ query: '(max-width: 1024px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' })
    
    // Ref untuk OrbitControls
    const orbitControlsRef = useRef()
    
    // Intersection Observer untuk detect visibility
    const { ref: containerRef, inView } = useInView({
        threshold: 0.1,
        triggerOnce: false, // Keep monitoring
    })
    
    // State untuk track apakah Canvas pernah di-render
    const [hasRendered, setHasRendered] = useState(false)
    
    // Set hasRendered saat pertama kali inView
    useEffect(() => {
        if (inView && !hasRendered) {
            setHasRendered(true)
        }
    }, [inView, hasRendered])
    
    // Optimize particle count untuk mobile
    const fireflyCount = useMemo(() => {
        if (isMobile) return { yard: 30, scene: 15 } // Further reduced for mobile
        if (isTablet) return { yard: 50, scene: 20 } // Further reduced for tablet
        return { yard: 80, scene: 35 } // Reduced for desktop
    }, [isMobile, isTablet])

    return(
        // Container dengan width full dan height yang lebih besar
        <div 
            ref={containerRef}
            className='w-full h-[600px] md:h-[700px] lg:h-[800px] rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-lg'
        >
            {/* Hanya render Canvas jika pernah inView (lazy load) */}
            {hasRendered && (
                <Canvas 
                    shadows={!isMobile} // Disable shadows on mobile untuk performance
                    camera={{ position: [5, 2, 5], fov: 45 }}
                    dpr={isMobile ? [0.5, 1] : [1, 1.5]} // Lower pixel ratio
                    gl={{ 
                        antialias: false, // Disable antialiasing untuk performance
                        alpha: false, // Disable alpha untuk performance
                        powerPreference: 'high-performance',
                        stencil: false, // Disable stencil buffer
                        depth: true,
                    }}
                    performance={{ min: 0.5 }} // Allow frame rate to drop to 30fps if needed
                    frameloop={inView ? 'always' : 'demand'} // Stop rendering saat tidak visible
                >
                    {/* Suspense boundary untuk lazy loading */}
                    <Suspense fallback={<Loader />}>
                        {/* Environment Map - Conditional preset based on theme */}
                        {/* DARK MODE: Intensity sangat rendah agar tidak override indoor lights */}
                        {/* LIGHT MODE: Intensity normal untuk realistic reflections */}
                        <Environment 
                            preset={isDark ? "night" : "sunset"} 
                            background={false} // Disable background (kita pakai Stars)
                            environmentIntensity={isDark ? 0.05 : 0.5} // Further reduced
                        />
                        
                        {/* OrbitControls untuk interaksi kamera */}
                        <OrbitControls 
                            ref={orbitControlsRef}
                            enableZoom={!isTablet} 
                            enablePan={false} 
                            maxDistance={20} 
                            minDistance={3} 
                            minPolarAngle={0} 
                            maxPolarAngle={Math.PI / 2}
                            autoRotate={false} // Disable default autoRotate
                            enableDamping
                            dampingFactor={0.05}
                        />
                        
                        {/* Custom Auto-Rotate Bounce (hanya di desktop dan saat visible) */}
                        {!isMobile && inView && <AutoRotateBounce orbitControlsRef={orbitControlsRef} />}
                        
                        {/* 3D Scene dengan conditional lighting */}
                        <Scene isDark={isDark} isMobile={isMobile} fireflyCount={fireflyCount} />
                    </Suspense>
                </Canvas>
            )}
            
            {/* Placeholder saat belum di-render */}
            {!hasRendered && (
                <div className='w-full h-full flex items-center justify-center'>
                    <div className='text-gray-400 dark:text-gray-500'>
                        <div className='animate-pulse'>Loading 3D Scene...</div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AboutExperience
