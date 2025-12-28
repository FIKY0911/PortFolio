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
 * 3. GLTF MODEL LOADING
 *    - GLTF: GL Transmission Format (3D model format)
 *    - GLB: Binary version of GLTF (single file)
 *    - useGLTF hook untuk load model
 *    - Preload untuk faster loading
 *    - nodes: Geometries dari model
 *    - materials: Materials dari model
 * 
 * 4. 3D LIGHTING SYSTEM
 *    - ambientLight: Base lighting (no shadows)
 *    - directionalLight: Parallel rays (like sun)
 *    - pointLight: Omnidirectional (like bulb)
 *    - spotLight: Cone-shaped (like flashlight)
 *    - Environment: HDR lighting
 * 
 * 5. CAMERA & CONTROLS
 *    - PerspectiveCamera: Realistic camera projection
 *    - OrbitControls: Mouse/touch interaction
 *    - autoRotate: Automatic camera rotation
 *    - Zoom limits: minDistance, maxDistance
 * 
 * 6. PERFORMANCE OPTIMIZATION
 *    - useMemo: Cache expensive calculations
 *    - useFrame: Per-frame updates (60fps)
 *    - Float32Array: Efficient typed arrays
 *    - Points geometry: Efficient particles
 *    - Conditional rendering: Only render when needed
 * 
 * 7. RESPONSIVE DESIGN
 *    - react-responsive: Media query hooks
 *    - Conditional features based on device
 *    - Mobile optimization (disable zoom, autoRotate)
 * 
 * 8. THEME INTEGRATION
 *    - useTheme: Context hook untuk dark/light mode
 *    - Conditional lighting based on theme
 *    - Dynamic colors and intensities
 * 
 * TIPS:
 * - GLTF models bisa di-render di Canvas (bukan HTML!)
 * - Place model di public/3D/ folder
 * - Adjust camera position untuk best view
 * - Use Environment untuk realistic lighting
 * - ContactShadows untuk ground effect
 * - Points geometry untuk particles (fireflies, stars)
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
 */

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Stars } from '@react-three/drei'
import { useMediaQuery } from 'react-responsive'
import { useTheme } from '../context/ThemeContext'
import { Room } from './Room'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

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
    
    // Batas rotasi dalam radians
    const minAzimuth = -Math.PI / 3 // -60 derajat (kiri)
    const maxAzimuth = Math.PI / 3  // +60 derajat (kanan)
    
    // useFrame: Hook yang dipanggil setiap frame (60fps)
    // Digunakan untuk animasi smooth
    useFrame(() => {
        // Check apakah OrbitControls sudah ter-mount
        if (orbitControlsRef.current) {
            const controls = orbitControlsRef.current
            const speed = 0.003 // Kecepatan rotasi (radians per frame)
            
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
            
            // Loop untuk update position setiap particle
            for (let i = 0; i < count; i++) {
                const i3 = i * 3 // Index untuk x, y, z
                
                if (area === 'yard') {
                    // Gerakan lebih lambat untuk kunang-kunang di halaman
                    // Math.sin/cos: Smooth wave motion
                    // time * speed: Control animation speed
                    // + i: Offset untuk setiap particle (tidak sync)
                    positions[i3 + 1] += Math.sin(time * 0.4 + i) * 0.0008 // y: vertical float
                    positions[i3] += Math.cos(time * 0.25 + i) * 0.0006 // x: horizontal drift
                    positions[i3 + 2] += Math.sin(time * 0.2 + i) * 0.0006 // z: depth movement
                    
                    // Keep dalam bounds (halaman rumput)
                    // Reset position jika keluar bounds
                    if (positions[i3 + 1] > 1.8) positions[i3 + 1] = 0.2
                    if (positions[i3 + 1] < 0.2) positions[i3 + 1] = 1.8
                } else {
                    // Gerakan lebih cepat untuk kunang-kunang di udara
                    positions[i3 + 1] += Math.sin(time * 0.8 + i) * 0.0015 // y: faster vertical
                    positions[i3] += Math.cos(time * 0.6 + i) * 0.0012 // x: faster horizontal
                    positions[i3 + 2] += Math.sin(time * 0.5 + i) * 0.0012 // z: faster depth
                    
                    // Keep dalam bounds (udara)
                    if (positions[i3 + 1] > 4) positions[i3 + 1] = 1
                    if (positions[i3 + 1] < 1) positions[i3 + 1] = 4
                }
            }
            
            // Flag untuk tell GPU to update positions
            // Tanpa ini, perubahan tidak akan ter-render
            pointsRef.current.geometry.attributes.position.needsUpdate = true
            
            // Animasi berkedip (opacity pulse)
            // Math.sin untuk smooth oscillation
            if (pointsRef.current.material) {
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
 * Scene Component
 * ===============
 * Contains the Room model dengan conditional lighting based on theme
 * 
 * DARK MODE LIGHTING:
 * - Purple/blue ambient untuk nighttime atmosphere
 * - Purple directional light sebagai main light
 * - Blue point light untuk accent
 * - Cyan monitor glow effect
 * - Purple spot light untuk dramatic effect
 * - Starry sky background
 * - Fireflies (kunang-kunang) di halaman rumah
 * - Indoor lighting (lampu dalam rumah)
 * - Glowing grass ground
 * 
 * LIGHT MODE LIGHTING:
 * - Warm daylight colors
 * - Natural sunlight simulation
 * - Soft shadows
 * - Clear sky background
 * - Green grass ground
 */
const Scene = ({ isDark }) => {
    return (
        <>
            {/* Starry Sky Background - Hanya muncul di dark mode */}
            {isDark && (
                <Stars 
                    radius={100} // Radius dari sphere bintang
                    depth={50} // Kedalaman field bintang
                    count={5000} // Jumlah bintang
                    factor={4} // Ukuran bintang
                    saturation={0} // 0 = putih, 1 = colorful
                    fade // Fade effect berdasarkan jarak
                    speed={1} // Kecepatan animasi twinkle
                />
            )}
            
            {/* Ground - Dataran rumput hijau dengan tekstur */}
            <Ground isDark={isDark} />
            
            {/* Fireflies - Kunang-kunang di halaman rumah (hanya di dark mode) */}
            {isDark && (
                <>
                    {/* Kunang-kunang di halaman rumah (banyak, rendah) */}
                    <Fireflies count={120} area="yard" />
                    {/* Kunang-kunang terbang lebih tinggi */}
                    <Fireflies count={50} area="scene" />
                </>
            )}
            
            {/* Conditional Lighting Based on Theme */}
            {isDark ? (
                // DARK MODE - Nighttime with monitor glow
                <>
                    {/* Purple/Blue Ambient - Base nighttime lighting (dikurangi) */}
                    <ambientLight color="#0a0a1e" intensity={0.15} />
                    
                    {/* Purple Directional Light - Main light source (dikurangi) */}
                    <directionalLight 
                        position={[5, 8, 5]} 
                        color="#4a4a6e"
                        intensity={0.4}
                        castShadow
                        shadow-mapSize-width={2048}
                        shadow-mapSize-height={2048}
                        shadow-camera-far={50}
                        shadow-camera-left={-10}
                        shadow-camera-right={10}
                        shadow-camera-top={10}
                        shadow-camera-bottom={-10}
                    />
                    
                    {/* === INDOOR LIGHTING - Lampu dalam rumah (INTENSIFIED) === */}
                    
                    {/* Main Ceiling Light - Lampu plafon utama (BRIGHT) */}
                    <pointLight 
                        position={[0, 0.8, 0]} 
                        color="#ffcc66" // Warm orange-yellow
                        intensity={8}
                        distance={5}
                        decay={1.5}
                    />
                    
                    {/* Monitor/Screen Glow - Cahaya monitor (CYAN BRIGHT) */}
                    <pointLight 
                        position={[-0.3, 0.3, 0.5]} 
                        color="#00ffff" // Bright cyan
                        intensity={6}
                        distance={3}
                        decay={1.8}
                    />
                    
                    {/* Desk Lamp - Lampu meja (WARM BRIGHT) */}
                    <pointLight 
                        position={[-0.6, 0.4, 0.3]} 
                        color="#ffaa44" // Warm orange
                        intensity={5}
                        distance={2.5}
                        decay={2}
                    />
                    
                    {/* Bedside Lamp - Lampu samping tempat tidur */}
                    <pointLight 
                        position={[0.7, 0.3, -0.6]} 
                        color="#ffbb55" // Soft warm
                        intensity={4}
                        distance={2.5}
                        decay={2}
                    />
                    
                    {/* Floor Lamp - Lampu lantai sudut */}
                    <pointLight 
                        position={[-0.9, 0.5, -0.7]} 
                        color="#ffd699" // Very warm
                        intensity={5}
                        distance={3}
                        decay={1.8}
                    />
                    
                    {/* Ceiling Spot 1 - Lampu spot plafon */}
                    <spotLight 
                        position={[0.5, 1, 0.5]} 
                        target-position={[0, 0, 0]}
                        color="#ffdd88" // Warm white
                        angle={0.6} 
                        penumbra={0.5} 
                        intensity={6}
                        distance={4}
                    />
                    
                    {/* Ceiling Spot 2 - Lampu spot plafon 2 */}
                    <spotLight 
                        position={[-0.5, 1, -0.5]} 
                        target-position={[0, 0, 0]}
                        color="#ffdd88" // Warm white
                        angle={0.6} 
                        penumbra={0.5} 
                        intensity={6}
                        distance={4}
                    />
                    
                    {/* RGB LED Strip - LED strip di belakang monitor/meja */}
                    <pointLight 
                        position={[-0.4, 0.2, 0.7]} 
                        color="#ff00ff" // Magenta/Purple
                        intensity={3}
                        distance={2}
                        decay={2}
                    />
                    
                    {/* Window Moonlight - Cahaya bulan dari jendela (subtle) */}
                    <spotLight 
                        position={[1.5, 1, 0]} 
                        target-position={[0, 0, 0]}
                        color="#6699ff" // Cool blue moonlight
                        angle={0.5} 
                        penumbra={0.8} 
                        intensity={2}
                    />
                    
                    {/* Ambient Fill Light - Cahaya pantulan dari lampu */}
                    <pointLight 
                        position={[0, 0.5, 0]} 
                        color="#ffeecc" // Soft warm ambient
                        intensity={3}
                        distance={6}
                        decay={2}
                    />
                </>
            ) : (
                // LIGHT MODE - Warm daylight
                <>
                    {/* Warm Ambient Light - Base lighting */}
                    <ambientLight intensity={0.4} />
                    
                    {/* Main Directional Light - Sunlight simulation */}
                    <directionalLight 
                        position={[5, 8, 5]} 
                        intensity={1.5}
                        castShadow
                        shadow-mapSize-width={2048}
                        shadow-mapSize-height={2048}
                        shadow-camera-far={50}
                        shadow-camera-left={-10}
                        shadow-camera-right={10}
                        shadow-camera-top={10}
                        shadow-camera-bottom={-10}
                    />
                    
                    {/* Spot Light - Accent lighting */}
                    <spotLight 
                        position={[10, 10, 10]} 
                        angle={0.3} 
                        penumbra={1} 
                        intensity={1}
                        castShadow
                        shadow-mapSize-width={1024}
                        shadow-mapSize-height={1024}
                    />
                    
                    {/* Fill Light - Soft light dari sisi lain */}
                    <directionalLight 
                        position={[-5, 5, -5]} 
                        intensity={0.5}
                    />
                    
                    {/* Sunlight through window - Cahaya matahari masuk jendela */}
                    <spotLight 
                        position={[2, 3, 1]} 
                        target-position={[0, 0, 0]}
                        color="#fff9e6" // Warm sunlight
                        angle={0.4} 
                        penumbra={0.5} 
                        intensity={2}
                    />
                </>
            )}
            
            {/* Low Poly Room Model */}
            <Room 
                position={[0, -1, 0]} 
                scale={0.02}
                rotation={[0, Math.PI / 4, 0]}
            />
            
            {/* Contact Shadows dengan conditional color - Lebih subtle */}
            <ContactShadows
                position={[0, -1.49, 0]} // Sedikit di atas ground
                opacity={isDark ? 0.5 : 0.4}
                scale={15}
                blur={2}
                far={3}
                color={isDark ? "#0a1f14" : "#000000"}
            />
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

    return(
        // Container dengan width full dan height yang lebih besar
        <div className='w-full h-[600px] md:h-[700px] lg:h-[800px] rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-lg'>
            {/* Enable shadows di Canvas level */}
            <Canvas 
                shadows 
                camera={{ position: [5, 2, 5], fov: 45 }}
                gl={{ 
                    antialias: true,
                    alpha: true
                }}
            >
                {/* Environment Map - Conditional preset based on theme */}
                <Environment preset={isDark ? "night" : "sunset"} />
                
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
                
                {/* Custom Auto-Rotate Bounce (hanya di desktop) */}
                {!isMobile && <AutoRotateBounce orbitControlsRef={orbitControlsRef} />}
                
                {/* 3D Scene dengan conditional lighting */}
                <Scene isDark={isDark} />
            </Canvas>
        </div>
    )
}

export default AboutExperience
