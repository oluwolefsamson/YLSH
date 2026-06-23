import React, { FC } from 'react'
import { Sparkles } from 'lucide-react'

const HomeAIChat: FC = () => {
  return (
    <section className="py-16 md:py-20 bg-slate-50">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 text-white" style={{ backgroundColor: '#082F49' }}>
            <Sparkles size={13} />
            AI Assistant
          </span>
          <h2 className="text-[24px] sm:text-[36px] font-extrabold tracking-tight leading-tight mb-3">
            Have questions? Ask our AI
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Get instant answers about YLSH events, mentorship, certificates, and more — powered by AI.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <iframe
            src="https://app.chatsimple.ai/iframe23/50175e0b-a141-4531-be7f-ee09a997ac88/acc23e0a-e003-4b52-81e4-afcd7a5253e0/3cfb0e03-a23e-4dc4-bf64-7b985bbe0e58"
            height="480"
            title="YLSH AI Assistant"
            style={{
              display: 'block',
              width: '100%',
              border: 'none',
              borderRadius: 20,
              boxShadow: '0px 12px 40px 0px rgba(0,0,0,0.12)',
            }}
          />
        </div>
      </div>
    </section>
  )
}

export default HomeAIChat
