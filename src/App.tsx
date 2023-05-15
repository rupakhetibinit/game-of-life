import { useCallback, useRef, useState } from 'react';
import './App.css';
import { produce } from 'immer';
const numCols = 40;
const numRows = 40;

const operations = [
	[0, 1],
	[0, -1],
	[1, 0],
	[-1, 0],
	[1, -1],
	[-1, 1],
	[1, 1],
	[-1, -1],
];

function App() {
	const [grid, setGrid] = useState<number[][]>(() => {
		let rows = [];
		for (let i = 0; i < numCols; i++) {
			rows.push(Array.from(Array(numRows), () => 0));
		}
		return rows;
	});

	const generateRandomGrid = () =>{
		setGrid(()=>{
			let rows = [];
			for (let i = 0; i<numCols;i++){
				rows.push(Array.from(Array(numRows),()=>Math.random()>0.5?1:0))
			}
			return rows;
		})
	}
	const [delay, setDelay] = useState(0);
	const [running, setRunning] = useState(false);
	const runningRef = useRef(running);
	runningRef.current = running;
	const runSimulation = useCallback(() => {
		if (!runningRef.current) {
			return;
		}
		setGrid((g) => {
			return produce(g, (gridCopy) => {
				for (let i = 0; i < numRows; i++) {
					for (let j = 0; j < numCols; j++) {
						let neighbours = 0;
						operations.forEach(([x, y]) => {
							const newI = i + x;
							const newJ = j + y;

							if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
								neighbours += g[newI][newJ];
							}

						});
						if (neighbours < 2 || neighbours > 3) {
							gridCopy[i][j] = 0;
						}

						if (g[i][j] === 0 && neighbours === 3) {
							gridCopy[i][j] = 1;
						}
					}
				}
			});
		});

		setTimeout(runSimulation, delay===0?500:delay);
	
	}, []);

	return (
		<>
			<input
				type='number'
				value={delay}
				onChange={(e) => setDelay(parseInt(e.target.value))}
			/>
			<button
				onClick={() => {
					setRunning((running) => !running);
					if (!running) {
						runningRef.current = true;
						runSimulation();
					}
				}}>
				{running ? 'Stop' : 'Start'} Simulation
			</button>
			<button onClick={generateRandomGrid}>Random Grid</button>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: `repeat(${numCols} , 20px)`,
				}}>
				{grid.map((rows, i) =>
					rows.map((col, j) => (
						<div
							onClick={() => {
								const newGrid = produce(grid, (gridCopy) => {
									gridCopy[i][j] = gridCopy[i][j] ? 0 : 1;
								});
								setGrid(newGrid);
							}}
							style={{
								width: 20,
								height: 20,
								border: '1px solid black',
								backgroundColor: grid[i][j] ? 'pink' : undefined,
							}}
							key={`${i}-${j}`}></div>
					))
				)}
			</div>
		</>
	);
}

export default App;
