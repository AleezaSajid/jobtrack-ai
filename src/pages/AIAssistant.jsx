import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Paperclip, Send } from 'lucide-react'
import { useApplications } from '../hooks/useApplications.jsx'
import { useToast } from '../hooks/useToast'
import { askOllama } from '../services/ollamaService'
import { isValidResume, pickRecommendedResume } from '../utils/aiAssistantEngine'

const prompts = [
  {title: 'Draft Follow-up Email', description: 'Write a recruiter note', prompt: 'Draft a recruiter follow-up email for my priority application.'},
  {title: 'Interview Questions', description: 'Practice for the next call', prompt: 'Generate technical interview questions for my upcoming interview.'},
  {title: 'Resume Match', description: 'Improve role alignment', prompt: 'Review my resume and suggest improvements for my tracked applications.'},
  {title: 'Prioritize Applications', description: 'Choose the next focus', prompt: 'Which application should I prioritize next and why?'},
  {title: 'STAR Answers', description: 'Prepare behavioral stories', prompt: 'Help me prepare behavioral STAR answers for my interview.'},
  {title: 'Weekly Plan', description: 'Plan job-search actions', prompt: 'Create a weekly job search plan based on my current pipeline and resume.'},
]

const buildWorkspaceContext = ({applications, resumes, attachedResume, messages}) => {
  const interviews = applications.filter((app) => app.status === 'Interview')
  const offers = applications.filter((app) => app.status === 'Offer')
  const latestApplications = applications.slice(0, 6)
  const recentMessages = messages.slice(-10)

  return [
    'JobTrack AI Workspace Context',
    '',
    `Applications: ${applications.length}`,
    `Interviews: ${interviews.length}`,
    `Offers: ${offers.length}`,
    `Uploaded Resumes: ${resumes.length}`,
    attachedResume ? `Attached Resume Context: ${attachedResume.name}` : 'Attached Resume Context: none',
    '',
    'Application List:',
    latestApplications.length
      ? latestApplications.map((app) => `${app.company} - ${app.role} - ${app.status}${app.location ? ` - ${app.location}` : ''}`).join('\n')
      : 'No applications tracked yet.',
    '',
    'Resume Versions:',
    resumes.length
      ? resumes.map((resume) => `${resume.name}${resume.target ? ` - ${resume.target}` : ''}`).join('\n')
      : 'No resumes uploaded yet.',
    '',
    'Recent Chat History:',
    recentMessages.length
      ? recentMessages.map((item) => `${item.role === 'user' ? 'User' : 'JobTrack AI'}: ${item.text}`).join('\n')
      : 'No recent chat history.',
  ].join('\n')
}

export default function AIAssistant(){
  const { applications, resumes, assistantMessages, addAssistantMessage, clearAssistantMessages } = useApplications()
  const { showToast } = useToast()
  const [draft, setDraft] = useState('')
  const [thinking, setThinking] = useState(false)
  const [attachedResume, setAttachedResume] = useState(null)
  const [openContextSection, setOpenContextSection] = useState('')
  const messagesRef = useRef(null)
  const inputRef = useRef(null)
  const interviews = useMemo(() => applications.filter((app) => app.status === 'Interview'), [applications])
  const offers = useMemo(() => applications.filter((app) => app.status === 'Offer'), [applications])
  const recommendedResume = useMemo(() => pickRecommendedResume(resumes), [resumes])
  const latestApplication = applications[0]

  useEffect(() => {
    if(messagesRef.current){
      messagesRef.current.scrollTo({
        top: messagesRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [assistantMessages, thinking])

  const sendMessage = useCallback(async (text = draft) => {
    const trimmed = text.trim()
    if(!trimmed || thinking) return

    addAssistantMessage({role:'user', text: trimmed})
    setThinking(true)
    setDraft('')

    const pendingMessages = [...assistantMessages, {role: 'user', text: trimmed}]
    const context = buildWorkspaceContext({
      applications,
      resumes,
      attachedResume,
      messages: pendingMessages,
    })

    try{
      const response = await askOllama(trimmed, context)
      addAssistantMessage({role:'assistant', text: response})
      showToast('AI response generated from Ollama.', 'success')
    }catch(error){
      console.error('Ollama request failed', error)
      addAssistantMessage({role:'assistant', text: 'Ollama is not connected. Start Ollama and try again.'})
      showToast('Ollama is not connected. Start Ollama and try again.', 'error')
    }finally{
      setThinking(false)
    }
  }, [addAssistantMessage, applications, assistantMessages, attachedResume, draft, resumes, showToast, thinking])

  const attachResumeContext = useCallback(() => {
    if(!isValidResume(recommendedResume)){
      showToast('Please upload a valid resume first', 'error')
      return
    }
    setAttachedResume(recommendedResume)
    setDraft((current) => `${current ? `${current} ` : ''}Use ${recommendedResume.name} as resume context.`)
    inputRef.current?.focus()
    showToast('Resume context attached.', 'success')
  }, [recommendedResume, showToast])

  const resetChat = useCallback(() => {
    clearAssistantMessages()
    setAttachedResume(null)
    setOpenContextSection('')
    showToast('AI chat reset.', 'success')
  }, [clearAssistantMessages, showToast])

  const toggleContextSection = useCallback((section) => {
    setOpenContextSection((current) => current === section ? '' : section)
  }, [])

  return (
    <motion.div className="page product-page ai-page" initial={{opacity: 0, y: 12}} animate={{opacity: 1, y: 0}}>
      <div className="page-title ai-hero">
        <div>
          <h1>AI Career Copilot</h1>
          <p className="lead">Get personalized interview preparation, resume advice, follow-up messages, and job search guidance powered by your application history.</p>
          <div className="ai-hero-badges">
            <span>✓ {applications.length} Applications Tracked</span>
            <span>✓ {interviews.length} Interview Upcoming</span>
            <span>✓ {resumes.length} Resume Versions</span>
          </div>
        </div>
        <motion.button className="btn btn-subtle" type="button" whileTap={{scale: 0.97}} onClick={resetChat}>Reset chat</motion.button>
      </div>

      <section className="ai-workspace">
        <motion.div className="card chat-panel" layout>
          <div className="chat-messages" ref={messagesRef} aria-live="polite">
            <AnimatePresence>
            {assistantMessages.length === 0 ? (
              <motion.div className="ai-empty-state" initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}}>
                <div className="ai-empty-icon" aria-hidden="true">AI</div>
                <h2>AI Career Copilot</h2>
                <p>Try asking:</p>
                <ul>
                  <li>Interview Prep</li>
                  <li>Resume Review</li>
                  <li>Follow-up Email</li>
                  <li>React Learning</li>
                </ul>
              </motion.div>
            ) : assistantMessages.map((message) => (
              <motion.div
                className={`chat-message ${message.role}`}
                key={message.id}
                layout
                initial={{opacity: 0, y: 10, scale: 0.98}}
                animate={{opacity: 1, y: 0, scale: 1}}
                exit={{opacity: 0, y: -8}}
              >
                {message.role === 'assistant' ? <span className="assistant-avatar" aria-hidden="true">JT</span> : null}
                <div className={`chat-bubble ${message.role}`}>
                  <span>{message.role === 'assistant' ? 'JobTrack AI' : 'You'}</span>
                  <p>{message.text}</p>
                  <time>Just now</time>
                </div>
              </motion.div>
            ))}
            {thinking ? (
              <motion.div className="chat-message assistant typing-bubble" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                <span className="assistant-avatar" aria-hidden="true">JT</span>
                <div className="chat-bubble assistant">
                  <span>JobTrack AI</span>
                  <p className="thinking-dots">Thinking<span>.</span><span>.</span><span>.</span></p>
                  <time>Just now</time>
                </div>
              </motion.div>
            ) : null}
            </AnimatePresence>
          </div>

          <div className="prompt-row ai-action-grid">
            {prompts.map((item) => (
              <motion.button className="prompt-chip ai-action-card" type="button" key={item.title} whileTap={{scale: 0.96}} onClick={() => sendMessage(item.prompt)} disabled={thinking}>
                <strong>{item.title}</strong>
              </motion.button>
            ))}
          </div>

          <form className="chat-composer" onSubmit={(event) => {
            event.preventDefault()
            sendMessage()
          }}>
            <label className="sr-only" htmlFor="assistant-message">Message AI assistant</label>
            <input
              ref={inputRef}
              id="assistant-message"
              className="input"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask about interviews, resumes, follow-ups, or applications..."
            />
            <motion.button className="btn btn-subtle attach-resume-button" type="button" whileTap={{scale: 0.97}} onClick={attachResumeContext}>
              <Paperclip size={16} />
              Attach Resume
            </motion.button>
            <motion.button className="btn btn-primary send-message-button" type="submit" whileTap={{scale: 0.97}} disabled={thinking}>
              <Send size={16} />
              Send
            </motion.button>
          </form>
        </motion.div>

        <motion.aside className="card ai-context-panel" whileHover={{y: -3}}>
          <h2>Career Snapshot</h2>
          <div className="context-stack">
            <div>
              <strong>{applications.length}</strong>
              <span>Applications</span>
            </div>
            <div>
              <strong>{interviews.length}</strong>
              <span>Interviews</span>
            </div>
            <div>
              <strong>{offers.length}</strong>
              <span>Offers</span>
            </div>
            <div>
              <strong>{resumes.length}</strong>
              <span>Resume Versions</span>
            </div>
          </div>
          <div className="ai-tip">
            <span className="eyebrow">Recommended Resume</span>
            <p>{recommendedResume?.name || 'No valid resume selected'}</p>
          </div>

          <div className="context-disclosures">
            <div className="context-disclosure">
              <button type="button" onClick={() => toggleContextSection('priority')} aria-expanded={openContextSection === 'priority'}>
                <span>Priority Action</span>
                <ChevronDown size={14} />
              </button>
              {openContextSection === 'priority' ? (
                <p>Follow up with {interviews[0]?.company || latestApplication?.company || 'your priority application'}.</p>
              ) : null}
            </div>

            <div className="context-disclosure">
              <button type="button" onClick={() => toggleContextSection('insights')} aria-expanded={openContextSection === 'insights'}>
                <span>AI Insights</span>
                <ChevronDown size={14} />
              </button>
              {openContextSection === 'insights' ? (
                <ul>
                  <li>{interviews[0]?.company || 'Interview-stage roles'} should stay first.</li>
                  <li>Use concise prompts for faster Ollama responses.</li>
                  <li>{recommendedResume?.name || 'A valid resume'} is the resume context.</li>
                </ul>
              ) : null}
            </div>

            <div className="context-disclosure">
              <button type="button" onClick={() => toggleContextSection('recent')} aria-expanded={openContextSection === 'recent'}>
                <span>Recent Context</span>
                <ChevronDown size={14} />
              </button>
              {openContextSection === 'recent' ? (
                <dl>
                  <dt>Latest application</dt>
                  <dd>{latestApplication?.company || 'None'}</dd>
                  <dt>Active resume</dt>
                  <dd>{recommendedResume?.name || 'None'}</dd>
                  <dt>Next action</dt>
                  <dd>{interviews.length ? 'Prepare interview' : 'Review pipeline'}</dd>
                </dl>
              ) : null}
            </div>
          </div>
        </motion.aside>
      </section>
    </motion.div>
  )
}
