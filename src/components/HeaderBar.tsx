import React, { useState, useEffect } from 'react';
import { gameManager } from '../engine/GameManager';
import { soundManager } from '../audio/SoundManager';
import { Terminal, Volume2, VolumeX, RotateCcw, ShieldAlert, Trophy } from 'lucide-react';
import styles from './HeaderBar.module.css';

export const HeaderBar: React.FC = () => {
  const [room, setRoom] = useState(gameManager.getCurrentRoom());
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());
  const [gameWon, setGameWon] = useState(gameManager.isGameWon());
  const [notification, setNotification] = useState<string | null>(gameManager.getNotification());

  useEffect(() => {
    const unsubscribe = gameManager.subscribe(() => {
      setRoom(gameManager.getCurrentRoom());
      setGameWon(gameManager.isGameWon());
      setNotification(gameManager.getNotification());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const handleOpenTerminal = () => {
    gameManager.setTerminalOpen(true);
    soundManager.playKeyClick();
  };

  const handleReset = () => {
    if (window.confirm('Reset Backrooms Linux simulation game?')) {
      gameManager.resetGame();
    }
  };

  return (
    <header className={styles.headerContainer}>
      <div className={styles.brandGroup}>
        <div className={styles.titleBadge}>
          <Terminal size={20} className={styles.titleIcon} />
          <div className={styles.titleText}>
            <h1>THE BACKROOMS</h1>
            <span>LINUX LIMINALITY ACADEMY</span>
          </div>
        </div>

        <div className={styles.roomStatusTag} style={{ borderColor: room.color }}>
          <span className={styles.roomDot} style={{ background: room.color }} />
          <span>{room.name}</span>
        </div>
      </div>

      {notification && (
        <div className={styles.notificationToast}>
          {notification}
        </div>
      )}

      {gameWon && (
        <div className={styles.victoryBanner}>
          <Trophy size={18} />
          <span>VICTORY! ALL ROOMS CLEARED & BOSS PURGED!</span>
        </div>
      )}

      <div className={styles.actionControls}>
        <button 
          className={styles.termLaunchBtn}
          onClick={handleOpenTerminal}
        >
          <Terminal size={16} />
          <span>OPEN TERMINAL [E]</span>
        </button>

        <button 
          className={styles.iconBtn}
          onClick={handleToggleMute}
          title={isMuted ? "Unmute Audio" : "Mute Audio"}
        >
          {isMuted ? <VolumeX size={18} color="#ef4444" /> : <Volume2 size={18} color="#10b981" />}
        </button>

        <button 
          className={styles.iconBtn}
          onClick={handleReset}
          title="Reset Game"
        >
          <RotateCcw size={18} />
        </button>
      </div>
    </header>
  );
};
