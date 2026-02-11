import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, PerspectiveCamera, Html } from '@react-three/drei';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <Html center>
          <div className="text-red-500 font-bold p-4 bg-white/90 rounded-xl shadow-xl">
            Model failed to load
          </div>
        </Html>
      );
    }
    return this.props.children;
  }
}

// Glowing health indicator dot
const HealthDot = ({ position, status, organName, onOrganClick }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = React.useState(false);
  
  // Pulsing animation
  useFrame((state) => {
    if (meshRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1;
      meshRef.current.scale.set(pulse, pulse, pulse);
    }
  });
  
  const getStatusColor = () => {
    switch (status) {
      case 'critical': return '#ef4444'; // Red
      case 'warning': return '#fbbf24'; // Yellow
      default: return '#10b981'; // Green (emerald)
    }
  };
  
  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={() => onOrganClick(organName)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshStandardMaterial
        color={getStatusColor()}
        emissive={getStatusColor()}
        emissiveIntensity={hovered ? 1.5 : 0.8}
        transparent
        opacity={0.9}
      />
      {/* Outer glow ring */}
      <mesh>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial
          color={getStatusColor()}
          transparent
          opacity={hovered ? 0.3 : 0.15}
        />
      </mesh>
    </mesh>
  );
};

// Transparent anatomical body with organic shapes
const AnatomicalBody = ({ gender }) => {
  const bodyColor = gender === 'female' ? '#ec4899' : '#60a5fa';
  
  // Helper for organic limb shapes
  const Limb = ({ position, rotation, args, opacity = 0.4 }) => (
    <mesh position={position} rotation={rotation}>
      <capsuleGeometry args={args} />
      <meshStandardMaterial
        color={bodyColor}
        transparent
        opacity={opacity}
        wireframe={true}
        wireframeLinewidth={1.5}
      />
    </mesh>
  );

  const Joint = ({ position, args = [0.09, 16, 16], opacity = 0.5 }) => (
    <mesh position={position}>
      <sphereGeometry args={args} />
      <meshStandardMaterial
        color={bodyColor}
        transparent
        opacity={opacity}
        wireframe={true}
      />
    </mesh>
  );

  return (
    <group>
      {/* --- HEAD & NECK --- */}
      {/* Head */}
      <mesh position={[0, 1.65, 0]}>
        <capsuleGeometry args={[0.14, 0.16, 4, 16]} />
        <meshStandardMaterial
          color={bodyColor}
          transparent
          opacity={0.5}
          wireframe={true}
        />
      </mesh>
      
      {/* Neck */}
      <mesh position={[0, 1.45, 0]}>
        <cylinderGeometry args={[0.07, 0.09, 0.15, 16]} />
        <meshStandardMaterial
          color={bodyColor}
          transparent
          opacity={0.5}
          wireframe={true}
        />
      </mesh>

      {/* --- TORSO --- */}
      {/* Upper Chest */}
      <mesh position={[0, 1.25, 0]}>
        <capsuleGeometry args={[0.22, 0.25, 4, 16]} />
        <meshStandardMaterial
          color={bodyColor}
          transparent
          opacity={0.5}
          wireframe={true}
        />
      </mesh>

      {/* Abdomen / Spine Area */}
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.18, 0.16, 0.4, 16]} />
        <meshStandardMaterial
          color={bodyColor}
          transparent
          opacity={0.4}
          wireframe={true}
        />
      </mesh>

      {/* Pelvis */}
      <mesh position={[0, 0.7, 0]}>
        <capsuleGeometry args={[0.19, 0.15, 4, 16]} />
        <meshStandardMaterial
          color={bodyColor}
          transparent
          opacity={0.5}
          wireframe={true}
        />
      </mesh>

      {/* --- ARMS --- */}
      {/* Shoulders */}
      <Joint position={[-0.32, 1.35, 0]} args={[0.11, 16, 16]} />
      <Joint position={[0.32, 1.35, 0]} args={[0.11, 16, 16]} />

      {/* Upper Arms */}
      <Limb position={[-0.42, 1.1, 0]} rotation={[0, 0, 0.15]} args={[0.09, 0.45, 4, 16]} />
      <Limb position={[0.42, 1.1, 0]} rotation={[0, 0, -0.15]} args={[0.09, 0.45, 4, 16]} />

      {/* Elbows */}
      <Joint position={[-0.5, 0.85, 0]} args={[0.08, 16, 16]} />
      <Joint position={[0.5, 0.85, 0]} args={[0.08, 16, 16]} />

      {/* Forearms */}
      <Limb position={[-0.58, 0.6, 0]} rotation={[0, 0, 0.1]} args={[0.08, 0.45, 4, 16]} />
      <Limb position={[0.58, 0.6, 0]} rotation={[0, 0, -0.1]} args={[0.08, 0.45, 4, 16]} />

      {/* Hands */}
      <Joint position={[-0.65, 0.35, 0]} args={[0.07, 16, 16]} />
      <Joint position={[0.65, 0.35, 0]} args={[0.07, 16, 16]} />

      {/* --- LEGS --- */}
      {/* Hips */}
      <Joint position={[-0.15, 0.65, 0]} args={[0.12, 16, 16]} />
      <Joint position={[0.15, 0.65, 0]} args={[0.12, 16, 16]} />

      {/* Thighs */}
      <Limb position={[-0.2, 0.35, 0]} rotation={[0, 0, -0.05]} args={[0.11, 0.55, 4, 16]} />
      <Limb position={[0.2, 0.35, 0]} rotation={[0, 0, 0.05]} args={[0.11, 0.55, 4, 16]} />

      {/* Knees */}
      <Joint position={[-0.22, 0.05, 0.02]} args={[0.1, 16, 16]} />
      <Joint position={[0.22, 0.05, 0.02]} args={[0.1, 16, 16]} />

      {/* Calves */}
      <Limb position={[-0.25, -0.35, 0]} rotation={[0, 0, -0.02]} args={[0.09, 0.55, 4, 16]} />
      <Limb position={[0.25, -0.35, 0]} rotation={[0, 0, 0.02]} args={[0.09, 0.55, 4, 16]} />

      {/* Ankles/Feet */}
      <Joint position={[-0.28, -0.7, 0.05]} args={[0.08, 16, 16]} />
      <Joint position={[0.28, -0.7, 0.05]} args={[0.08, 16, 16]} />

      {/* --- INTERNAL STRUCTURE --- */}
      {/* Spine */}
      <group>
        {[0.8, 0.9, 1.0, 1.1, 1.2].map((y, i) => (
          <mesh key={i} position={[0, y, -0.05]}>
            <boxGeometry args={[0.06, 0.08, 0.06]} />
            <meshStandardMaterial
              color="#ffffff"
              transparent
              opacity={0.8}
            />
          </mesh>
        ))}
      </group>
      
      {/* Rib Cage */}
      <group position={[0, 1.15, 0]}>
        {[-0.14, -0.1, 0, 0.1, 0.14].map((x, i) => (
          <React.Fragment key={i}>
            <mesh position={[x, 0, 0.08]} rotation={[0, 0, x * 0.5]}>
              <capsuleGeometry args={[0.015, 0.3, 4, 8]} />
              <meshStandardMaterial
                color="#ffffff"
                transparent
                opacity={0.7}
              />
            </mesh>
            <mesh position={[x, 0, -0.04]} rotation={[0, 0, x * 0.5]}>
              <capsuleGeometry args={[0.015, 0.3, 4, 8]} />
              <meshStandardMaterial
                color="#ffffff"
                transparent
                opacity={0.7}
              />
            </mesh>
          </React.Fragment>
        ))}
      </group>
    </group>
  );
};

const Model = ({ gender, onOrganClick, organStatus }) => {
  // Organ positions (anatomically accurate)
  // Organ positions (anatomically accurate for new model)
  const organPositions = {
    brain: [0, 1.65, 0.1],      // Adjusted for new head position
    heart: [-0.08, 1.25, 0.15], // Adjusted for new chest position
    lungs: [0.08, 1.3, 0.15],   // Adjusted for new chest position
    liver: [0.1, 0.95, 0.12],   // Adjusted for new abdomen position
  };
  
  return (
    <group position={[0, 0, 0]}>
      {/* Transparent anatomical body */}
      <AnatomicalBody gender={gender} />
      
      {/* Health indicator dots */}
      {Object.entries(organPositions).map(([organName, position]) => (
        <HealthDot
          key={organName}
          position={position}
          status={organStatus[organName] || 'normal'}
          organName={organName}
          onOrganClick={onOrganClick}
        />
      ))}
    </group>
  );
};

const DigitalTwin3D = ({ gender = 'male', onOrganClick, organStatus }) => {
  return (
    <div className="w-full h-full min-h-[500px] relative bg-gradient-to-b from-slate-900 to-slate-950">
      <Canvas shadows gl={{ preserveDrawingBuffer: true }}>
        <PerspectiveCamera makeDefault position={[0, 1, 5]} fov={50} />
        
        {/* Ambient lighting */}
        <ambientLight intensity={1.5} />
        
        {/* Key light */}
        <spotLight position={[5, 5, 5]} angle={0.3} penumbra={1} intensity={2.5} />
        
        {/* Rim light for better depth */}
        <spotLight position={[-5, 3, -5]} angle={0.3} penumbra={1} intensity={2} color="#60a5fa" />
        
        {/* Fill light from below */}
        <pointLight position={[0, -2, 2]} intensity={1.5} color="#ffffff" />
        
        {/* Additional front light */}
        <pointLight position={[0, 1, 3]} intensity={1.5} color="#60a5fa" />
        
        {/* Background environment */}
        <Environment preset="night" />
        
        <Suspense fallback={<Html center><span className="text-primary-400">Loading...</span></Html>}>
          <ErrorBoundary>
            <Model gender={gender} onOrganClick={onOrganClick} organStatus={organStatus} />
          </ErrorBoundary>
        </Suspense>

        <OrbitControls 
          enablePan={false} 
          minDistance={2.5} 
          maxDistance={8}
          autoRotate
          autoRotateSpeed={1}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>

      {/* UI Overlays */}
      <div className="absolute top-6 left-6 pointer-events-none">
        <div className="bg-slate-900/80 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-3">
          <div className="flex items-center space-x-2 mb-1">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">SUBJECT ID</span>
          </div>
          <p className="text-lg font-bold text-white">CB-{Math.floor(Math.random() * 10000)}-X</p>
        </div>
        <div className="bg-slate-900/80 backdrop-blur-sm border border-emerald-500/30 rounded-xl p-3 mt-3">
          <div className="flex items-center space-x-2 mb-1">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">SYNC STATUS</span>
          </div>
          <p className="text-sm font-semibold text-white">98.2% Active</p>
        </div>
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-6 left-6 pointer-events-none bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
        <p className="text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wider">Health Indicators</p>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"></span>
            <span className="text-xs text-slate-300">Healthy / Normal</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50"></span>
            <span className="text-xs text-slate-300">Warning / At Risk</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50"></span>
            <span className="text-xs text-slate-300">Critical / Diseased</span>
          </div>
        </div>
      </div>
      
      {/* System Info */}
      <div className="absolute bottom-6 right-6 text-right pointer-events-none">
        <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/30 rounded-lg px-3 py-2">
          <p className="text-[10px] text-slate-500 font-mono">RENDER: WEBGL 2.0</p>
          <p className="text-[10px] text-slate-500 font-mono">ENGINE: THREE.JS</p>
          <p className="text-[10px] text-emerald-400 font-mono mt-1">💡 Click dots for details</p>
        </div>
      </div>
    </div>
  );
};

export default DigitalTwin3D;
