import React, { useRef, useEffect, useState } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from '@react-three/drei'
import { Canvas, useLoader } from '@react-three/fiber'
import './App.css'
import { Euler, Vector3 } from 'three'

function Model() {
  const gltf = useLoader(GLTFLoader, '/BOX.glb')
  const modelRef = useRef()
  const componentRefs = useRef([])
  const partRefs = useRef([])
  const [rotationState, setRotationState] = useState({})
  const [positionState, setPositionState] = useState({})

  useEffect(() => {
    const components = gltf.scene.children
    for (let i = 0; i < components.length; i++) {
      const component = components[i]
      componentRefs.current[i] = component
      partRefs.current[i] = []
      for (let j = 0; j < component.children.length; j++) {
        const part = component.children[j]
        partRefs.current[i][j] = part
        setRotationState(prevState => ({
          ...prevState,
          [part.uuid]: part.rotation.clone(),
        }))
        setPositionState(prevState => ({
          ...prevState,
          [part.uuid]: part.position.clone(),
        }))
      }
    }
  }, [gltf.scene])

  function handleClick(componentIndex, partIndex) {
    const part = partRefs.current[componentIndex][partIndex]
    const rotation = rotationState[part.uuid]
    const position = positionState[part.uuid]
    const newRotation = rotation.clone()
    const newPosition = position.clone()

    if (newRotation.equals(new Euler(-Math.PI / 3, 0, 0))) {
      newRotation.set(0, 0, 0)
    } else {
      newRotation.set(-Math.PI / 3, 0, 0)
    }

    if (newPosition.equals(new Vector3(0, 80, -300))) {
      newPosition.set(0, 0, 0)
    } else {
      newPosition.set(0, 80, -300)
    }

    setRotationState(prevState => ({
      ...prevState,
      [part.uuid]: newRotation,
    }))
    setPositionState(prevState => ({
      ...prevState,
      [part.uuid]: newPosition,
    }))

    setRotationState(prevState => ({
      ...prevState,
      [part.uuid]: newRotation,
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
              onClick={() => {
                if (partIndex === 0) {
                  handleClick(componentIndex, partIndex + 3)
                  handleClick(componentIndex, partIndex + 1)
                }
              }}
              material={part.material}
              position={positionState[part.uuid]}
              rotation={rotationState[part.uuid]}
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