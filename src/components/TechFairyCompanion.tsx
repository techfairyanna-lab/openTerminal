import React, { useState, useEffect } from 'react';
import { gameManager } from '../engine/GameManager';
import { soundManager } from '../audio/SoundManager';
import { Volume2, VolumeX, Sparkles, HelpCircle } from 'lucide-react';
import styles from './TechFairyCompanion.module.css';

export const TechFairyCompanion: React.FC = () => {
  const [room, setRoom] = useState(gameManager.getCurrentRoom());
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState(soundManager.getVoiceMuted());
  const [showHintModal, setShowHintModal] = useState(false);

  useEffect(() => {
    const unsubscribe = gameManager.subscribe(() => {
      setRoom(gameManager.getCurrentRoom());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Typewriter effect & auto voiceover for Fairy hint
  useEffect(() => {
    const fullText = room.fairyHint;
    setDisplayedText('');
    setIsTyping(true);
    let index = 0;

    soundManager.playFairyChime();
    soundManager.speakVoiceover(fullText);

    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(fullText.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [room.id]);

  const handleRepeatVoice = () => {
    soundManager.playFairyChime();
    soundManager.speakVoiceover(room.fairyHint);
  };

  const handleToggleVoice = () => {
    const muted = soundManager.toggleVoiceMute();
    setIsVoiceMuted(muted);
  };

  return (
    <div className={styles.companionContainer}>
      <div 
        className={styles.fairyAvatarCard}
        onClick={handleRepeatVoice}
        title="Click fairy to repeat clue!"
      >
        <div className={styles.fairySprite}>
          <div className={styles.fairyGlow} />
          <div className={styles.fairyWingLeft} />
          <div className={styles.fairyWingRight} />
          <div className={styles.fairyCore}>🧚🏼‍♀️</div>
        </div>
        <div className={styles.fairyLabel}>
          <span>BYTE</span>
          <span className={styles.fairySub}>Tech Fairy</span>
        </div>
      </div>

      <div className={styles.speechBubble}>
        <div className={styles.bubbleHeader}>
          <div className={styles.bubbleTitle}>
            <Sparkles className={styles.iconSparkle} size={14} />
            <span>Fairy Guide Clue ({room.path})</span>
          </div>
          <div className={styles.bubbleControls}>
            <button 
              className={styles.iconBtn} 
              onClick={handleRepeatVoice} 
              title="Repeat Voiceover"
            >
              <Volume2 size={15} />
            </button>
            <button 
              className={styles.iconBtn} 
              onClick={handleToggleVoice} 
              title={isVoiceMuted ? "Unmute Voice" : "Mute Voice"}
            >
              {isVoiceMuted ? <VolumeX size={15} color="#ef4444" /> : <Volume2 size={15} color="#10b981" />}
            </button>
            <button 
              className={styles.hintBtn} 
              onClick={() => setShowHintModal(!showHintModal)}
              title="Direct Command Hint"
            >
              <HelpCircle size={15} />
              <span>Hint</span>
            </button>
          </div>
        </div>

        <div className={styles.bubbleBody}>
          <p className={styles.bubbleText}>
            {displayedText}
            {isTyping && <span className={styles.cursor}>▌</span>}
          </p>

          {showHintModal && (
            <div className={styles.directHintBox}>
              <strong>Direct Solution:</strong> Type <code>{room.commandHint}</code> in the Terminal Console!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
