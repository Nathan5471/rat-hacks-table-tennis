import React from 'react';
import { useOverlay } from '../contexts/OverlayContext';

export function Overlay() {
    const { isOverlayOpen, overlayContent } = useOverlay();

    if (!isOverlayOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#00245C] p-6 rounded-lg shadow-lg text-white">
                {overlayContent}
            </div>
        </div>
    )
}