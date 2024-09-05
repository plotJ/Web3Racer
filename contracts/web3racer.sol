// LeaderboardContract.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LeaderboardContract {
    struct Score {
        address player;
        uint256 score;
    }

    Score[] public topScores;
    mapping(address => uint256) public playerBestScores;

    event NewHighScore(address indexed player, uint256 score);

    function submitScore(uint256 _score) external {
        require(_score > 0, "Score must be greater than 0");

        if (_score > playerBestScores[msg.sender]) {
            playerBestScores[msg.sender] = _score;
            _updateTopScores(msg.sender, _score);
            emit NewHighScore(msg.sender, _score);
        }
    }

    function _updateTopScores(address _player, uint256 _score) private {
        if (topScores.length < 10) {
            topScores.push(Score(_player, _score));
        } else {
            uint256 lowestIndex = 0;
            for (uint256 i = 1; i < topScores.length; i++) {
                if (topScores[i].score < topScores[lowestIndex].score) {
                    lowestIndex = i;
                }
            }
            if (_score > topScores[lowestIndex].score) {
                topScores[lowestIndex] = Score(_player, _score);
            }
        }
        _sortTopScores();
    }

    function _sortTopScores() private {
        for (uint256 i = 0; i < topScores.length - 1; i++) {
            for (uint256 j = i + 1; j < topScores.length; j++) {
                if (topScores[i].score < topScores[j].score) {
                    Score memory temp = topScores[i];
                    topScores[i] = topScores[j];
                    topScores[j] = temp;
                }
            }
        }
    }

    function getTopScores() external view returns (Score[] memory) {
        return topScores;
    }

    function getPlayerBestScore(address _player) external view returns (uint256) {
        return playerBestScores[_player];
    }
}
