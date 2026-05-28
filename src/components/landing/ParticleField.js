"use client"

import { useEffect, useRef } from "react"

export default function ParticleField() {
  const hostRef = useRef(null)

  useEffect(() => {
    const host = hostRef.current
    let renderer = null
    let geometry = null
    let material = null
    let frameId = 0
    let disposed = false
    let resizeHandler = null

    if (!host) {
      return undefined
    }

    const canvas = document.createElement("canvas")
    canvas.setAttribute("aria-hidden", "true")
    host.appendChild(canvas)

    const pointer = { x: 0, y: 0 }

    const handlePointerMove = (event) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2
    }

    const handleResize = (camera, scene) => {
      if (!renderer) {
        return
      }

      if (!host.clientWidth || !host.clientHeight) {
        return
      }

      camera.aspect = host.clientWidth / host.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(host.clientWidth, host.clientHeight)
      renderer.render(scene, camera)
    }

    window.addEventListener("pointermove", handlePointerMove)

    const init = async () => {
      try {
        const THREE = await import("three")

        if (disposed) {
          return
        }

        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          canvas,
          powerPreference: "high-performance",
        })
        renderer.setClearColor(0x000000, 0)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8))
        renderer.setSize(host.clientWidth, host.clientHeight)

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(
          58,
          host.clientWidth / host.clientHeight,
          0.1,
          100,
        )
        camera.position.z = 6

        const count = 950
        const positions = new Float32Array(count * 3)
        const colors = new Float32Array(count * 3)
        const palette = ["#c8f135", "#ff3cac", "#00d4ff", "#ff6b35"].map(
          (color) => new THREE.Color(color),
        )

        for (let i = 0; i < count; i += 1) {
          const radius = 2.2 + Math.random() * 5.6
          const angle = Math.random() * Math.PI * 2
          const height = (Math.random() - 0.5) * 7
          const color = palette[i % palette.length]

          positions[i * 3] = Math.cos(angle) * radius
          positions[i * 3 + 1] = height
          positions[i * 3 + 2] = Math.sin(angle) * radius
          colors[i * 3] = color.r
          colors[i * 3 + 1] = color.g
          colors[i * 3 + 2] = color.b
        }

        geometry = new THREE.BufferGeometry()
        geometry.setAttribute(
          "position",
          new THREE.BufferAttribute(positions, 3),
        )
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

        material = new THREE.PointsMaterial({
          size: 0.034,
          vertexColors: true,
          transparent: true,
          opacity: 0.76,
          depthWrite: false,
        })

        const points = new THREE.Points(geometry, material)
        points.rotation.x = -0.22
        scene.add(points)
        host.dataset.mode = "three"

        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches

        const animate = () => {
          points.rotation.y += 0.001
          points.rotation.x += (pointer.y * 0.06 - points.rotation.x) * 0.025
          points.rotation.z += (pointer.x * 0.04 - points.rotation.z) * 0.025
          renderer.render(scene, camera)
          frameId = window.requestAnimationFrame(animate)
        }

        resizeHandler = () => handleResize(camera, scene)
        window.addEventListener("resize", resizeHandler)

        if (reducedMotion) {
          renderer.render(scene, camera)
        } else {
          animate()
        }
      } catch {
        host.dataset.mode = "fallback"
      }
    }

    init()

    return () => {
      disposed = true
      window.removeEventListener("pointermove", handlePointerMove)
      if (resizeHandler) {
        window.removeEventListener("resize", resizeHandler)
      }
      window.cancelAnimationFrame(frameId)

      if (geometry) {
        geometry.dispose()
      }

      if (material) {
        material.dispose()
      }

      if (renderer) {
        renderer.dispose()
      }

      if (canvas.parentElement === host) {
        host.removeChild(canvas)
      }
    }
  }, [])

  return <div ref={hostRef} className="particle-field" aria-hidden="true" />
}
