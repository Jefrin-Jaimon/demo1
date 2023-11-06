'use client'
import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { TextureLoader } from 'three';

function ImagePlane(props) {
  const planeRef = useRef();
  const texture = new TextureLoader().load(props.texture);

  return (
    <mesh ref={planeRef}>
      <planeGeometry args={[30, 10]} /> 
      <meshBasicMaterial map={texture} side={2} />
    </mesh>
  );
}

export default function Viewer360() {
  const textures = [];
  for (let i = 1; i <= 36; i++) {
    textures.push(`/images/iris-${i}.jpg`);
  }

  const [currentTextureIndex, setCurrentTextureIndex] = useState(0);
  const isDragging = useRef(false);
  const previousMouseX = useRef(0);

  const preloadImage = (imageIndex) => {
    if (textures[imageIndex]) {
      const img = new Image();
      img.src = textures[imageIndex];
    }
  };

  useEffect(() => {
    preloadImage((currentTextureIndex + 1) % textures.length);
    preloadImage((currentTextureIndex - 1 + textures.length) % textures.length);
  }, [currentTextureIndex, textures]);

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    previousMouseX.current = 0;
  };

  const handleMouseMove = (e) => {
    if (isDragging.current) {
      const deltaX = e.clientX - previousMouseX.current;
      const step = (deltaX / window.innerWidth) * 720;                                                                  
  
      let newIndex = (currentTextureIndex - step / 10) % textures.length;
      if (newIndex < 0) {
        newIndex = newIndex + textures.length;
      }
  
      setCurrentTextureIndex(newIndex);
      previousMouseX.current = e.clientX;
    }
  };
  


  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      style={{
        cursor: isDragging.current ? 'grabbing' : 'grab',
        height: '200px', 
      }}
    >
      <Canvas>
        <ImagePlane texture={textures[Math.floor(currentTextureIndex)]} />
      </Canvas>
    </div>
  );
}
