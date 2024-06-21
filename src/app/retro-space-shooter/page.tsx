"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Rocket, Star, Zap, Shield } from 'lucide-react';

const RetroSpaceShooter = () => {
  const [playerPosition, setPlayerPosition] = useState(150);
  const [enemies, setEnemies] = useState([]);
  const [lasers, setLasers] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [powerUps, setPowerUps] = useState([]);
  const [playerPowerUp, setPlayerPowerUp] = useState(null);

  const moveEnemies = useCallback(() => {
    setEnemies(prev => prev.map(enemy => ({
      ...enemy,
      y: enemy.y + enemy.speed,
      x: enemy.type === 'zigzag' ? enemy.x + Math.sin(enemy.y / 30) * 2 : enemy.x
    })).filter(enemy => enemy.y < 300));
  }, []);

  const moveLasers = useCallback(() => {
    setLasers(prev => prev.map(laser => ({ ...laser, y: laser.y - 5 })).filter(laser => laser.y > 0));
  }, []);

  const movePowerUps = useCallback(() => {
    setPowerUps(prev => prev.map(powerUp => ({ ...powerUp, y: powerUp.y + 1 })).filter(powerUp => powerUp.y < 300));
  }, []);

  const spawnEnemy = useCallback(() => {
    const enemyTypes = ['normal', 'fast', 'zigzag'];
    const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    const speed = type === 'fast' ? 3 : 1;
    setEnemies(prev => [...prev, { x: Math.random() * 280, y: 0, type, speed }]);
  }, []);

  const spawnPowerUp = useCallback(() => {
    const powerUpTypes = ['rapidFire', 'shield', 'doubleLaser'];
    const type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
    setPowerUps(prev => [...prev, { x: Math.random() * 280, y: 0, type }]);
  }, []);

  const checkCollisions = useCallback(() => {
    setLasers(prev => prev.filter(laser => {
      let shouldKeepLaser = true;
      setEnemies(prevEnemies => prevEnemies.filter(enemy => {
        if (Math.abs(laser.x - enemy.x) < 20 && Math.abs(laser.y - enemy.y) < 20) {
          setScore(prevScore => prevScore + 10);
          shouldKeepLaser = false;
          return false;
        }
        return true;
      }));
      return shouldKeepLaser;
    }));

    setPowerUps(prev => prev.filter(powerUp => {
      if (Math.abs(playerPosition - powerUp.x) < 20 && Math.abs(290 - powerUp.y) < 20) {
        setPlayerPowerUp(powerUp.type);
        setTimeout(() => setPlayerPowerUp(null), 10000);
        return false;
      }
      return true;
    }));

    if (enemies.some(enemy => enemy.y >= 280) && playerPowerUp !== 'shield') {
      setGameOver(true);
    }
  }, [enemies, playerPosition, playerPowerUp]);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      if (!gameOver) {
        moveEnemies();
        moveLasers();
        movePowerUps();
        checkCollisions();
        if (Math.random() < 0.05) spawnEnemy();
        if (Math.random() < 0.01) spawnPowerUp();
      }
    }, 50);

    return () => clearInterval(gameLoop);
  }, [moveEnemies, moveLasers, movePowerUps, checkCollisions, spawnEnemy, spawnPowerUp, gameOver]);

  const fireLaser = useCallback(() => {
    const newLasers = [{ x: playerPosition + 15, y: 280 }];
    if (playerPowerUp === 'doubleLaser') {
      newLasers.push({ x: playerPosition + 35, y: 280 });
    }
    setLasers(prev => [...prev, ...newLasers]);
  }, [playerPosition, playerPowerUp]);

  const handleMouseMove = useCallback((e) => {
    const gameArea = e.currentTarget.getBoundingClientRect();
    const newPosition = e.clientX - gameArea.left - 25;
    setPlayerPosition(Math.max(0, Math.min(newPosition, 250)));
  }, []);

  const resetGame = useCallback(() => {
    setPlayerPosition(150);
    setEnemies([]);
    setLasers([]);
    setPowerUps([]);
    setScore(0);
    setGameOver(false);
    setPlayerPowerUp(null);
  }, []);

  return (
    <div 
      className="relative w-80 h-96 bg-gradient-to-b from-purple-900 to-black overflow-hidden cursor-none" 
      onMouseMove={handleMouseMove} 
      onClick={fireLaser}
    >
      {/* Stars */}
      {[...Array(50)].map((_, i) => (
        <Star 
          key={i} 
          className="absolute text-white opacity-50" 
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `twinkle ${Math.random() * 5 + 2}s linear infinite`
          }} 
          size={Math.random() * 2 + 1} 
        />
      ))}
      
      {/* Enemies */}
      {enemies.map((enemy, index) => (
        <div 
          key={index} 
          className={`absolute w-8 h-8 rounded-full ${
            enemy.type === 'fast' ? 'bg-yellow-500' : 
            enemy.type === 'zigzag' ? 'bg-green-500' : 
            'bg-red-500'
          }`} 
          style={{ left: enemy.x, top: enemy.y }} 
        />
      ))}
      
      {/* Lasers */}
      {lasers.map((laser, index) => (
        <div 
          key={index} 
          className="absolute w-1 h-4 bg-green-400" 
          style={{ left: laser.x, top: laser.y }} 
        />
      ))}
      
      {/* Power-ups */}
      {powerUps.map((powerUp, index) => (
        <div 
          key={index} 
          className="absolute w-6 h-6 rounded-full bg-blue-400 flex items-center justify-center" 
          style={{ left: powerUp.x, top: powerUp.y }}
        >
          {powerUp.type === 'rapidFire' && <Zap className="text-yellow-300" size={20} />}
          {powerUp.type === 'shield' && <Shield className="text-green-300" size={20} />}
          {powerUp.type === 'doubleLaser' && <div className="flex"><div className="w-1 h-4 bg-green-400 mr-1"></div><div className="w-1 h-4 bg-green-400"></div></div>}
        </div>
      ))}
      
      {/* Player */}
      <Rocket 
        className={`absolute ${playerPowerUp === 'shield' ? 'text-green-400' : 'text-blue-400'}`} 
        style={{ left: playerPosition, bottom: '10px' }} 
        size={48} 
      />
      
      {/* UI Elements */}
      <div className="absolute top-2 left-2 text-white font-bold">Score: {score}</div>
      
      {/* Game Over Screen */}
      {gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center">
          <div className="text-white text-2xl mb-4">Game Over</div>
          <div className="text-white text-xl mb-4">Final Score: {score}</div>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded" 
            onClick={resetGame}
          >
            Play Again
          </button>
        </div>
      )}
      
      <style jsx>{`
        @keyframes twinkle {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default RetroSpaceShooter;
