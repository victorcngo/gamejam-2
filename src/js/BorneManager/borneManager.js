import Axis from 'axis-api'

export let player1
export let player2

export const setUpButtons = async () => {

    //Button registering

    Axis.registerKeys(["a","A"], "a", 1);
    Axis.registerKeys(["z","Z"], "x", 1);
    Axis.registerKeys(["e","E"], "i", 1);
    Axis.registerKeys(["r","R"], "s", 1);


    Axis.registerKeys(["u","U"], "a", 2);
    Axis.registerKeys(["i","I"], "x", 2);
    Axis.registerKeys(["o","O"], "i", 2);
    Axis.registerKeys(["p","P"], "s", 2);

    const gamepadEmulator = Axis.createGamepadEmulator(0);
    function update() {
        gamepadEmulator.update();
        requestAnimationFrame(update);
    }
    
    update();

    Axis.joystick1.setGamepadEmulatorJoystick(gamepadEmulator, 0);

    player1 = await Axis.createPlayer({
        id: 1,
        joysticks: Axis.joystick1,
        buttons: Axis.buttonManager.getButtonsById(1)
    })
    
    player2 = await Axis.createPlayer({
        id: 2,
        joysticks: Axis.joystick2,
        buttons: Axis.buttonManager.getButtonsById(2)
    })
}







