import Axis from 'axis-api'

export default class Player {
    constructor(playerID) {
        this.playerID = playerID
        this.combo = 0
        this.maxCombo = 0

        this.init()
    }

    init() {
        this.instance = Axis.createPlayer({
            id: this.playerID,
            joysticks: Axis['joystick' + this.playerID],
            buttons: Axis.buttonManager.getButtonsById(this.playerID)
        })
    }
}

