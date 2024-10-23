import Game from '../objects/Game';

export default class Splashscreen {
    constructor({ element }) {
        this.element = element;
        this.game = new Game();
    }

    init() {
        this.element.setAttribute('data-state', 'visible');
        this.setupButtons();
        this.addEventListeners();
    }

    destroy() {
        this.removeEventListeners();
    }

    setupButtons() {
        this.startButtons = [
            this.game.player1.instance.buttons[0],
            this.game.player2.instance.buttons[0]
        ];

        this.leaderboardButtons = [
            this.game.player1.instance.buttons[1],
            this.game.player2.instance.buttons[1]
        ];
    }

    addEventListeners() {
        this.handleStartButtonClick = this.handleStartButtonClick.bind(this);
        this.handleLeaderboardButtonClick = this.handleLeaderboardButtonClick.bind(this);

        this.startButtons.forEach(button => {
            button.addEventListener('keydown', this.handleStartButtonClick);
        });

        this.leaderboardButtons.forEach(button => {
            button.addEventListener('keydown', this.handleLeaderboardButtonClick);
        });
    }

    removeEventListeners() {
        this.startButtons.forEach(button => {
            button.removeEventListener('keydown', this.handleStartButtonClick);
        });

        this.leaderboardButtons.forEach(button => {
            button.removeEventListener('keydown', this.handleLeaderboardButtonClick);
        });
    }


    handleStartButtonClick(event) {
        const element =  document.querySelector('.js-start');
        element.classList.add('hide');
        element.addEventListener('animationend', () => {
            this.element.classList.add('hide');
            this.element.addEventListener('transitionend', () => {
                this.element.setAttribute('data-state', 'hidden');
                this.destroy();
            });
        });
    }

    handleLeaderboardButtonClick(event) {
        console.log('Leaderboard button clicked', event);
        this.destroy();
    }
}
