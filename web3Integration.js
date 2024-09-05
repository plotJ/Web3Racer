let userAddress = null;
let provider = null;
let signer = null;
let contract = null;

const CONTRACT_ADDRESS = '0x675332F3519EE5C540F7544953963937db8B4459';

const CONTRACT_ABI = [
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "player",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "score",
              "type": "uint256"
          }
      ],
      "name": "NewHighScore",
      "type": "event"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "_player",
              "type": "address"
          }
      ],
      "name": "getPlayerBestScore",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "getTopScores",
      "outputs": [
          {
              "components": [
                  {
                      "internalType": "address",
                      "name": "player",
                      "type": "address"
                  },
                  {
                      "internalType": "uint256",
                      "name": "score",
                      "type": "uint256"
                  }
              ],
              "internalType": "struct LeaderboardContract.Score[]",
              "name": "",
              "type": "tuple[]"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          }
      ],
      "name": "playerBestScores",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "_score",
              "type": "uint256"
          }
      ],
      "name": "submitScore",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "name": "topScores",
      "outputs": [
          {
              "internalType": "address",
              "name": "player",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "score",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  }
];

async function initializeWeb3() {
  if (typeof window.ethereum !== 'undefined') {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  } else {
      console.error('MetaMask is not installed!');
  }
}

async function connectWallet() {
  try {
      await provider.send("eth_requestAccounts", []);
      userAddress = await signer.getAddress();
      console.log('Connected address:', userAddress);
      return userAddress;
  } catch (error) {
      console.error('Error connecting wallet:', error);
      return null;
  }
}

async function submitScore(score) {
  if (!userAddress) {
      console.error('User not connected');
      return;
  }
  
  try {
      const tx = await contract.submitScore(score);
      await tx.wait();
      console.log('Score submitted successfully');
      updateLeaderboard();
  } catch (error) {
      console.error('Error submitting score:', error);
  }
}

async function updateLeaderboard() {
  try {
      const topScores = await contract.getTopScores();
      const leaderboard = document.querySelector('.leaderboard tbody');
      leaderboard.innerHTML = '';
      topScores.forEach((score, index) => {
          const newRow = leaderboard.insertRow(-1);
          newRow.innerHTML = `
              <td>${index + 1}</td>
              <td>${score.player.slice(0, 6)}...${score.player.slice(-4)}</td>
              <td>${score.score.toString()}</td>
          `;
      });
  } catch (error) {
      console.error('Error updating leaderboard:', error);
  }
}

window.web3Module = {
  initializeWeb3,
  connectWallet,
  submitScore,
  updateLeaderboard
};