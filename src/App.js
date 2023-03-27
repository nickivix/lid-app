import React, { useRef, useEffect, useState } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from '@react-three/drei'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import './App.css'

function Model() {
  const gltf = useLoader(GLTFLoader, '/BOX.glb')
  const modelRef = useRef()
  const componentRefs = useRef([])
  const partRefs = useRef([])
  const [materialState, setMaterialState] = useState({})

  useEffect(() => {
    const components = gltf.scene.children
    for (let i = 0; i < components.length; i++) {
      const component = components[i]
      componentRefs.current[i] = component
      partRefs.current[i] = []
      for (let j = 0; j < component.children.length; j++) {
        const part = component.children[j]
        partRefs.current[i][j] = part
        setMaterialState(prevState => ({
          ...prevState,
          [part.uuid]: part.material.clone(),
        }))
      }
    }
  }, [gltf.scene])

  function handleClick(componentIndex, partIndex) {
    const part = partRefs.current[componentIndex][partIndex]
    const material = materialState[part.uuid]
    const newMaterial = material.clone()
    newMaterial.transparent = true
    newMaterial.opacity = material.opacity === 0 ? 1 : 0
    setMaterialState(prevState => ({
      ...prevState,
      [part.uuid]: newMaterial,
    }))
  }

  return (
    <group ref={modelRef}>
      {gltf.scene.children.map((component, componentIndex) => (
        <group key={componentIndex} ref={componentRefs.current[componentIndex]}>
          {component.children.map((part, partIndex) => (
            <mesh
              key={partIndex}
              ref={partRefs.current[componentIndex]?.[partIndex]}
              onClick={() => { if (partIndex === 0) handleClick(componentIndex, partIndex + 3) }}
              material={materialState[part.uuid]}
              geometry={part.geometry}
            />
          ))}
        </group>
      ))}
    </group>
  )
}


function App() {
  return (
    <Canvas camera={{ position: [-10, 0, -1000], fov: 60 }} >
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {/* <color attach="background" args={['skyblue']} /> */}
      <Model />
      <OrbitControls makeDefault />
      {/* <PointerLockControls /> */}
    </Canvas>
  )
}

export default App;
