//uso de la función kaplay por defecto
kaplay();

//uso de la función kaplay personalizada (habilitar sólo una: o kaplay() o esta)
/*kaplay({
    width: 400,
    height: 400,
    background: '#d46eb3',
    scale: 2,
    canvas: document.getElementById('canvas'),
    letterbox: true, //esto crea un lienzo adaptativo
    global: true,
});*/

loadSprite('blanco', 'sprites/blanco_3.png');
loadSprite('mirilla', 'sprites/mirilla_green.png');
loadSound('hit', 'sounds/disparo.mp3');
loadSound('alarma', 'sounds/alarma.wav');

scene('main', () =>{
    add([
        rect(width(), height()),
        pos(0, 0),
        color(20,20,30),
    ]);

    const mirilla = add([
        sprite('mirilla'),
        pos(center()),
        anchor('center'),
        layer('ui'),
        fixed(),
    ]);

    onMouseMove((posicion) => {
        mirilla.pos = posicion;
    });
    onClick(() =>{
        mirilla.scale = 0.7;
        tween(mirilla.scale, 1, 0.1, (v) => mirilla.scale = v);
    });
    onClick(() =>{
        mirilla.color = rgb(100, 200, 10);
        wait(0.2, () => mirilla.color = rgb(255,255,255));
        play('hit');
    });
    onClick(() =>{
        const original = mirilla.pos.clone();
        const offset = vec2(rand(-2, 2), rand(-2, 2));

        mirilla.pos = original.add(offset);
        wait(0.05, () => mirilla.pos = original);
    });

//**************************************************************************************** */
    //Estos enemigos se crean de forma automática y desaparecen cada dos segundos
    function generarBlanco(){
        const b = add([
            sprite('blanco'),
            pos(rand(80, width() -80), rand(80, height() -80)),
            area(),
            anchor('center'),
            'blanco',
            lifespan(2),
            opacity(0.5),
        ]);
        return b;
    }
//**************************************************************************************** */
    let puntos = 0;

    const marcador = add([
        text(('Puntos: 0'), {size: 30}),
        pos(20, 10),
        { value: 0 },
    ]);

    const loopBlancos = loop(1, () =>{
        generarBlanco();

        if(puntos >=15) loop(0.7, generarBlanco);
        if(puntos >=25) loop(0.5, generarBlanco);
    });

    let tiempo = 10;

    const timerLabel = add([
        text(`Tiempo: ${tiempo}`, { size: 24 }),
        pos(250, 10),
        layer('ui'),
        { value: tiempo },
    ]);

    let sonarAlarma = null;
    let alarmaActiva = false;
    const loopTiempo = loop(1, () =>{
        timerLabel.value--;
        timerLabel.text = `Tiempo: ${timerLabel.value}`;

        if(timerLabel.value <= 5 && !alarmaActiva){
            sonarAlarma = play('alarma', {loop: false});
            alarmaActiva = false;
            timerLabel.scale = 1;
            timerLabel.color = rgb(250, 0.3, 0.3);
            animate(timerLabel, { scale: 1 }, 0.2);
        }
        if(timerLabel.value <= 0){
            endGame();
        }
    });

    function endGame(){
        timerLabel.value = 0;
        loopBlancos.cancel();
        loopTiempo.cancel();
        destroyAll('blanco');
        add([
            rect(width(), height()),
            color(8, 8, 8, 0.7),
            pos(0, 0),
            layer('ui'),
        ]);
        add([
            text('FIN DEL JUEGO', { size: 48 }),
            pos(center()),
            anchor('center'),
        ]);
        showRestartButton();
    }

    function showRestartButton(){
        add([
            text('Reiniciar', { size: 24 }),
            pos(center().x, center().y + 80),
            anchor('center'),
            area(),
            'botonReinicio',
            layer('ui'),
        ]);

        onClick('botonReinicio', () =>{
            go('main');
        });
    }
//**************************************************************************************** */
    //estos tres enemigos fueron creados de forma manual
    /*add([
        sprite('blanco'),
        pos(150, 350),
        area(),
        anchor('center'),
        'blanco',
    ]);
    add([
        sprite('blanco'),
        pos(100, 150),
        area(),
        anchor('center'),
        'blanco',
    ]);
    add([
        sprite('blanco'),
        pos(350, 100),
        area(),
        anchor('center'),
        'blanco',
    ]);*/
//**************************************************************************************** */

    onClick('blanco', (b) =>{
        destroy(b);

        add([
            text('+1'),
            pos(b.pos),
            color(200, 200, 50),
            anchor('center'),
            lifespan(0.5),
            opacity(0.5),
        ]);
        shake(2);

        puntos++;
        marcador.text = 'Puntos: ' + puntos;
    });
});

go('main');