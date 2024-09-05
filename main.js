document.addEventListener('DOMContentLoaded', async function() {
  await web3Module.initializeWeb3();
  
  const connectButton = document.getElementById('connect-wallet');
  const gameCanvas = document.getElementById('game-canvas');
  const gamePlaceholder = document.getElementById('game-placeholder');
  
  connectButton.addEventListener('click', async function() {
      const address = await web3Module.connectWallet();
      if (address) {
          connectButton.textContent = `Connected: ${address.slice(0, 6)}...${address.slice(-4)}`;
          gameCanvas.style.display = 'block';
          gamePlaceholder.style.display = 'none';
          
          if (typeof window.gameModule !== 'undefined' && window.gameModule.init) {
              window.gameModule.init(gameCanvas);
              Game.run({
                  canvas: gameCanvas,
                  render: window.gameModule.render,
                  update: window.gameModule.update,
                  stats: window.gameModule.stats,
                  step: window.gameModule.step,
                  images: ["background", "sprites"],
                  keys: [
                      { keys: [KEY.LEFT,  KEY.A], mode: 'down', action: function() { keyLeft   = true;  } },
                      { keys: [KEY.RIGHT, KEY.D], mode: 'down', action: function() { keyRight  = true;  } },
                      { keys: [KEY.UP,    KEY.W], mode: 'down', action: function() { keyFaster = true;  } },
                      { keys: [KEY.DOWN,  KEY.S], mode: 'down', action: function() { keySlower = true;  } },
                      { keys: [KEY.LEFT,  KEY.A], mode: 'up',   action: function() { keyLeft   = false; } },
                      { keys: [KEY.RIGHT, KEY.D], mode: 'up',   action: function() { keyRight  = false; } },
                      { keys: [KEY.UP,    KEY.W], mode: 'up',   action: function() { keyFaster = false; } },
                      { keys: [KEY.DOWN,  KEY.S], mode: 'up',   action: function() { keySlower = false; } }
                  ],
                  ready: function(images) {
                      background = images[0];
                      sprites    = images[1];
                      window.gameModule.reset();
                  }
              });
          } else {
              console.error('Game module not properly loaded');
          }
      }
  });
});
