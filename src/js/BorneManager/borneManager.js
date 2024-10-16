import Axis from 'axis-api'

export let player1
export let player2

export const setUpButtons = async () => {

    //Button registering

    Axis.registerKeys("a", "a", 1);
    Axis.registerKeys("z", "x", 1);
    Axis.registerKeys("e", "i", 1);
    Axis.registerKeys("r", "s", 1);
    Axis.registerKeys("A", "a", 1);
    Axis.registerKeys("Z", "x", 1);
    Axis.registerKeys("E", "i", 1);
    Axis.registerKeys("R", "s", 1);

    Axis.registerKeys("u", "a", 2);
    Axis.registerKeys("i", "x", 2);
    Axis.registerKeys("o", "i", 2);
    Axis.registerKeys("p", "s", 2);
    Axis.registerKeys("U", "a", 2);
    Axis.registerKeys("I", "x", 2);
    Axis.registerKeys("O", "i", 2);
    Axis.registerKeys("P", "s", 2);

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







