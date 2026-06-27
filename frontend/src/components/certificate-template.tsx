import React, { forwardRef } from 'react'

export interface CertificateTemplateProps {
  recipientName: string
  eventTitle: string
  eventDate?: string
  certType: string
  verifyCode?: string | null
  issuedDate?: string | null
}

const W = 1122
const H = 794

const CertificateTemplate = forwardRef<HTMLDivElement, CertificateTemplateProps>(
  ({ recipientName, eventTitle, eventDate, certType, verifyCode, issuedDate }, ref) => {
    const formattedIssued = issuedDate
      ? new Date(issuedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

    const certAction =
      certType === 'Attendance' ? 'attending'
      : certType === 'Completion' ? 'completing'
      : 'participating in'

    // Pre-compute burst rays for the medallion (24 rays)
    const MEDAL_CX = 56
    const MEDAL_CY = 57
    const rays = Array.from({ length: 24 }, (_, i) => {
      const a = ((i * 15) - 90) * (Math.PI / 180)
      return {
        x1: MEDAL_CX + Math.cos(a) * 53,
        y1: MEDAL_CY + Math.sin(a) * 53,
        x2: MEDAL_CX + Math.cos(a) * 67,
        y2: MEDAL_CY + Math.sin(a) * 67,
      }
    })

    // Corner ornament positions on the inner border
    const cornerOrnaments = [
      { x: 74, y: 68 }, { x: W - 74, y: 68 },
      { x: 74, y: H - 44 }, { x: W - 74, y: H - 44 },
    ]

    return (
      <div
        ref={ref}
        style={{
          width: W,
          height: H,
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#fdfcf8',
          fontFamily: 'Arial, sans-serif',
          boxSizing: 'border-box',
        }}
      >
        {/* ═══════════════════════════════════
            SVG BACKGROUND LAYER
            ═══════════════════════════════════ */}
        <svg
          style={{ position: 'absolute', top: 0, left: 0, width: W, height: H }}
          viewBox={`0 0 ${W} ${H}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Metallic gold — horizontal sheen */}
            <linearGradient id="gGold" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#6B4A00" />
              <stop offset="18%"  stopColor="#B8860B" />
              <stop offset="42%"  stopColor="#F5E199" />
              <stop offset="60%"  stopColor="#C9A227" />
              <stop offset="82%"  stopColor="#E8CC7B" />
              <stop offset="100%" stopColor="#6B4A00" />
            </linearGradient>

            {/* Metallic gold — diagonal sheen (for corner trims) */}
            <linearGradient id="gGoldD" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#6B4A00" />
              <stop offset="35%"  stopColor="#F5E199" />
              <stop offset="65%"  stopColor="#C9A227" />
              <stop offset="100%" stopColor="#6B4A00" />
            </linearGradient>

            {/* Deep green for corners */}
            <linearGradient id="gGreen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#043d2d" />
              <stop offset="50%"  stopColor="#0a6e5a" />
              <stop offset="100%" stopColor="#0e8a72" />
            </linearGradient>

            {/* Medal radial gradient — gold disc */}
            <radialGradient id="gMedal" cx="38%" cy="32%" r="68%">
              <stop offset="0%"   stopColor="#FFFAE0" />
              <stop offset="30%"  stopColor="#F5D76E" />
              <stop offset="70%"  stopColor="#C9A227" />
              <stop offset="100%" stopColor="#6B4A00" />
            </radialGradient>

            {/* Medal inner ring */}
            <radialGradient id="gMedalInner" cx="35%" cy="30%" r="65%">
              <stop offset="0%"   stopColor="#FFE08C" />
              <stop offset="100%" stopColor="#7B5800" />
            </radialGradient>

            {/* Wax seal */}
            <radialGradient id="gSeal" cx="36%" cy="32%" r="68%">
              <stop offset="0%"   stopColor="#FF7B7B" />
              <stop offset="50%"  stopColor="#C0392B" />
              <stop offset="100%" stopColor="#6B0000" />
            </radialGradient>

            {/* Subtle YLSH watermark pattern */}
            <pattern id="pWatermark" x="0" y="0" width="210" height="210" patternUnits="userSpaceOnUse">
              <text
                x="105" y="115"
                textAnchor="middle"
                fill="rgba(8,47,73,0.040)"
                fontSize="26"
                fontWeight="bold"
                fontFamily="Arial"
                transform="rotate(-45,105,105)"
              >
                YLSH
              </text>
            </pattern>
          </defs>

          {/* Warm off-white base + watermark */}
          <rect x="0" y="0" width={W} height={H} fill="#fdfcf8" />
          <rect x="0" y="0" width={W} height={H} fill="url(#pWatermark)" />

          {/* ── TOP-LEFT green corner ─────────────────── */}
          {/* Main green shape */}
          <path
            d="M0,0 L430,0 Q310,65 210,175 Q105,290 0,420 Z"
            fill="url(#gGreen)"
          />
          {/* Fan swoosh 1 – broad outer band */}
          <path
            d="M325,0 L395,0
               Q272,66 170,178
               Q70,286 0,408
               L0,420
               Q105,290 210,175
               Q310,65 325,0 Z"
            fill="rgba(255,255,255,0.26)"
          />
          {/* Fan swoosh 2 */}
          <path
            d="M228,0 L300,0
               Q186,64 92,170
               Q20,250 0,330
               L0,350
               Q22,268 95,186
               Q188,78 228,0 Z"
            fill="rgba(255,255,255,0.19)"
          />
          {/* Fan swoosh 3 – narrow inner */}
          <path
            d="M145,0 L210,0
               Q112,62 35,158
               Q8,190 0,225
               L0,247
               Q9,210 38,177
               Q116,78 145,0 Z"
            fill="rgba(255,255,255,0.13)"
          />
          {/* Gold trim edge of green corner */}
          <path
            d="M430,0 L452,0
               Q328,67 225,178
               Q117,293 0,426
               L0,420
               Q105,290 210,175
               Q310,65 430,0 Z"
            fill="url(#gGoldD)"
          />

          {/* Two thin gold accent stripes (in white area, just outside the green) */}
          <path
            d="M455,0 L478,0
               Q354,68 250,180
               Q138,295 22,428
               L0,428 L0,426
               Q117,293 225,178
               Q328,65 455,0 Z"
            fill="url(#gGoldD)"
            opacity="0.6"
          />
          <path
            d="M482,0 L500,0
               Q376,67 272,178
               Q158,293 42,428
               L22,428
               Q138,293 250,178
               Q354,65 482,0 Z"
            fill="#E8CC7B"
            opacity="0.32"
          />

          {/* ── BOTTOM-RIGHT green corner (mirror) ────── */}
          <path
            d={`M${W},${H} L${W-430},${H} Q${W-310},${H-65} ${W-210},${H-175} Q${W-105},${H-290} ${W},${H-420} Z`}
            fill="url(#gGreen)"
          />
          <path
            d={`M${W-325},${H} L${W-395},${H} Q${W-272},${H-66} ${W-170},${H-178} Q${W-70},${H-286} ${W},${H-408} L${W},${H-420} Q${W-105},${H-290} ${W-210},${H-175} Q${W-310},${H-65} ${W-325},${H} Z`}
            fill="rgba(255,255,255,0.26)"
          />
          <path
            d={`M${W-228},${H} L${W-300},${H} Q${W-186},${H-64} ${W-92},${H-170} Q${W-20},${H-250} ${W},${H-330} L${W},${H-350} Q${W-22},${H-268} ${W-95},${H-186} Q${W-188},${H-78} ${W-228},${H} Z`}
            fill="rgba(255,255,255,0.19)"
          />
          <path
            d={`M${W-145},${H} L${W-210},${H} Q${W-112},${H-62} ${W-35},${H-158} Q${W-8},${H-190} ${W},${H-225} L${W},${H-247} Q${W-9},${H-210} ${W-38},${H-177} Q${W-116},${H-78} ${W-145},${H} Z`}
            fill="rgba(255,255,255,0.13)"
          />
          <path
            d={`M${W-430},${H} L${W-452},${H} Q${W-328},${H-67} ${W-225},${H-178} Q${W-117},${H-293} ${W},${H-426} L${W},${H-420} Q${W-105},${H-290} ${W-210},${H-175} Q${W-310},${H-65} ${W-430},${H} Z`}
            fill="url(#gGoldD)"
          />
          <path
            d={`M${W-455},${H} L${W-478},${H} Q${W-354},${H-68} ${W-250},${H-180} Q${W-138},${H-295} ${W-22},${H-428} L${W},${H-428} L${W},${H-426} Q${W-117},${H-293} ${W-225},${H-178} Q${W-328},${H-65} ${W-455},${H} Z`}
            fill="url(#gGoldD)"
            opacity="0.6"
          />
          <path
            d={`M${W-482},${H} L${W-500},${H} Q${W-376},${H-67} ${W-272},${H-178} Q${W-158},${H-293} ${W-42},${H-428} L${W-22},${H-428} Q${W-138},${H-293} ${W-250},${H-178} Q${W-354},${H-65} ${W-482},${H} Z`}
            fill="#E8CC7B"
            opacity="0.32"
          />

          {/* ── BOTTOM gold bar ─────────── */}
          <rect x="0" y={H - 30} width={W} height="30" fill="url(#gGold)" />
          <rect x="0" y={H - 38} width={W} height="8" fill="#5C3A00" opacity="0.45" />

          {/* ── TOP gold strip ─────────── */}
          <rect x="0" y="0" width={W} height="8" fill="url(#gGold)" />

          {/* ── Inner decorative double border ─────────── */}
          <rect x="74" y="68" width={W - 148} height={H - 112} fill="none" stroke="url(#gGold)" strokeWidth="2.5" />
          <rect x="79" y="73" width={W - 158} height={H - 122} fill="none" stroke="#C9A227" strokeWidth="0.8" />

          {/* Corner diamond ornaments on the inner border */}
          {cornerOrnaments.map((pt, i) => (
            <g key={i} transform={`translate(${pt.x},${pt.y})`}>
              <rect x="-9" y="-9" width="18" height="18" fill="#C9A227" transform="rotate(45)" />
              <rect x="-5.5" y="-5.5" width="11" height="11" fill="#fdfcf8" transform="rotate(45)" />
              <rect x="-3" y="-3" width="6" height="6" fill="#C9A227" transform="rotate(45)" />
            </g>
          ))}

          {/* ── TOP-RIGHT gold medallion ────────────── */}
          <g transform="translate(1004, 8)">
            {/* Burst rays */}
            {rays.map((r, i) => (
              <line
                key={i}
                x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
                stroke="#C9A227"
                strokeWidth={i % 2 === 0 ? 3 : 1.8}
                strokeLinecap="round"
                opacity="0.9"
              />
            ))}
            {/* Drop shadow ring */}
            <circle cx={MEDAL_CX + 2} cy={MEDAL_CY + 3} r="50" fill="rgba(0,0,0,0.18)" />
            {/* Outer bezel */}
            <circle cx={MEDAL_CX} cy={MEDAL_CY} r="50" fill="#4A3000" />
            {/* Main disc */}
            <circle cx={MEDAL_CX} cy={MEDAL_CY} r="46" fill="url(#gMedal)" />
            {/* Engraved ring */}
            <circle cx={MEDAL_CX} cy={MEDAL_CY} r="39" fill="none" stroke="#5C3A00" strokeWidth="3" />
            <circle cx={MEDAL_CX} cy={MEDAL_CY} r="37" fill="#F5E199" />
            {/* Inner disc */}
            <circle cx={MEDAL_CX} cy={MEDAL_CY} r="31" fill="url(#gMedalInner)" />
            {/* Dark centre */}
            <circle cx={MEDAL_CX} cy={MEDAL_CY} r="22" fill="#4A3000" />
            {/* Gold star */}
            <text
              x={MEDAL_CX} y={MEDAL_CY + 8}
              textAnchor="middle"
              fill="#FFD700"
              fontSize="26"
              fontWeight="bold"
              fontFamily="Arial"
            >
              ★
            </text>

            {/* Red ribbon */}
            <rect x="33" y="100" width="46" height="7" rx="3" fill="#9B1C1C" />
            <rect x="33" y="100" width="46" height="3.5" rx="3" fill="rgba(255,255,255,0.18)" />
            <path d="M 33,105 L 56,128 L 79,105 L 73,158 L 56,140 L 39,158 Z" fill="#B22222" />
            <path d="M 33,105 L 56,128 L 79,105 Q 80,113 77,118 L 56,136 L 35,118 Q 32,113 33,105 Z" fill="#7B0000" />
            <path d="M 44,105 L 56,128 L 68,105 Z" fill="rgba(255,255,255,0.1)" />
          </g>
        </svg>

        {/* ═══════════════════════════════════
            HTML CONTENT LAYER
            ═══════════════════════════════════ */}
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, width: W, height: H,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            paddingTop: 44,
            paddingLeft: 188,
            paddingRight: 138,
            paddingBottom: 44,
            textAlign: 'center',
            boxSizing: 'border-box',
          }}
        >
          {/* ── Logo badge ── */}
          <div
            style={{
              width: 74, height: 74,
              borderRadius: '50%',
              flexShrink: 0,
              background: 'linear-gradient(145deg, #061e35, #0a3a5c)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: 17, fontWeight: 900, letterSpacing: 0,
              border: '3.5px solid #C9A227',
              boxShadow: '0 0 0 1.5px #7B5800, 0 4px 16px rgba(201,162,39,0.35)',
              marginBottom: 10,
              fontFamily: '"Arial Black", Arial, sans-serif',
            }}
          >
            <span style={{ color: '#fff' }}>YL</span>
            <span style={{ color: '#4dd9c0' }}>SH</span>
          </div>

          {/* ── Organisation name ── */}
          <div
            style={{
              fontSize: 21,
              fontWeight: 900,
              letterSpacing: 4,
              color: '#082F49',
              fontFamily: '"Arial Black", "Impact", Arial, sans-serif',
              textTransform: 'uppercase',
              marginBottom: 5,
              lineHeight: 1.05,
            }}
          >
            Youth Leadership &amp; Skills Hub
          </div>

          {/* ── Event title (sub-heading) ── */}
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2.5,
              color: '#082F49',
              fontFamily: 'Arial, sans-serif',
              textTransform: 'uppercase',
              marginBottom: eventDate ? 2 : 0,
            }}
          >
            {eventTitle}
          </div>

          {eventDate && (
            <div style={{ fontSize: 10, color: '#888', letterSpacing: 1 }}>
              {eventDate}
            </div>
          )}

          {/* ── Ornamental divider ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, margin: '11px 0 13px' }}>
            <div style={{ width: 60, height: 1.5, background: 'linear-gradient(to right, transparent, #C9A227)' }} />
            <span style={{ color: '#C9A227', fontSize: 18, lineHeight: 1 }}>✦</span>
            <div style={{ width: 18, height: 1.5, backgroundColor: '#C9A227' }} />
            <span style={{ color: '#C9A227', fontSize: 10, lineHeight: 1 }}>✦</span>
            <div style={{ width: 18, height: 1.5, backgroundColor: '#C9A227' }} />
            <span style={{ color: '#C9A227', fontSize: 18, lineHeight: 1 }}>✦</span>
            <div style={{ width: 60, height: 1.5, background: 'linear-gradient(to left, transparent, #C9A227)' }} />
          </div>

          {/* ── "Certificate of …" in script ── */}
          <div
            style={{
              fontSize: 50,
              color: '#082F49',
              lineHeight: 1.05,
              marginBottom: 10,
              fontFamily: '"Brush Script MT", "Segoe Script", "Palatino Linotype", cursive',
              letterSpacing: 0.5,
            }}
          >
            Certificate of {certType}
          </div>

          {/* ── "Presented to" ── */}
          <div
            style={{
              fontSize: 10,
              letterSpacing: 4,
              color: '#777',
              fontFamily: 'Arial, sans-serif',
              textTransform: 'uppercase',
              marginBottom: 11,
            }}
          >
            This Certificate is Proudly Presented to
          </div>

          {/* ── Gold rule + Recipient name + Gold rule ── */}
          <div
            style={{
              width: '76%',
              height: 2,
              background: 'linear-gradient(to right, transparent, #C9A227 18%, #F5E199 50%, #C9A227 82%, transparent)',
              marginBottom: 9,
            }}
          />
          <div
            style={{
              fontSize: 38,
              fontWeight: 900,
              color: '#082F49',
              letterSpacing: 2.5,
              fontFamily: '"Arial Black", Impact, Arial, sans-serif',
              textTransform: 'uppercase',
              lineHeight: 1.1,
              marginBottom: 9,
            }}
          >
            {recipientName}
          </div>
          <div
            style={{
              width: '76%',
              height: 2,
              background: 'linear-gradient(to right, transparent, #C9A227 18%, #F5E199 50%, #C9A227 82%, transparent)',
              marginBottom: 13,
            }}
          />

          {/* ── Body text ── */}
          <div
            style={{
              fontSize: 13,
              color: '#2c2c2c',
              lineHeight: 1.75,
              maxWidth: 575,
              fontFamily: 'Georgia, "Times New Roman", serif',
            }}
          >
            for successfully{' '}
            <em style={{ fontStyle: 'italic' }}>{certAction}</em> the{' '}
            <strong style={{ color: '#082F49' }}>{eventTitle}</strong>{' '}
            programme organized by the{' '}
            <strong>Youth Leadership &amp; Skills Hub (YLSH)</strong>.
          </div>

          {/* ── Issued date & verify code ── */}
          <div
            style={{
              fontSize: 11,
              color: '#888',
              fontStyle: 'italic',
              fontFamily: 'Georgia, serif',
              marginTop: 7,
            }}
          >
            Issued on {formattedIssued}
            {verifyCode && (
              <span>
                {'  ·  '}Verification Code:{' '}
                <span
                  style={{
                    color: '#082F49',
                    fontStyle: 'normal',
                    fontFamily: '"Courier New", Courier, monospace',
                    fontWeight: 700,
                    letterSpacing: 2,
                  }}
                >
                  {verifyCode}
                </span>
              </span>
            )}
          </div>

          {/* ── Signature row ── */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              width: '86%',
              marginTop: 'auto',
              paddingBottom: 10,
            }}
          >
            {/* Left signature */}
            <div style={{ textAlign: 'center', width: 180 }}>
              <div
                style={{
                  fontFamily: '"Brush Script MT", "Segoe Script", cursive',
                  fontSize: 30,
                  color: '#082F49',
                  lineHeight: 1,
                  marginBottom: 5,
                  letterSpacing: 0.5,
                }}
              >
                Coordinator
              </div>
              <div
                style={{
                  width: '100%',
                  height: 1.5,
                  background: 'linear-gradient(to right, transparent, #082F49 20%, #082F49 80%, transparent)',
                  marginBottom: 5,
                }}
              />
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: '#082F49',
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  fontFamily: 'Arial, sans-serif',
                }}
              >
                Event Coordinator
              </div>
            </div>

            {/* Centre — inline wax seal (guarantees correct alignment) */}
            <div style={{ flexShrink: 0, marginBottom: 2 }}>
              <svg width="84" height="84" viewBox="0 0 84 84" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="inlineSeal" cx="36%" cy="32%" r="68%">
                    <stop offset="0%"   stopColor="#FF7B7B" />
                    <stop offset="50%"  stopColor="#C0392B" />
                    <stop offset="100%" stopColor="#6B0000" />
                  </radialGradient>
                </defs>
                {/* shadow */}
                <circle cx="43" cy="44" r="39" fill="rgba(0,0,0,0.18)" />
                {/* main disc */}
                <circle cx="42" cy="42" r="39" fill="url(#inlineSeal)" />
                {/* outer serrated edge */}
                <circle cx="42" cy="42" r="34" fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="2.5" strokeDasharray="4,3.5" />
                {/* inner ring */}
                <circle cx="42" cy="42" r="27" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                <text x="42" y="37" textAnchor="middle" fill="white" fontSize="11" fontWeight="900" fontFamily="Arial" letterSpacing="1.5">YLSH</text>
                <text x="42" y="49.5" textAnchor="middle" fill="rgba(255,255,255,0.88)" fontSize="8.5" fontFamily="Arial" letterSpacing="0.5">CERTIFIED</text>
                <text x="42" y="61" textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize="9" fontFamily="Arial">✦ ✦ ✦</text>
              </svg>
            </div>

            {/* Right signature */}
            <div style={{ textAlign: 'center', width: 180 }}>
              <div
                style={{
                  fontFamily: '"Brush Script MT", "Segoe Script", cursive',
                  fontSize: 30,
                  color: '#082F49',
                  lineHeight: 1,
                  marginBottom: 5,
                  letterSpacing: 0.5,
                }}
              >
                Director
              </div>
              <div
                style={{
                  width: '100%',
                  height: 1.5,
                  background: 'linear-gradient(to right, transparent, #082F49 20%, #082F49 80%, transparent)',
                  marginBottom: 5,
                }}
              />
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: '#082F49',
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  fontFamily: 'Arial, sans-serif',
                }}
              >
                Program Director
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

CertificateTemplate.displayName = 'CertificateTemplate'
export default CertificateTemplate
