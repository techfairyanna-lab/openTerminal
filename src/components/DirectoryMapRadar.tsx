import React, { useState, useEffect } from 'react';
import { gameManager, ROOMS_DATA } from '../engine/GameManager';
import { Lock, Unlock, Compass, CheckCircle2 } from 'lucide-react';
import styles from './DirectoryMapRadar.module.css';

export const DirectoryMapRadar: React.FC = () => {
  const [rooms, setRooms] = useState(gameManager.getRooms());
  const [currentRoom, setCurrentRoom] = useState(gameManager.getCurrentRoom());

  useEffect(() => {
    const unsubscribe = gameManager.subscribe(() => {
      setRooms(gameManager.getRooms());
      setCurrentRoom(gameManager.getCurrentRoom());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className={styles.radarContainer}>
      <div className={styles.radarHeader}>
        <Compass size={16} className={styles.radarIcon} />
        <span>BACKROOMS DIRECTORY RADAR</span>
      </div>

      <div className={styles.roomList}>
        {Object.values(rooms).map((r) => {
          const isCurrent = r.id === currentRoom.id;
          const isUnlocked = r.unlocked;

          return (
            <div
              key={r.id}
              className={`${styles.roomCard} ${isCurrent ? styles.activeCard : ''} ${!isUnlocked ? styles.lockedCard : ''}`}
              onClick={() => isUnlocked && gameManager.setCurrentRoom(r.id)}
              style={{ '--room-theme-color': r.color } as React.CSSProperties}
            >
              <div className={styles.cardHeader}>
                <span className={styles.roomPath}>{r.path}</span>
                {isUnlocked ? (
                  isCurrent ? (
                    <span className={styles.activeTag}>HERE</span>
                  ) : (
                    <Unlock size={14} className={styles.unlockIcon} />
                  )
                ) : (
                  <Lock size={14} className={styles.lockIcon} />
                )}
              </div>

              <div className={styles.cardName}>{r.name.split('(')[0]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
