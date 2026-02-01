import { ImageResponse } from 'next/og'
import { Sparkles } from 'lucide-react'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
    width: 32,
    height: 32,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    fontSize: 20,
                    background: 'rgba(255, 183, 178, 0.2)', // bg-primary/20: #FFB7B2 at 20%
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFB7B2', // text-primary
                    borderRadius: '8px',
                }}
            >
                <Sparkles size={20} color="#FFB7B2" />
            </div>
        ),
        // ImageResponse options
        {
            ...size,
        }
    )
}
