document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('grid');
    const controls = document.querySelectorAll('.tool');
    const findPathBtn = document.getElementById('btn-find-path');
    const resetBtn = document.getElementById('btn-reset');
    const statusMsg = document.getElementById('status-message');

    const ROWS = 20;
    const COLS = 20;

    // State
    let grid = []; // 0: empty, 1: wall
    let startPos = null;
    let endPos = null;
    let currentTool = 'wall';
    let isDrawing = false;
    let isComputing = false;

    // Initialize
    initGrid();
    setupEventListeners();

    function initGrid() {
        gridContainer.innerHTML = '';
        gridContainer.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;
        grid = [];

        for (let r = 0; r < ROWS; r++) {
            const row = [];
            for (let c = 0; c < COLS; c++) {
                row.push(0);
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.r = r;
                cell.dataset.c = c;

                // Mouse interaction for drawing
                cell.addEventListener('mousedown', () => {
                    isDrawing = true;
                    if (!isComputing) handleCellClick(r, c);
                });
                cell.addEventListener('mouseenter', () => {
                    if (isDrawing && !isComputing) handleCellClick(r, c);
                });

                gridContainer.appendChild(cell);
            }
            grid.push(row);
        }

        // Set default start and end
        setSpecialCell(0, 0, 'start');
        setSpecialCell(ROWS - 1, COLS - 1, 'end');
    }

    function setupEventListeners() {
        // Tool selection
        controls.forEach(btn => {
            btn.addEventListener('click', () => {
                if (isComputing) return;
                controls.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentTool = btn.dataset.tool;
            });
        });

        // Global mouseup to stop drawing
        window.addEventListener('mouseup', () => isDrawing = false);

        // Buttons
        resetBtn.addEventListener('click', () => {
            if (isComputing) return;
            resetVisualization();
            initGrid();
            statusMsg.textContent = "Grid reset.";
        });

        findPathBtn.addEventListener('click', () => {
            if (isComputing) return;
            if (!startPos || !endPos) {
                statusMsg.textContent = "Silahkan tentukan Start point dan exit point anda terlebih dahulu";
                return;
            }
            resetVisualization(); // Clear previous paths
            isComputing = true;
            statusMsg.textContent = "Sedang Menkalkulasi Jalur Exit Point...";
            findPathBtn.disabled = true;

            // Run algorithm
            backtrack(startPos.r, startPos.c).then(found => {
                isComputing = false;
                findPathBtn.disabled = false;
                if (found) {
                    statusMsg.textContent = "Exit Point telah di temukan, ikuti garis biru.";
                } else {
                    statusMsg.textContent = "Exit Point tidak di temukan";
                }
            });
        });
    }

    function handleCellClick(r, c) {
        if (currentTool === 'start') {
            setSpecialCell(r, c, 'start');
        } else if (currentTool === 'end') {
            setSpecialCell(r, c, 'end');
        } else if (currentTool === 'wall') {
            toggleWall(r, c);
        }
    }

    function setSpecialCell(r, c, type) {
        // Clear previous if exists
        if (type === 'start' && startPos) {
            const old = getCell(startPos.r, startPos.c);
            old.classList.remove('start');
        }
        if (type === 'end' && endPos) {
            const old = getCell(endPos.r, endPos.c);
            old.classList.remove('end');
        }

        // Check conflicts
        if (type === 'start' && endPos && endPos.r === r && endPos.c === c) {
            endPos = null;
        }
        if (type === 'end' && startPos && startPos.r === r && startPos.c === c) {
            startPos = null;
        }

        // Set new
        const cell = getCell(r, c);
        cell.classList.remove('wall', 'start', 'end');
        grid[r][c] = 0; // Ensure it's not a wall logic-wise

        if (type === 'start') {
            cell.classList.add('start');
            startPos = { r, c };
        } else if (type === 'end') {
            cell.classList.add('end');
            endPos = { r, c };
        }
    }

    function toggleWall(r, c) {
        // Don't overwrite start/end
        if ((startPos && startPos.r === r && startPos.c === c) ||
            (endPos && endPos.r === r && endPos.c === c)) {
            return;
        }

        const cell = getCell(r, c);
        if (grid[r][c] === 1) {
            grid[r][c] = 0;
            cell.classList.remove('wall');
        } else {
            grid[r][c] = 1;
            cell.classList.add('wall');
        }
    }

    function getCell(r, c) {
        return gridContainer.children[r * COLS + c];
    }

    function resetVisualization() {
        // Clear visited and path classes, but keep walls, start, end
        const cells = gridContainer.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.classList.remove('visited', 'path');
        });
    }

    // --- Backtracking Algorithm ---

    async function backtrack(r, c, visited = new Set()) {
        const key = `${r},${c}`;

        // 1. Base Case: Invalid or Wall or Visited
        if (r < 0 || c < 0 || r >= ROWS || c >= COLS ||
            grid[r][c] === 1 || visited.has(key)) {
            return false;
        }

        // Visualize "checking"
        const cell = getCell(r, c);
        // Don't color start/end as 'visited' visually to keep them distinct, 
        // but logic needs to know they are visited.
        if (!cell.classList.contains('start') && !cell.classList.contains('end')) {
            cell.classList.add('visited');
        }

        // Artificial delay for visualization
        await new Promise(resolve => setTimeout(resolve, 20));

        // 2. Base Case: Reached Destination
        if (r === endPos.r && c === endPos.c) {
            return true;
        }

        visited.add(key);

        // 3. Recursive Step: Explore neighbors (Right, Down, Left, Up)
        // Prefer Right/Down for typical reading order, but any order works
        const directions = [
            { dr: 0, dc: 1 },  // Right
            { dr: 1, dc: 0 },  // Down
            { dr: 0, dc: -1 }, // Left
            { dr: -1, dc: 0 }  // Up
        ];

        for (const { dr, dc } of directions) {
            if (await backtrack(r + dr, c + dc, visited)) {
                // If this path leads to the end, mark it as part of solution
                if (!cell.classList.contains('start') && !cell.classList.contains('end')) {
                    cell.classList.remove('visited');
                    cell.classList.add('path');
                    // Add a small delay for the path drawing back
                    await new Promise(resolve => setTimeout(resolve, 30));
                }
                return true;
            }
        }

        // Backtrack: if no neighbors work, return false
        // Optional: Removing 'visited' visually if we want to show dead ends fading? 
        // For simple backtracking, usually we just leave them as "visited" (explored).
        return false;
    }
});
