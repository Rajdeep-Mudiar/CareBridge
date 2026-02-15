import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, PerspectiveCamera, Html, useGLTF, Center } from '@react-three/drei';

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
      case 'diseased': return '#ef4444'; // Red
      case 'risk': return '#fbbf24'; // Yellow
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
      <sphereGeometry args={[0.06, 24, 24]} />
      <meshStandardMaterial
        color={getStatusColor()}
        emissive={getStatusColor()}
        emissiveIntensity={hovered ? 3 : 1.5}
        transparent
        opacity={0.6} // Reduced from 0.9
      />
      {/* Outer glow ring */}
      <mesh>
        <sphereGeometry args={[0.1, 24, 24]} />
        <meshBasicMaterial
          color={getStatusColor()}
          transparent
          opacity={hovered ? 0.3 : 0.1} // Reduced
          depthTest={false} // Ensure glow is visible
        />
      </mesh>
    </mesh>
  );
};

// Transparent anatomical body using GLB model
const AnatomicalBody = ({ gender }) => {
  const { scene } = useGLTF('/models/body.glb');
  const bodyColor = gender === 'female' ? '#ec4899' : '#60a5fa';
  
  React.useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material.transparent = true;
        child.material.opacity = 0.8; // Increased for better visibility
        child.material.wireframe = false;
        child.material.color.set(bodyColor);
        child.material.emissive.set(bodyColor);
        child.material.emissiveIntensity = 0.6; // Increased glow
        child.material.roughness = 0.1;
        child.material.metalness = 0.9;
      }
    });
  }, [scene, bodyColor]);

  return (
    <group>
      <Center>
        <primitive 
          object={scene} 
          scale={2.2} 
          position={[0, 0, 0]} 
          rotation={[0, 0, 0]} 
        />
      </Center>
    </group>
  );
};

const Model = ({ gender, onOrganClick, organStatus }) => {
  // Organ positions (anatomically accurate)
  // Organ positions (anatomically accurate for new model)
  const organPositions = {
    brain: [0, 1.8, 0.25],      
    heart: [-0.18, 1.1, 0.45], 
    lungs: [0.18, 1.1, 0.45],   
    liver: [0.2, 0.6, 0.5],   
    stomach: [-0.15, 0.5, 0.5],
    kidneys: [-0.12, 0.1, 0.3], 
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
        
        {/* Frontal high-visibility lighting */}
        <ambientLight intensity={1.5} />
        <directionalLight position={[0, 10, 10]} intensity={2.5} />
        <directionalLight position={[10, 5, -5]} intensity={1.5} />
        <directionalLight position={[-10, 5, -5]} intensity={1.5} />
        <pointLight position={[0, 1, 5]} intensity={3} color={gender === 'female' ? '#ec4899' : '#60a5fa'} />
        <Environment preset="city" intensity={2} />
        
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
            <span className="text-xs text-slate-300">Risk / Warning</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50"></span>
            <span className="text-xs text-slate-300">Diseased / Critical</span>
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
