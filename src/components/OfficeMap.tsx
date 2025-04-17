'use client';

import React, { useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Text, Line } from 'react-konva';
import { Desk } from '../api/apiClient';
import { useRouter } from 'next/navigation';

interface OfficeMapProps {
  desks: Desk[];
  onDeskSelect: (desk: Desk) => void;
}

const OfficeMap: React.FC<OfficeMapProps> = ({ desks, onDeskSelect }) => {
  const router = useRouter();
  const stageRef = useRef<any>(null);

  const officeData = {
    rooms: [
      { id: 2, x: 10, y: 10, width: 300, height: 200, name: "Pokój B" },
      { id: 1, x: 10, y: 220, width: 300, height: 200, name: "Pokój A" }
    ],
    doors: [
      { x: 10, y: 85, width: 10, height: 50 },
      { x: 80, y: 200, width: 50, height: 10 },
      { x: 10, y: 295, width: 10, height: 50 },
      { x: 80, y: 220, width: 50, height: 10 }
    ],
    windows: [
      { x1: 310, y1: 10, x2: 310, y2: 120 },
      { x1: 310, y1: 220, x2: 310, y2: 330 }
    ]
  };

  const deskPositions = [
    { id: 3, room: 2, x: 75, y: 35, angle: 180 },
    { id: 4, room: 2, x: 225, y: 165, angle: 0 },
    { id: 6, room: 2, x: 125, y: 165, angle: 0 },
    { id: 1, room: 1, x: 125, y: 5, angle: 0 },
    { id: 2, room: 1, x: 225, y: 5, angle: 90 },
    { id: 5, room: 1, x: 225, y: 5, angle: 0 }
  ];

  useEffect(() => {
    if (stageRef.current) {
      stageRef.current.width(350);
      stageRef.current.height(450);
    }
  }, []);

  const handleDeskClick = (desk: Desk) => {
    onDeskSelect(desk);
  };

  const handleQuickReserve = (desk: Desk) => {
    // onDeskSelect(desk);
    router.push(`/desk/${desk.id}/reserve`);
  };

  return (
    <Stage ref={stageRef}>
      <Layer>
        {officeData.rooms.map((room) => (
          <React.Fragment key={room.id}>
            <Rect
              x={room.x}
              y={room.y}
              width={room.width}
              height={room.height}
              fill="lightgray"
              stroke="black"
              strokeWidth={2}
            />
            <Text
              x={room.x + 10}
              y={room.y + 10}
              text={room.name}
              fontSize={14}
              fill="black"
            />
          </React.Fragment>
        ))}
        {officeData.doors.map((door, index) => (
          <Rect
            key={index}
            x={door.x}
            y={door.y}
            width={door.width}
            height={door.height}
            fill="blue"
            stroke="black"
            strokeWidth={1}
          />
        ))}
        {officeData.windows.map((window, index) => (
          <Line
            key={index}
            points={[window.x1, window.y1, window.x2, window.y2]}
            stroke="blue"
            strokeWidth={3}
          />
        ))}
        {desks.map((desk) => {
          const position = deskPositions.find((pos) => pos.id === desk.id) || 
                          { room: 1, x: 50, y: 50, angle: 0 };
          const room = officeData.rooms.find((r) => r.id === position.room);
          return (
            <React.Fragment key={desk.id}>
              <Rect
                x={position.x + room!.x}
                y={position.y + room!.y}
                width={70}
                height={30}
                fill={desk.isAvailable ? "green" : "red"}
                stroke="black"
                strokeWidth={1}
                cornerRadius={5}
                rotation={position.angle}
                onClick={() => handleDeskClick(desk)}
                onDblClick={() => desk.isAvailable ? handleQuickReserve(desk) : () => {}}
              />
              <Text
                x={position.x + room!.x + 35}
                y={position.y + room!.y + 15}
                text={desk.id.toString()}
                fontSize={14}
                fill="white"
                fontStyle="bold"
                align="center"
                offsetX={7}
                offsetY={7}
                rotation={position.angle}
              />
            </React.Fragment>
          );
        })}
      </Layer>
    </Stage>
  );
};

export default OfficeMap;
