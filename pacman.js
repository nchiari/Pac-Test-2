const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tileSize = 20;
const chaseRadius = 5; // Radio de persecución (en casillas)

// Configuración de Pac-Man
const pacman = {
    x: 1,
    y: 1,
    direction: 'right',
    nextDirection: 'right'
};

// Configuración de fantasmas (cada uno con color y velocidad diferente)
const ghosts = [
    { x: 9, y: 9, color: '#FF0000', speed: 2 },   // Rojo (Blinky)
    { x: 10, y: 9, color: '#FFB8FF', speed: 3 },  // Rosa (Pinky)
    { x: 9, y: 10, color: '#00FFFF', speed: 4 },  // Cian (Inky)
    { x: 10, y: 10, color: '#FFB852', speed: 5 }  // Naranja (Clyde)
];

// ... (el mapa y drawMap permanecen iguales) ...

function drawGhosts() {
    ghosts.forEach(ghost => {
        ctx.beginPath();
        ctx.arc(ghost.x * tileSize + tileSize/2, ghost.y * tileSize + tileSize/2, tileSize/2, 0, 2 * Math.PI);
        ctx.fillStyle = ghost.color;
        ctx.fill();
        ctx.closePath();
    });
}

function moveGhosts() {
    ghosts.forEach(ghost => {
        // Mover solo en ciertos frames según su velocidad
        if (performance.now() % ghost.speed !== 0) return;

        const directions = getValidDirections(ghost);
        let bestDirection = ghost.direction;

        // Calcular distancia a Pac-Man (Manhattan distance)
        const distanceX = Math.abs(ghost.x - pacman.x);
        const distanceY = Math.abs(ghost.y - pacman.y);
        const isChasing = (distanceX + distanceY) <= chaseRadius;

        if (isChasing) {
            // Perseguir: Elegir dirección que acerque más a Pac-Man
            let minDistance = Infinity;
            
            directions.forEach(dir => {
                const {x: newX, y: newY} = nextPosition(ghost, dir);
                const dist = Math.hypot(newX - pacman.x, newY - pacman.y);
                
                if (dist < minDistance) {
                    minDistance = dist;
                    bestDirection = dir;
                }
            });
        } else {
            // Movimiento aleatorio
            bestDirection = directions[Math.floor(Math.random() * directions.length)];
        }

        // Actualizar posición
        const {x: newX, y: newY} = nextPosition(ghost, bestDirection);
        ghost.x = newX;
        ghost.y = newY;
        ghost.direction = bestDirection;
    });
}

// Funciones auxiliares
function getValidDirections(entity) {
    const directions = [];
    if (map[entity.y - 1][entity.x] !== 1) directions.push('up');
    if (map[entity.y + 1][entity.x] !== 1) directions.push('down');
    if (map[entity.y][entity.x - 1] !== 1) directions.push('left');
    if (map[entity.y][entity.x + 1] !== 1) directions.push('right');
    return directions;
}

function nextPosition(entity, direction) {
    return {
        x: direction === 'left' ? entity.x - 1 : direction === 'right' ? entity.x + 1 : entity.x,
        y: direction === 'up' ? entity.y - 1 : direction === 'down' ? entity.y + 1 : entity.y
    };
}

// ... (las funciones restantes como checkCollisions, resetGame, etc. permanecen iguales) ...