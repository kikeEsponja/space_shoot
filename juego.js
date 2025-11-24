//uso de la función kaplay por defecto
//kaplay();

//uso de la función kaplay personalizada (habilitar sólo una: o kaplay() o esta)
kaplay({
    width: 400,
    height: 400,
    background: '#d46eb3',
    scale: 2,
    canvas: document.getElementById('canvas'),
    letterbox: true, //esto crea un lienzo adaptativo
    global: true,
});

loadSprite('blanco', 'sprites/blanco.png');
loadSprite('mirilla', 'sprites/mirilla.png');
loadSound('hit', 'sounds/disparo.mp3');
loadSound('carga', 'sounds/carga_escopeta.wav');
loadSound('alarma', 'sounds/alarma.wav');

scene('main', () =>{
    add([
        rect(width(), height()),
        pos(0, 0),
        color(20,20,30),
    ]);

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
            text('FIN DEL JUEGO', { size: 48 }),
            pos(center()),
            anchor('center'),
        ]);
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
        play('hit'),
        shake(2),

        puntos++;
        marcador.text = 'Puntos: ' + puntos;
    });

});

go('main');