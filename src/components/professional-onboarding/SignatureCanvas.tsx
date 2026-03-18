import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface SignatureCanvasProps {
  onSign: (svgData: string) => void;
  disabled?: boolean;
}

export function SignatureCanvas({ onSign, disabled }: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const pathsRef = useRef<string[]>([]);
  const currentPathRef = useRef<string>("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = 520;
    canvas.height = 150;
    ctx.strokeStyle = "#0b1220";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    currentPathRef.current = `M${pos.x},${pos.y}`;
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || disabled) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    currentPathRef.current += ` L${pos.x},${pos.y}`;
    setHasDrawn(true);
  };

  const endDraw = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentPathRef.current) {
      pathsRef.current.push(currentPathRef.current);
      currentPathRef.current = "";
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pathsRef.current = [];
    setHasDrawn(false);
  };

  const handleSign = () => {
    const svgPaths = pathsRef.current
      .map((d) => `<path d="${d}" stroke="#0b1220" fill="none" stroke-width="2" stroke-linecap="round"/>`)
      .join("");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 150">${svgPaths}</svg>`;
    onSign(svg);
  };

  return (
    <div className="space-y-2">
      <div className="relative rounded-lg overflow-hidden bg-input">
        <canvas
          ref={canvasRef}
          className="w-full bg-transparent cursor-crosshair touch-none"
          style={{ height: 150 }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
        {!hasDrawn && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-sm text-muted-foreground">Firma aquí</span>
          </div>
        )}
        <button
          type="button"
          onClick={clear}
          className="absolute top-2 right-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Limpiar
        </button>
      </div>
      <Button onClick={handleSign} disabled={!hasDrawn || disabled} className="w-full">
        Certificar y firmar contrato
      </Button>
    </div>
  );
}

