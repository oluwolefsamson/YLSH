interface IphoneProps {
  videoSrc: string
}

export function Iphone({ videoSrc }: IphoneProps) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 434,
        margin: '0 auto',
        aspectRatio: '434 / 680',
        borderRadius: 56,
        padding: 10,
        background: 'linear-gradient(180deg, #171717 0%, #050505 22%, #111111 50%, #000000 100%)',
        boxShadow: '0 28px 80px rgba(0, 0, 0, 0.28)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 8,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 140,
          height: 26,
          borderRadius: '0 0 18px 18px',
          backgroundColor: '#0a0a0a',
          zIndex: 2,
        }}
      />
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          borderRadius: 38,
          backgroundColor: '#000',
        }}
      >
        <video
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-label="iPhone demo video"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            border: 0,
            display: 'block',
            backgroundColor: '#000',
          }}
        />
      </div>
      <div
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          inset: 0,
          borderRadius: 56,
          boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.08)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 8,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 118,
          height: 5,
          borderRadius: 999,
          backgroundColor: 'rgba(255, 255, 255, 0.65)',
          zIndex: 2,
        }}
      />
    </div>
  )
}
