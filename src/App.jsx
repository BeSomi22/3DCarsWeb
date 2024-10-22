import "./App.css";
import { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls, useAnimations } from "@react-three/drei";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SportCar = () => {
  const sportCarRef = useRef();

  const { scene, animations } = useGLTF("/assets/sportCar.glb"); // Extract scene from useGLTF
  const { actions } = useAnimations(animations, sportCarRef);

  useEffect(() => {
    if (actions) {
      actions[Object.keys(actions)[0]]?.play(); // You can specify a particular animation by name or play the first one
    }

    ScrollTrigger.create({
      trigger: ".scroll-container",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const scrollPos = self.progress;
        gsap.to(sportCarRef.current.rotation, {
          y: scrollPos * Math.PI * 2,
        });
      },
    });
  }, [actions]); // Run when actions are available
  return (
    <>
      <primitive
        ref={sportCarRef}
        object={scene}
        scale={1.3}
        position={[0, -1.0, -1]}
        rotation={[0, -Math.PI / 5, 0]}
      />
    </>
  );
};

const ClassicCar = () => {
  const classicCarRef = useRef();
  const { scene, animations } = useGLTF("/assets/clasicCar.glb");
  const { actions } = useAnimations(animations, classicCarRef);
  useEffect(() => {
    if (actions) {
      // If there are animations, play the first one
      actions[Object.keys(actions)[0]]?.play(); // You can specify a particular animation by name or play the first one
    }
    ScrollTrigger.create({
      trigger: ".scroll-container2",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const scrollPos = self.progress;
        gsap.to(classicCarRef.current.rotation, {
          y: scrollPos * Math.PI * 2,
        });
      },
    });
  }, [actions]); // Run when actions are available
  return (
    <primitive
      ref={classicCarRef}
      object={scene}
      scale={2}
      position={[0, -2, 0]}
      rotation={[0, Math.PI / 5, 0]}
    />
  );
};

const AnimatedText = ({ text, className, style }) => {
  const textRef = useRef();
  useEffect(() => {
    const textContainer = textRef.current;
    textContainer.innerHTML = ""; // Clear original text

    // Loop through each character
    text.split("").forEach((char) => {
      const span = document.createElement("span");
      span.textContent = char; // Add each letter
      textContainer.appendChild(span); // Append to container

      if (char === " ") {
        span.style.marginRight = "5px"; // Add space between words
      }
    });

    // Apply GSAP animation
    gsap.fromTo(
      textContainer.children,
      { opacity: 0, y: 50 }, // Start from hidden and moved down
      {
        opacity: 1,
        y: 0, // Final state: visible and in position
        stagger: 0.15, // Delay between each letter's animation
        ease: "sine.out",
        scrollTrigger: {
          trigger: textContainer,
          start: "top 80%", // Adjust based on your layout
          end: "top 50%",
          scrub: true,
        },
      }
    );
  }, [text]);

  return <p ref={textRef} className={className} style={style}></p>;
};

function App() {
  useEffect(()=>{
    gsap.fromTo(
      ".wheel",
      {
        x: 0,
        rotate: 0,
        borderRadius: "0%",
      },
      {
        x: "90vw",
        rotate: 360,
        repeat: -1,
        yoyo: true,
        duration: 3,
        ease: "bounce.out",
        borderRadius: "100%",
      }
    );
  }, []);
  
  return (
    <>
      <div style={{ height: "130vh" }} className="scroll-container">
        <h1
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            color: "white",
            fontSize: "4vw", // Responsive font size
          }}
        >
          Scroll to Rotate the Car
        </h1>
        <Canvas
          camera={{ position: [0, 2, 5.5], fov: 60 }}
          className="canvas"
          style={{ marginBottom: "50px" }}
        >
          <ambientLight intensity={1} />
          <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
          <SportCar />
        </Canvas>
        <div
          style={{
            width: "60%",
            height: "50%",
            margin: "0 auto",
            padding: "10px",
          }}
        >
          <h2
            className="sport-header"
            style={{ color: "white", fontSize: "30px" }}
          >
            Sport Car
          </h2>
          <AnimatedText
            className="animated-text"
            style={{ color: "#f1f1f1", fontSize: "25px" }}
            text="Experience the thrill of cutting-edge design and unmatched speed with this sleek, high-performance sport car. Engineered for the fastlane, it combines power, precision, and luxury, making every drive adynamic experience. Scroll to explore its features and watch it rotate in 3D."
          />
        </div>
      </div>

      <div style={{ height: "150vh" }} className="scroll-container2">
        <Canvas
          camera={{ position: [0, 1, 5.5], fov: 60 }}
          style={{ marginBottom: "50px" }}
          className="canvas"
        >
          <ambientLight intensity={1} />
          <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
          <ClassicCar />
        </Canvas>
        <div
          style={{
            width: "60%",
            height: "40%",
            margin: "0 auto",
            padding: "10px",
          }}
        >
          <h2 className="classic-header" style={{ fontSize: "30px" }}>
            Classic Car{" "}
          </h2>
          <AnimatedText
            className="animated-text"
            style={{ color: "#f1f1f1", fontSize: "25px", marginBottom: "50px" }}
            text="A timeless masterpiece that embodies the elegance and craftsmanship of a bygone era. This classic car, with its vintage charm and distinctive curves, brings history to life. Scroll to rotate and admire the beauty of automotive design from the past."
          />
        </div>
        <img src="/assets/wheel.png" alt="wheel" style={{width:'8vw'}}  className="wheel"/>
      </div>
    </>
  );
}

export default App;
