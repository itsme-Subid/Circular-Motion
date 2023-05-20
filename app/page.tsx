"use client";
import { useEffect } from "react";
import styled from "styled-components";

const Canvas = styled.canvas``;

export default function Home() {
  const randomIntFrom = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1) + min);
  const randomFloatFrom = (min: number, max: number): number =>
    Math.random() * (max - min + 1) + min;
  const randomColor = (colors: string[]): string =>
    colors[Math.floor(Math.random() * colors.length)];
  useEffect(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    let mouse: {
      x: number;
      y: number;
    } = {
      x: canvas.width / 2,
      y: canvas.height / 2,
    };
    let numParticles = 200;
    let colors = [
      "142 202 230",
      "33 158 188",
      "2 48 71",
      "255 183 3",
      "251 133 0",
    ];
    let particles: Particle[] = [];
    addEventListener(
      "resize",
      (): void => (
        ([canvas.width, canvas.height] = [
          window.innerWidth,
          window.innerHeight,
        ]),
        init()
      )
    );
    addEventListener("mousemove", ({ x, y }) => ([mouse.x, mouse.y] = [x, y]));
    addEventListener("click", (): void => init());
    class Particle {
      x: number;
      y: number;
      radius: number;
      color: string = randomColor(colors);
      radians: number;
      velocity: number = 0.05;
      distanceFromCenter: number;
      lastMouse: {
        x: number;
        y: number;
      };
      constructor(
        x: number,
        y: number,
        radius: number,
        distanceFromCenter: number,
        radians: number,
        velocity?: number,
        color?: string
      ) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.distanceFromCenter = distanceFromCenter;
        this.radians = radians;
        this.lastMouse = {
          x: x,
          y: y,
        };
        if (velocity) this.velocity = velocity;
        if (color) this.color = color;
      }
      draw(lastPoint: { x: number; y: number }) {
        if (!ctx) return;
        ctx.beginPath();
        ctx.strokeStyle = `rgb(${this.color})`;
        ctx.lineWidth = this.radius;
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
        ctx.closePath();
      }
      update() {
        const lastPoint = {
          x: this.x,
          y: this.y,
        };
        // drag effect
        this.lastMouse.x += (mouse.x - this.lastMouse.x) * 0.05;
        this.lastMouse.y += (mouse.y - this.lastMouse.y) * 0.05;
        // circlular motion
        this.x =
          this.lastMouse.x + Math.cos(this.radians) * this.distanceFromCenter;
        this.y =
          this.lastMouse.y + Math.sin(this.radians) * this.distanceFromCenter;
        this.radians += this.velocity;
        this.draw(lastPoint);
      }
    }
    function init() {
      particles = [];
      const center = {
        x: innerWidth / 2,
        y: innerHeight / 2,
      };
      for (let i = 0; i < numParticles; i++) {
        let radius = randomIntFrom(1, 2);
        let distanceFromCenter = randomIntFrom(80, 150);
        let radians = randomFloatFrom(0, Math.PI * 2);
        particles.push(
          new Particle(center.x, center.y, radius, distanceFromCenter, radians)
        );
      }
    }
    function animate() {
      requestAnimationFrame(animate);
      if (!ctx) return;
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      ctx.fillRect(0, 0, innerWidth, innerHeight);
      // ctx.clearRect(0, 0, innerWidth, innerHeight);
      particles.forEach((particle) => particle.update());
      console.log(particles);
    }
    init();
    animate();
  }, []);
  return <Canvas />;
}
