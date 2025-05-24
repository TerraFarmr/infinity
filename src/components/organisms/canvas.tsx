import type { KonvaEventObject } from 'konva/lib/Node';
import { useEffect, useRef, useState } from "react";
import { Layer, Stage } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import {
  addRectangle,
  selectIsDarkMode,
  selectMode,
  selectPosition,
  selectRectangle,
  selectRectangles,
  selectScale,
  selectSelectedId,
  updateCanvas,
  updateRectangle
} from "../../utils/redux/canvasSlice";
import type { PanStart, TempRect } from "../../utils/types/canvas.types";
import Rectangle from "../atoms/Rectangle";

const CANVAS_WIDTH = window.innerWidth;
const CANVAS_HEIGHT = window.innerHeight;

const InfiniteCanvas = () => {
  const dispatch = useDispatch();
  const mode = useSelector(selectMode);
  const rectangles = useSelector(selectRectangles);
  const scale = useSelector(selectScale);
  const position = useSelector(selectPosition);
  const selectedId = useSelector(selectSelectedId);
  const isDarkMode = useSelector(selectIsDarkMode);

  // Drawing state
  const [drawing, setDrawing] = useState<null | { x: number; y: number }>(null);
  const [tempRect, setTempRect] = useState<TempRect | null>(null);

  // Panning state
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef<PanStart | null>(null);

  // Deselect logic
  const checkDeselect = (e: KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) {
      dispatch(selectRectangle(null));
    }
  };

  // Drawing logic
  const screenToWorld = (x: number, y: number) => ({
    x: (x - position.x) / scale,
    y: (y - position.y) / scale,
  });

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (mode === "view") checkDeselect(e);
    // Don't start panning if clicking on transformer handles
    if (e.target.getParent()?.className === 'Transformer') {
      return;
    }
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;
    if (mode === "draw") {
      // Start drawing
      const { x, y } = screenToWorld(pos.x, pos.y);
      setDrawing({ x, y });
      setTempRect(null);
    } else {
      // Start panning
      setIsPanning(true);
      panStart.current = { x: pos.x, y: pos.y, offsetX: position.x, offsetY: position.y };
    }
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (drawing) {
      // Update temp rect
      const pos = e.target.getStage()?.getPointerPosition();
      if (!pos || !drawing) return;
      const { x, y } = screenToWorld(pos.x, pos.y);
      setTempRect({
        x: Math.min(drawing.x, x),
        y: Math.min(drawing.y, y),
        width: Math.abs(x - drawing.x),
        height: Math.abs(y - drawing.y),
        fill: isDarkMode ? "#ffffff" : "#000000",
        stroke: isDarkMode ? "#000000" : "#ffffff"
      });
    } else if (isPanning && panStart.current) {
      const pos = e.target.getStage()?.getPointerPosition();
      if (!pos || !panStart.current) return;
      const dx = pos.x - panStart.current.x;
      const dy = pos.y - panStart.current.y;
      dispatch(updateCanvas({ position: { x: panStart.current.offsetX + dx, y: panStart.current.offsetY + dy } }));
    }
  };

  const handleMouseUp = (e: KonvaEventObject<MouseEvent>) => {
    if (drawing && tempRect && tempRect.width > 5 && tempRect.height > 5) {
      dispatch(addRectangle({ ...tempRect }));
    }
    setDrawing(null);
    setTempRect(null);
    setIsPanning(false);
    panStart.current = null;
  };

  // Zoom handler (throttled)
  const lastWheel = useRef(0);
  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const now = Date.now();
    if (now - lastWheel.current < 16) return; // ~60Hz
    lastWheel.current = now;

    const stage = e.target.getStage();
    if (!stage) return;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const oldScale = scale;
    const scaleBy = 1.05;
    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    // Zoom centered on pointer
    const mousePointTo = {
      x: (pointer.x - position.x) / oldScale,
      y: (pointer.y - position.y) / oldScale,
    };
    const newOffsetX = pointer.x - mousePointTo.x * newScale;
    const newOffsetY = pointer.y - mousePointTo.y * newScale;

    dispatch(updateCanvas({ scale: newScale, position: { x: newOffsetX, y: newOffsetY } }));
  };

  // Update rectangle colors when mode changes
  useEffect(() => {
    rectangles.forEach(rect => {
      dispatch(updateRectangle({
        id: rect.id,
        fill: isDarkMode ? "#ffffff" : "#000000",
        stroke: isDarkMode ? "#000000" : "#ffffff"
      }));
    });
  }, [isDarkMode, dispatch]);

  return (
    <Stage
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      x={position.x}
      y={position.y}
      scaleX={scale}
      scaleY={scale}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      className={`${isDarkMode ? 'bg-black' : 'bg-white'}`}
      style={{
        cursor: mode === "draw" ? "crosshair" : isPanning ? "grabbing" : "grab"
      }}
    >
      <Layer>
        {rectangles.map((rect) => (
          <Rectangle
            key={rect.id}
            shapeProps={rect}
            isSelected={rect.id === selectedId}
            onSelect={() => dispatch(selectRectangle(rect.id))}
            onChange={(newAttrs: any) => dispatch(updateRectangle({ id: rect.id, ...newAttrs }))}
          />
        ))}
        {/* Temporary rectangle while drawing */}
        {tempRect && (
          <Rectangle
            shapeProps={{...tempRect, id: 'temp_rect'}}
            isSelected={false}
            onSelect={() => {}}
            onChange={() => {}}
          />
        )}
      </Layer>
    </Stage>
  );
};

export default InfiniteCanvas;
