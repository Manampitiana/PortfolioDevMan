import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WindowFrame from './WindowFrame';

const PROMPT = 'ravaka@portfolio:~$';

export default function Terminal({ aboutMe, skills = [], projects = [] }) {
  const navigate = useNavigate();
  const [lines, setLines] = useState([
    { type: 'system', text: "Tafiditra tao amin'ny terminal. Soraty 'help' raha te hahita ny commande azo ampiasaina." },
  ]);
  const [value, setValue] = useState('');
  const bodyRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [lines]);

  const commands = {
    help: () => [
      'Available commands:',
      '',
      'about        Show information about me',
      'projects     List my projects',
      'skills       My technical skills',
      'experience   My experience',
      'contact      Contact information',
      'github       Open my GitHub profile',
      'clear        Clear the terminal',
    ],
    about: () => {
      if (!aboutMe) return ['Mbola mampiditra ny data... andraso kely.'];
      return [
        `Name:     ${aboutMe.full_name || 'RAVAKA TSIRINIAINA Manampitiana'}`,
        `Role:     Full-Stack Web Developer`,
        `Location: ${aboutMe.location || 'Antananarivo, Madagascar'}`,
        `Email:    ${aboutMe.email || '—'}`,
      ];
    },
    skills: () => {
      if (!skills.length) return ['Mbola mampiditra ny skills... andraso kely.'];
      return skills.map((s) => `> ${s.name.padEnd(14, ' ')} ${s.level}%`);
    },
    projects: () => {
      if (!projects.length) return ['Mbola mampiditra ny projects... andraso kely.'];
      return projects.map((p) => `> ${p.title}`);
    },
    experience: () => {
      navigate('/');
      setTimeout(() => document.getElementById('experience-section')?.scrollIntoView({ behavior: 'smooth' }), 50);
      return ['Mizotra any amin\'ny fizarana Experience...'];
    },
    contact: () => {
      navigate('/contact');
      return ["Mizotra any amin'ny pejy Contact..."];
    },
    github: () => {
      window.open('https://github.com/Manampitiana', '_blank');
      return ['Manokatra ny GitHub profile...'];
    },
    clear: () => null,
  };

  const runCommand = (raw) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    setLines((prev) => [...prev, { type: 'input', text: cmd }]);

    if (cmd === 'clear') {
      setLines([]);
      return;
    }

    const handler = commands[cmd];
    if (handler) {
      const output = handler();
      if (output) {
        setLines((prev) => [...prev, ...output.map((text) => ({ type: 'output', text }))]);
      }
    } else {
      setLines((prev) => [
        ...prev,
        { type: 'error', text: `command not found: ${cmd} (soraty 'help')` },
      ]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    runCommand(value);
    setValue('');
  };

  return (
    <div id="terminal-window" onClick={() => inputRef.current?.focus()}>
      <WindowFrame title="Terminal">
        <div
          ref={bodyRef}
          className="h-64 sm:h-72 overflow-y-auto px-4 py-3 font-mono text-[12.5px] leading-relaxed scrollbar-thin-custom"
        >
          {lines.map((line, i) => {
            if (line.type === 'input') {
              return (
                <div key={i} className="text-neutral-300">
                  <span className="text-emerald-400">{PROMPT}</span> {line.text}
                </div>
              );
            }
            if (line.type === 'error') {
              return (
                <div key={i} className="text-rose-400">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'system') {
              return (
                <div key={i} className="text-neutral-500 mb-2">
                  {line.text}
                </div>
              );
            }
            return (
              <div key={i} className="text-cyan-200/90 whitespace-pre">
                {line.text}
              </div>
            );
          })}

          <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-1">
            <span className="text-emerald-400">{PROMPT}</span>
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoComplete="off"
              spellCheck={false}
              className="flex-1 bg-transparent outline-none text-neutral-100 caret-cyan-300"
            />
          </form>
        </div>
      </WindowFrame>
    </div>
  );
}
