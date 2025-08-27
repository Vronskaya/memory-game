class MemoryGame {
    constructor() {
        // Expanded game symbols for different difficulty levels
        this.allSymbols = [
            '🎈', '🎨', '🎭', '🎪', '🎯', '🎲', '🎸', '🎺', 
            '🎻', '🎹', '🎼', '🎵', '🎶', '🎤', '🎧', '🎬',
            '🍎', '🍌', '🍒', '🍓', '🍑', '🍊', '🍋', '🍍',
            '🥝', '🍇', '🥥', '🍉', '🍈', '🍅', '🥕', '🌽',
            '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
            '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔',
            '⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏓', '🏸',
            '🥊', '⛳', '🏹', '🎣', '🎿', '🛷', '🏂', '🏄'
        ];
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.score = 0;
        this.canFlip = true;
        this.currentDifficulty = 'easy';
        
        this.difficultySettings = {
            easy: { pairs: 3, name: 'Лёгкий' },
            medium: { pairs: 6, name: 'Средний' },
            hard: { pairs: 8, name: 'Сложный' },
            expert: { pairs: 12, name: 'Экспертный' },
            master: { pairs: 16, name: 'Мастерский' }
        };
        
        this.gameBoard = document.getElementById('game-board');
        this.scoreElement = document.getElementById('score');
        this.movesElement = document.getElementById('moves');
        this.messageElement = document.getElementById('message');
        this.currentLevelElement = document.getElementById('current-level');
        this.restartBtn = document.getElementById('restart-btn');
        this.backBtn = document.getElementById('back-btn');
        this.difficultySelector = document.getElementById('difficulty-selector');
        this.gameContainer = document.getElementById('game-container');
        this.heroSection = document.querySelector('.hero');
        this.startGameBtn = document.getElementById('start-game-btn');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.showDifficultySelector();
    }
    
    createCards() {
        this.cards = [];
        const pairsNeeded = this.difficultySettings[this.currentDifficulty].pairs;
        const symbols = this.allSymbols.slice(0, pairsNeeded);
        
        // Create pairs of cards
        symbols.forEach((symbol, index) => {
            // Add each symbol twice to create pairs
            this.cards.push({ id: index * 2, symbol: symbol, isFlipped: false, isMatched: false });
            this.cards.push({ id: index * 2 + 1, symbol: symbol, isFlipped: false, isMatched: false });
        });
    }
    
    shuffleCards() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
    
    renderCards() {
        this.gameBoard.innerHTML = '';
        this.gameBoard.className = `game-board ${this.currentDifficulty}`;
        
        this.cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.dataset.index = index;
            
            cardElement.innerHTML = `
                <div class="card-front">?</div>
                <div class="card-back">${card.symbol}</div>
            `;
            
            this.gameBoard.appendChild(cardElement);
        });
    }
    
    bindEvents() {
        // Start game button
        this.startGameBtn.addEventListener('click', () => {
            this.showDifficultySelector();
        });
        
        // Difficulty selection
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const level = e.currentTarget.dataset.level;
                this.startGame(level);
            });
        });
        
        this.gameBoard.addEventListener('click', (e) => {
            const cardElement = e.target.closest('.card');
            if (cardElement) {
                this.flipCard(parseInt(cardElement.dataset.index));
            }
        });
        
        this.restartBtn.addEventListener('click', () => {
            this.restart();
        });
        
        this.backBtn.addEventListener('click', () => {
            this.showDifficultySelector();
        });
    }
    
    flipCard(index) {
        const card = this.cards[index];
        const cardElement = this.gameBoard.children[index];
        
        // Check if card can be flipped
        if (!this.canFlip || card.isFlipped || card.isMatched || this.flippedCards.length >= 2) {
            return;
        }
        
        // Flip the card
        card.isFlipped = true;
        cardElement.classList.add('flipped');
        this.flippedCards.push(index);
        
        // Check if two cards are flipped
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateMoves();
            
            setTimeout(() => {
                this.checkMatch();
            }, 1000);
        }
    }
    
    checkMatch() {
        const [firstIndex, secondIndex] = this.flippedCards;
        const firstCard = this.cards[firstIndex];
        const secondCard = this.cards[secondIndex];
        const firstElement = this.gameBoard.children[firstIndex];
        const secondElement = this.gameBoard.children[secondIndex];
        
        if (firstCard.symbol === secondCard.symbol) {
            // Match found
            firstCard.isMatched = true;
            secondCard.isMatched = true;
            firstElement.classList.add('matched');
            secondElement.classList.add('matched');
            
            this.matchedPairs++;
            const difficultyMultiplier = {
                easy: 1,
                medium: 1.5,
                hard: 2,
                expert: 2.5,
                master: 3
            };
            this.score += Math.floor(100 * difficultyMultiplier[this.currentDifficulty]);
            this.updateScore();
            
            this.showMessage('Отличное совпадение! 🎉', 'success');
            
            // Check if game is won
            if (this.matchedPairs === this.difficultySettings[this.currentDifficulty].pairs) {
                setTimeout(() => {
                    this.gameWon();
                }, 500);
            }
        } else {
            // No match
            firstCard.isFlipped = false;
            secondCard.isFlipped = false;
            firstElement.classList.remove('flipped');
            secondElement.classList.remove('flipped');
            
            this.showMessage('Попробуйте ещё раз! 🤔', 'info');
        }
        
        this.flippedCards = [];
    }
    
    gameWon() {
        const optimalMoves = this.difficultySettings[this.currentDifficulty].pairs;
        const difficultyMultiplier = {
            easy: 1,
            medium: 1.5,
            hard: 2,
            expert: 2.5,
            master: 3
        };
        
        const baseBonus = 500 * difficultyMultiplier[this.currentDifficulty];
        const bonusScore = Math.max(0, baseBonus - (this.moves - optimalMoves) * 20);
        this.score += bonusScore;
        this.updateScore();
        
        let trophy = '🎊';
        if (this.currentDifficulty === 'master') trophy = '👑';
        else if (this.currentDifficulty === 'expert') trophy = '🏆';
        else if (this.currentDifficulty === 'hard') trophy = '🥇';
        
        this.messageElement.innerHTML = `
            <div class="win-message">
                ${trophy} Поздравляем! Вы выиграли! ${trophy}<br>
                Уровень: ${this.difficultySettings[this.currentDifficulty].name}<br>
                Итоговый счёт: ${this.score}<br>
                Количество ходов: ${this.moves}
                ${this.moves <= optimalMoves ? '<br>🎯 Идеальный результат!' : ''}
            </div>
        `;
        
        this.canFlip = false;
    }
    
    showMessage(text, type) {
        this.messageElement.textContent = text;
        this.messageElement.className = `message ${type}`;
        
        setTimeout(() => {
            if (!this.messageElement.innerHTML.includes('Поздравляем')) {
                this.messageElement.textContent = '';
                this.messageElement.className = 'message';
            }
        }, 2000);
    }
    
    updateScore() {
        this.scoreElement.textContent = this.score;
    }
    
    updateMoves() {
        this.movesElement.textContent = this.moves;
    }
    
    resetStats() {
        this.matchedPairs = 0;
        this.moves = 0;
        this.score = 0;
        this.flippedCards = [];
        this.canFlip = true;
        this.updateScore();
        this.updateMoves();
        this.messageElement.textContent = 'Найдите все одинаковые пары!';
        this.messageElement.className = 'message';
    }
    
    startGame(difficulty) {
        this.currentDifficulty = difficulty;
        this.currentLevelElement.textContent = this.difficultySettings[difficulty].name;
        
        this.heroSection.style.display = 'none';
        this.difficultySelector.style.display = 'none';
        this.gameContainer.style.display = 'block';
        
        this.resetStats();
        this.createCards();
        this.shuffleCards();
        this.renderCards();
        this.showMessage('Найдите все одинаковые пары!', 'info');
    }
    
    showDifficultySelector() {
        this.heroSection.style.display = 'none';
        this.difficultySelector.style.display = 'block';
        this.gameContainer.style.display = 'none';
    }
    
    showMainMenu() {
        this.heroSection.style.display = 'flex';
        this.difficultySelector.style.display = 'none';
        this.gameContainer.style.display = 'none';
    }
    
    restart() {
        this.resetStats();
        this.createCards();
        this.shuffleCards();
        this.renderCards();
        this.showMessage('Новая игра началась! 🎮', 'info');
    }
}

// Start the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new MemoryGame();
}); 

// PWA: регистрация сервис-воркера
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/service-worker.js');
  });
} 