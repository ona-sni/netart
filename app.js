const versiculos = [
    { ref: "Romanos 12:2", texto: "No os conforméis a este siglo, sino transformaos por medio de la renovación de vuestro entendimiento, para que comprobéis cuál sea la buena voluntad de Dios, agradable y perfecta." },
    { ref: "2 Corintios 10:4", texto: "Porque las armas de nuestra milicia no son carnales, sino poderosas en Dios para la destrucción de fortalezas." },
    { ref: "2 Timoteo 1:7", texto: "Porque no nos ha dado Dios espíritu de cobardía, sino de poder, de amor y de dominio propio." },
    { ref: "Efesios 4:23", texto: "Y renovaos en el espíritu de vuestra mente." },
    { ref: "Santiago 4:7", texto: "Someteos, pues, a Dios; resistid al diablo, y huirá de vosotros." },
    { ref: "Lucas 10:19", texto: "He aquí os doy potestad de hollar serpientes y escorpiones, y sobre toda fuerza del enemigo, y nada os dañará." },
    { ref: "Efesios 6:11", texto: "Vestíos de toda la armadura de Dios, para que podáis estar firmes contra las asechanzas del diablo." },
    { ref: "Lamentaciones 3:25", texto: "Bueno es Jehová a los que en él esperan, al alma que le busca." },
    { ref: "1 Juan 4:4", texto: "Hijitos, vosotros sois de Dios, y los habéis vencido; porque mayor es el que está en vosotros, que el que está en el mundo." },
    { ref: "2 Tesalonicenses 3:3", texto: "Pero fiel es el Señor, que os afirmará y guardará del mal." }
];

let pasoActual = 0;
const totalPasos = versiculos.length;
let impulsosElectricos = []; // Almacena los voltios de energía en movimiento

const brainView = document.getElementById('brain-view');
const neuronsView = document.getElementById('neurons-view');
const svgRed = document.getElementById('red-neuronal');
const verseModal = document.getElementById('verse-modal');
const finalModal = document.getElementById('final-modal');
const verseTitle = document.getElementById('verse-title');
const verseText = document.getElementById('verse-text');
const btnContinuar = document.getElementById('btn-continuar');

brainView.addEventListener('click', () => {
    brainView.classList.add('zoom-in');
    
    setTimeout(() => {
        brainView.classList.add('oculto');
        neuronsView.classList.remove('oculto');
        
        setTimeout(() => {
            neuronsView.classList.add('visible-lento');
            dibujarRedNeuronalOrganica();
            iniciarTransmisionElectrica(); // Inicia el flujo de energía por las patitas/axones
        }, 100);
    }, 1500); 
});

function dibujarRedNeuronalOrganica() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    const nodos = [
        { x: 15, y: 50 }, { x: 30, y: 25 }, { x: 50, y: 15 }, 
        { x: 70, y: 30 }, { x: 85, y: 55 }, { x: 75, y: 80 }, 
        { x: 55, y: 85 }, { x: 35, y: 70 }, { x: 20, y: 80 }, 
        { x: 45, y: 45 }, { x: 65, y: 55 }
    ];

    dibujarRuidoDeFondo(width, height);

    for (let i = 0; i < totalPasos; i++) {
        let x1 = (nodos[i].x / 100) * width;
        let y1 = (nodos[i].y / 100) * height;
        let x2 = (nodos[i+1].x / 100) * width;
        let y2 = (nodos[i+1].y / 100) * height;

        crearConexionCurva(x1, y1, x2, y2, i);
        crearNeuronaRealista(x1, y1);
    }
    crearNeuronaRealista((nodos[totalPasos].x / 100) * width, (nodos[totalPasos].y / 100) * height);
}

function crearConexionCurva(x1, y1, x2, y2, indice) {
    let cx = (x1 + x2) / 2 + (Math.random() * 100 - 50);
    let cy = (y1 + y2) / 2 + (Math.random() * 100 - 50);

    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    let dPath = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
    
    path.setAttribute("d", dPath);
    path.setAttribute("class", "axon");
    path.setAttribute("id", `conexion-${indice}`);
    
    if (indice === 0) path.classList.add("activa");
    path.addEventListener('click', () => manejarClicConexion(indice));
    
    svgRed.appendChild(path);

    // Creamos bolitas de energía (voltios) que viajarán a lo largo de este caminito/axón
    crearVoltioElectrico(path);
}

function crearVoltioElectrico(pathElement) {
    let circuloVoltio = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circuloVoltio.setAttribute("r", 3.5);
    circuloVoltio.setAttribute("class", "impulso-electrico");
    svgRed.appendChild(circuloVoltio);

    // Guardamos la referencia y un progreso aleatorio de inicio (0 a 1)
    impulsosElectricos.push({
        elemento: circuloVoltio,
        path: pathElement,
        progreso: Math.random(),
        velocidade: 0.003 + Math.random() * 0.004 // Velocidad de flujo eléctrico
    });
}

function crearNeuronaRealista(x, y) {
    for(let i = 0; i < 5; i++) {
        let rx = x + (Math.random() * 45 - 22);
        let ry = y + (Math.random() * 45 - 22);
        let dendrita = document.createElementNS("http://www.w3.org/2000/svg", "line");
        dendrita.setAttribute("x1", x); dendrita.setAttribute("y1", y);
        dendrita.setAttribute("x2", rx); dendrita.setAttribute("y2", ry);
        dendrita.setAttribute("class", "dendrita");
        svgRed.appendChild(dendrita);
    }
    let soma = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    soma.setAttribute("cx", x); soma.setAttribute("cy", y);
    soma.setAttribute("r", 5); soma.setAttribute("class", "soma-neurona");
    svgRed.appendChild(soma);
}

function dibujarRuidoDeFondo(width, height) {
    for(let i=0; i < 15; i++) {
        let x1 = Math.random() * width; let y1 = Math.random() * height;
        let x2 = x1 + (Math.random() * 180 - 90); 
        let y2 = y1 + (Math.random() * 180 - 90);
        
        let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        let cx = (x1 + x2) / 2 + 20; let cy = (y1 + y2) / 2 - 20;
        let dPath = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
        
        path.setAttribute("d", dPath);
        path.setAttribute("stroke", "rgba(10, 30, 50, 0.4)"); 
        path.setAttribute("stroke-width", "1"); path.setAttribute("fill", "none");
        svgRed.appendChild(path);
        
        // Añadimos un voltio tenue viajando por estas conexiones de fondo también
        crearVoltioElectrico(path);
        crearNeuronaRealista(x1, y1);
    }
}

// Mueve los "voltios" de energía de manera fluida a lo largo de las rutas (axones)
function iniciarTransmisionElectrica() {
    function animarFlujo() {
        requestAnimationFrame(animarFlujo);

        impulsosElectricos.forEach(item => {
            item.progreso += item.velocidade;
            if (item.progreso > 1) item.progreso = 0; // Reinicia el ciclo al llegar al final del axón

            // Obtiene la coordenada exacta (x, y) sobre la curva del SVG en base al progreso actual
            let punto = item.path.getPointAtLength(item.progreso * item.path.getTotalLength());
            item.elemento.setAttribute("cx", punto.x);
            item.elemento.setAttribute("cy", punto.y);
        });
    }
    animarFlujo();
}

function manejarClicConexion(indice) {
    if (indice === pasoActual) {
        const pathActual = document.getElementById(`conexion-${indice}`);
        verseTitle.textContent = versiculos[indice].ref;
        verseText.textContent = versiculos[indice].texto;
        verseModal.classList.remove('oculto');
        
        pathActual.classList.remove('activa');
        pathActual.classList.add('desbloqueada');
    }
}

btnContinuar.addEventListener('click', () => {
    verseModal.classList.add('oculto');
    pasoActual++;
    
    if (pasoActual < totalPasos) {
        const siguientePath = document.getElementById(`conexion-${pasoActual}`);
        siguientePath.classList.add('activa');
    } else {
        setTimeout(() => {
            mostrarFinal();
        }, 500);
    }
});

function mostrarFinal() {
    finalModal.classList.remove('oculto');
    lanzarConfeti();
}

function lanzarConfeti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let particles = [];
    const colors = ['#ffd700', '#00ff88', '#00d2ff', '#ffffff'];

    for(let i = 0; i < 200; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            r: Math.random() * 6 + 3,
            dx: Math.random() * 4 - 2,
            dy: Math.random() * 5 + 2,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }

    function animarConfeti() {
        requestAnimationFrame(animarConfeti);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.y += p.dy;
            p.x += p.dx;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();

            if (p.y > canvas.height) {
                p.y = -10;
                p.x = Math.random() * canvas.width;
            }
        });
    }
    animarConfeti();
}
