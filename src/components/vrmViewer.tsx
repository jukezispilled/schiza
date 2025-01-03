import React, { useContext, useCallback } from "react";
import { ViewerContext } from "../features/vrmViewer/viewerContext";
import { buildUrl } from "@/utils/buildUrl";
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { TextField, Button, Window, WindowContent, Panel } from 'react95';
import original from "react95/dist/themes/original";

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'ms_sans_serif', sans-serif;
    background-color: #008080;
  }
`;

export default function VrmViewer() {
  const { viewer } = useContext(ViewerContext);

  const AVATAR_SAMPLE_B_VRM_URL =
    "https://uy65dxy0a1v9lyum.public.blob.vercel-storage.com/8968252576836874919-gFfOUXnnFwaKkpUoIbeQwxahqmKw5X.vrm";

  const canvasRef = useCallback(
    (canvas: HTMLCanvasElement) => {
      if (canvas) {
        viewer.setup(canvas);
        viewer.loadVrm(buildUrl(AVATAR_SAMPLE_B_VRM_URL));

        // Drag and Drop VRM replacement
        canvas.addEventListener("dragover", (event) => event.preventDefault());
        canvas.addEventListener("drop", (event) => {
          event.preventDefault();
          const files = event.dataTransfer?.files;
          if (!files) return;

          const file = files[0];
          if (file?.name.endsWith(".vrm")) {
            const blob = new Blob([file], { type: "application/octet-stream" });
            const url = window.URL.createObjectURL(blob);
            viewer.loadVrm(url);
          }
        });
      }
    },
    [viewer]
  );

  return (
    <ThemeProvider theme={original}>
      <GlobalStyles />
      <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "100vh", zIndex: -10 }}>
        {/* Background video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: -20,
            opacity: 0,
          }}
        >
          <source src="/glitch.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* 3D Canvas */}
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }}></canvas>

        {/* Overlay Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0,
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          <source src="/glitch.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </ThemeProvider>
  );
}