import { AnimatePresence, motion } from 'motion/react';
import { Mic, Send, Volume2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useVoice } from '@/features/voice/useVoice';

export function VoicePage() {
  const { isListening, transcript, setTranscript, response, isThinking, startListening, stopListening, handleQuery } = useVoice();

  return (
    <div className="voice-page-shell">
      <div className="voice-orb-1" />
      <div className="voice-orb-2" />
      <div className="voice-stage">
        <span className="voice-badge">VOICE COPILOT</span>
        <h1 className="voice-title">Just ask. In any language.</h1>
        <p className="voice-subtitle">This demo stage follows the PRD interaction model: mic-first input, Hindi-friendly prompts, and fact-shaped answers.</p>

        <div className="voice-input-container">
          <button className={`mic-button ${isListening ? 'listening' : 'idle'}`} onClick={isListening ? stopListening : startListening} type="button">
            {isListening ? <><span className="pulse-ring" /><span className="pulse-ring" /></> : null}
            <Mic color="white" size={40} />
          </button>
          <div className="mic-status">{isListening ? 'Listening... speak now' : isThinking ? 'Understanding your question...' : 'Click to speak or type below'}</div>
          <div className="voice-input-row">
            <input className="voice-text-input" onChange={(event) => setTranscript(event.target.value)} placeholder="Ask about settlement, payment status, disputes, or today\'s collection" value={transcript} />
            <button className="voice-send-btn" onClick={() => void handleQuery(transcript)} type="button"><Send size={16} /></button>
          </div>
        </div>

        <div className="query-chips">
          {['Aaj kitna collected hua', 'Kya Rs 450 wala payment aaya', 'Mera dispute kab resolve hoga'].map((chip) => (
            <button className="query-chip" key={chip} onClick={() => void handleQuery(chip)} type="button">{chip}</button>
          ))}
        </div>

        <AnimatePresence>
          {isThinking ? <motion.div animate={{ opacity: 1 }} className="voice-response" initial={{ opacity: 0 }}><div className="thinking-dots"><span className="thinking-dot" /><span className="thinking-dot" /><span className="thinking-dot" /></div></motion.div> : null}
          {response ? (
            <motion.div animate={{ opacity: 1, y: 0 }} className="voice-response" initial={{ opacity: 0, y: 20 }}>
              <div className="response-label">AI Response</div>
              <div className="response-head-row"><div className="response-text">{response.answer}</div><button className="speaker-btn" type="button"><Volume2 size={16} /></button></div>
              <div className="response-data-points">
                {response.dataPoints.map((point) => <div className="data-point" key={point.label}><div className="data-point-value">{point.value}</div><div className="data-point-label">{point.label}</div></div>)}
              </div>
              <div className="response-actions">
                {response.suggestedActions.map((action) => <Link className="response-action-btn" key={action.route} to={action.route}>{action.label}</Link>)}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
