import Game from '../objects/Game';
import LeaderboardPopup from './LeaderboardPopup';

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
        if (this.startButtons && this.leaderboardButtons) {
            this.removeEventListeners();
        }

        this.startButtons = null;
        this.leaderboardButtons = null;

        this.handleStartButtonClick = null;
        this.handleLeaderboardButtonClick = null;

        if (this.element) {
            this.element.setAttribute('data-state', 'hidden');
            this.element = null;
        }
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
        if(!this.element) return;

        const element =  document.querySelector('.js-start');
        if (!element) return;

        element.classList.add('hide');
        element.addEventListener('animationend', () => {
            element.classList.remove('hide');
            this.destroy();
            this.game.showCountdown();
        });
    }

    handleLeaderboardButtonClick(event) {
        const leaderboardpopup = document.querySelector('.js-leaderboardpopup');

        this.game.player1.leaderboard.getScores().then((response) => {
            new LeaderboardPopup({
                element: leaderboardpopup,
                response: response
            }).show();
        });

        this.removeEventListeners();
    }
}
