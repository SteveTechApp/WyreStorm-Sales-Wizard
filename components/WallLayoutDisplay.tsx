import React from 'react';
import { RoomData, Display } from '../utils/types';

const VIEWBOX_WIDTH = 1000;

const PowerIcon = ({ x, y }: { x: number; y: number }) => (
    <g transform={`translate(${x - 10}, ${y - 10})`}>
        <circle cx="10" cy="10" r="10" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
        <path d="M10 5 L7 11 H13 L10 17" stroke="#ca8a04" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
);

const DataIcon = ({ x, y }: { x: number; y: number }) => (
    <g transform={`translate(${x - 10}, ${y - 10})`}>
        <circle cx="10" cy="10" r="10" fill="#bae6fd" stroke="#0ea5e9" strokeWidth="1" />
        <rect x="6" y="8" width="8" height="6" rx="1" fill="#0ea5e9" />
        <path d="M6 9 H14" stroke="#fff" strokeWidth="1" />
        <path d="M6 11 H14" stroke="#fff" strokeWidth="1" />
        <path d="M6 13 H14" stroke="#fff" strokeWidth="1" />
    </g>
);

const renderDisplay = (d: Display, scale: number) => {
    if (d.type === 'LCD Video Wall' && d.rows && d.cols && d.bezelWidth) {
        const panelWidth = (d.width - ((d.cols - 1) * (d.bezelWidth / 1000))) / d.cols;
        const panelHeight = (d.height - ((d.rows - 1) * (d.bezelWidth / 1000))) / d.rows;
        return Array.from({ length: d.rows }).map((_, r) => (
            Array.from({ length: d.cols }).map((_, c) => (
                <rect
                    key={`${d.id}-${r}-${c}`}
                    x={(d.x + c * (panelWidth + d.bezelWidth! / 1000)) * scale}
                    y={(d.y + r * (panelHeight + d.bezelWidth! / 1000)) * scale}
                    width={panelWidth * scale}
                    height={panelHeight * scale}
                    className="fill-gray-700 stroke-gray-900"
                    strokeWidth="1"
                />
            ))
        ));
    }
    return <rect x={d.x * scale} y={d.y * scale} width={d.width * scale} height={d.height * scale} className="fill-gray-700 stroke-gray-900" strokeWidth="2" />;
};


const WallLayoutDisplay: React.FC<{ room: RoomData }> = ({ room }) => {
    if (!room.wallLayout || (room.wallLayout.displays.length === 0 && room.wallLayout.outlets.length === 0)) {
        return null;
    }

    const { wallLayout, dimensions } = room;
    const wallWidth = dimensions.width;
    const wallHeight = dimensions.height;
    const scale = VIEWBOX_WIDTH / wallWidth;
    const viewBoxHeight = wallHeight * scale;

    return (
        <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Wall Layout for: <span className="text-gray-900">{room.roomName}</span></h3>
            <div className="bg-gray-100 p-2 rounded-md border flex justify-center">
                 <svg width="100%" viewBox={`0 0 ${VIEWBOX_WIDTH} ${viewBoxHeight}`} className="bg-white shadow-inner">
                    <rect x="0" y="0" width={VIEWBOX_WIDTH} height={viewBoxHeight} className="fill-white stroke-gray-400" strokeWidth="2" />
                    <text x="10" y="20" className="text-xs fill-gray-500">{wallWidth}m x {wallHeight}m</text>
                    
                    {wallLayout.displays.map(d => (
                        <g key={d.id} >
                            {renderDisplay(d, scale)}
                        </g>
                    ))}

                    {wallLayout.outlets.map(o => (
                        <g key={o.id}>
                            {o.type === 'power' ? <PowerIcon x={o.x * scale} y={o.y * scale} /> : <DataIcon x={o.x * scale} y={o.y * scale} />}
                        </g>
                    ))}
                </svg>
            </div>
        </div>
    );
};

export default WallLayoutDisplay;
