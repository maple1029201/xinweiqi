document.getElementById('start-button').addEventListener('click', startGame);

let board = [];
let currentPlayer = 'black';
let gameActive = false;

function startGame() {
    gameActive = true;
    document.getElementById('result').innerText = '';
    initializeBoard();
    renderBoard();
}

function initializeBoard() {
    board = Array(19).fill().map(() => Array(19).fill(null));
}

function renderBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    for (let i = 0; i < 19; i++) {
        for (let j = 0; j < 19; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', () => placeStone(i, j));
            if (board[i][j]) {
                const stone = document.createElement('div');
                stone.classList.add('stone', board[i][j]);
                cell.appendChild(stone);
            }
            boardElement.appendChild(cell);
        }
    }
}

function placeStone(row, col) {
    if (!gameActive || board[row][col]) return;

    // 模拟落子
    board[row][col] = currentPlayer;
    renderBoard();

    // 检查是否有棋子被提走
    checkAndRemoveDeadStones(row, col);

    // 切换玩家
    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
}

function checkAndRemoveDeadStones(row, col) {
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // 上下左右
    for (let [dx, dy] of directions) {
        const x = row + dx;
        const y = col + dy;
        if (x >= 0 && x < 19 && y >= 0 && y < 19 && board[x][y] && board[x][y] !== currentPlayer) {
            if (isGroupDead(x, y)) {
                removeGroup(x, y);
            }
        }
    }
}

function isGroupDead(startX, startY) {
    const visited = new Set();
    const stack = [[startX, startY]];
    const targetColor = board[startX][startY];

    while (stack.length > 0) {
        const [x, y] = stack.pop();
        if (visited.has(`${x},${y}`)) continue;
        visited.add(`${x},${y}`);

        // 如果发现气，则整组未死
        if (hasLiberty(x, y)) return false;

        // 检查相邻同色棋子
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        for (let [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < 19 && ny >= 0 && ny < 19 && board[nx][ny] === targetColor) {
                stack.push([nx, ny]);
            }
        }
    }

    return true;
}

function hasLiberty(x, y) {
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (let [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < 19 && ny >= 0 && ny < 19 && board[nx][ny] === null) {
            return true;
        }
    }
    return false;
}

function removeGroup(startX, startY) {
    const targetColor = board[startX][startY];
    const stack = [[startX, startY]];

    while (stack.length > 0) {
        const [x, y] = stack.pop();
        if (board[x][y] !== targetColor) continue;

        board[x][y] = null; // 移除棋子
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        for (let [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < 19 && ny >= 0 && ny < 19 && board[nx][ny] === targetColor) {
                stack.push([nx, ny]);
            }
        }
    }

    renderBoard();
}