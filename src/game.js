class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 20;
        this.snake = [{x: 5, y: 5}];
        this.food = this.generateFood();
        this.direction = 'right';
        this.score = 0;
        this.gameLoop = null;
        this.speed = 150;
        
        this.startBtn = document.getElementById('startBtn');
        this.scoreDisplay = document.getElementById('score');
        
        this.bindEvents();
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startGame());
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    startGame() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }
        
        this.snake = [{x: 5, y: 5}];
        this.direction = 'right';
        this.score = 0;
        this.scoreDisplay.textContent = this.score;
        this.food = this.generateFood();
        this.startBtn.textContent = '重新开始';
        
        this.gameLoop = setInterval(() => this.update(), this.speed);
    }

    generateFood() {
        const x = Math.floor(Math.random() * (this.canvas.width / this.gridSize));
        const y = Math.floor(Math.random() * (this.canvas.height / this.gridSize));
        return {x, y};
    }

    update() {
        const head = {...this.snake[0]};

        switch(this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        // 检查是否撞墙
        if (head.x < 0 || head.x >= this.canvas.width / this.gridSize ||
            head.y < 0 || head.y >= this.canvas.height / this.gridSize ||
            this.checkCollision(head)) {
            this.gameOver();
            return;
        }

        this.snake.unshift(head);

        // 检查是否吃到食物
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.scoreDisplay.textContent = this.score;
            this.food = this.generateFood();
        } else {
            this.snake.pop();
        }

        this.draw();
    }

    checkCollision(head) {
        return this.snake.some(segment => segment.x === head.x && segment.y === head.y);
    }

    gameOver() {
        clearInterval(this.gameLoop);
        this.gameLoop = null;
        alert(`游戏结束！得分：${this.score}`);
        this.startBtn.textContent = '开始游戏';
    }

    draw() {
        // 清空画布
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制蛇
        this.ctx.fillStyle = '#4CAF50';
        this.snake.forEach(segment => {
            this.ctx.fillRect(
                segment.x * this.gridSize,
                segment.y * this.gridSize,
                this.gridSize - 1,
                this.gridSize - 1
            );
        });

        // 绘制食物
        this.ctx.fillStyle = '#FF5722';
        this.ctx.fillRect(
            this.food.x * this.gridSize,
            this.food.y * this.gridSize,
            this.gridSize - 1,
            this.gridSize - 1
        );
    }

    handleKeyPress(e) {
        const key = e.key.toLowerCase();
        
        switch(key) {
            case 'arrowup':
            case 'w':
                if (this.direction !== 'down') this.direction = 'up';
                break;
            case 'arrowdown':
            case 's':
                if (this.direction !== 'up') this.direction = 'down';
                break;
            case 'arrowleft':
            case 'a':
                if (this.direction !== 'right') this.direction = 'left';
                break;
            case 'arrowright':
            case 'd':
                if (this.direction !== 'left') this.direction = 'right';
                break;
        }
    }
}

// 初始化游戏
window.onload = () => {
    new SnakeGame();
}; 