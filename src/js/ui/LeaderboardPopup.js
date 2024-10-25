import Game from '../objects/Game.js';
import Splashscreen from './Splashscreen';

export default class LeaderboardPopup {
    constructor({ element, response }) {
        this.element = element;
        this.response = response;
        this.game = new Game();
    }

    showResults() {
        const responseSorted = this.response.sort((a, b) => b.value - a.value).slice(0, 10);

        responseSorted.forEach((result, index) => {
            const username = result.username;
            const score = result.value;
            const date = new Date(result.createdAt).toLocaleString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });

            const playerElement = document.createElement('tr');
            playerElement.classList.add('o-Leaderboardpopup_player');

            const rankElement = document.createElement('th');
            playerElement.setAttribute('scope', 'row');
            rankElement.classList.add('o-Leaderboardpopup_rank');

            const usernameElement = document.createElement('td');
            usernameElement.classList.add('o-Leaderboardpopup_username');

            const scoreElement = document.createElement('td');
            scoreElement.classList.add('o-Leaderboardpopup_score');

            const dateElement = document.createElement('td');
            dateElement.classList.add('o-Leaderboardpopup_date');

            rankElement.textContent = index + 1;
            usernameElement.textContent = username;
            scoreElement.textContent = score;
            dateElement.textContent = date;

            playerElement.appendChild(rankElement);
            playerElement.appendChild(usernameElement);
            playerElement.appendChild(scoreElement);
            playerElement.appendChild(dateElement);

            this.element.querySelector('.js-players').appendChild(playerElement);
        });
    }

    handleButtons() {
        const buttons = [
            this.game.player1.instance.buttons[0],
            this.game.player2.instance.buttons[0]
        ];

        const keydownHandler = (event) => {
            buttons.forEach(button => {
                button.removeEventListener('keydown', keydownHandler);
            });
            this.hide();
        };

        buttons.forEach(button => {
            button.addEventListener('keydown', keydownHandler);
        });
    }

    show() {
        this.element.setAttribute('data-state', 'visible');
        this.showResults();
        this.handleButtons();
    }

    hide() {
        this.element.setAttribute('data-state', 'hidden');

        const players = this.element.querySelectorAll('.o-Leaderboardpopup_player');
        players.forEach(player => {
            player.remove();
        });

        const splashscreen = document.querySelector('.js-splashscreen');
        new Splashscreen({ element: splashscreen }).init();
    }
}



