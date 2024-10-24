import Axis from 'axis-api'

export const setUpButtons = async () => {

    // Button registering
    Axis.registerKeys(["a","A"], "a", 1);
    Axis.registerKeys(["z","Z"], "x", 1);
    Axis.registerKeys(["e","E"], "i", 1);
    Axis.registerKeys(["r","R"], "s", 1);
    Axis.registerKeys(" ", "w", 1);


    Axis.registerKeys(["u","U"], "a", 2);
    Axis.registerKeys(["i","I"], "x", 2);
    Axis.registerKeys(["o","O"], "i", 2);
    Axis.registerKeys(["p","P"], "s", 2);
    Axis.registerKeys("Enter", "w", 2);


    const gamepadEmulator = Axis.createGamepadEmulator(0);

    function update() {
        gamepadEmulator.update();
        requestAnimationFrame(update);
    }

    update();

    // HACK - Creation du gamepad emulator, pour le dev avec une manette
    Axis.joystick1.setGamepadEmulatorJoystick(gamepadEmulator, 0);
}







