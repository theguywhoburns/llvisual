const visualizer = document.querySelector('.visualizer');
const resetButton = document.querySelector('.resetBtn');
const startBtn = document.querySelector('.startBtn');
const input = document.querySelector('input');
const select = document.querySelector('select');

let reset = false;
let data = [];

const sortFunctions = {
	"QuickSort" : quicksortentry,
	"BubbleSort": bubblesort,
	"ShellSort": shellsort,
	"CocktailShakerSort": cocktailshaker,
	"BogoSort(Not recomended for arrays bigger than 5)": bogosort,
	"GnomeSort": gnomesort,
	"Mergesort": mergesort,
};

Object.keys(sortFunctions).forEach(key => {
	const option = document.createElement('option');
	option.value = key;
	option.textContent = key;
	select.add(option);
});

let selectedSort = sortFunctions[select.value];
select.addEventListener('change', () => {
	selectedSort = sortFunctions[select.value];
});



async function sort() {
	while(!isSorted(data)) {
		if(reset) return;
		await selectedSort(data);
	}
}

function isSorted(arr) {
	for(let i = 0; i < arr.length - 1; i++) {
		if(arr[i].height > arr[i + 1].height) return false;
	}
	return true;
}


async function gnomesort(arr) {
	let i = 0;
	while(i < arr.length - 1) {
		if(arr[i].height <= arr[i + 1].height) {
			i++;
		} else {
			const temp = arr[i];
			arr[i] = arr[i + 1];
			arr[i + 1] = temp;
			if(i != 0) i--;
			if(reset) return;
			renderData(data);
			await delay((1 / data.length) * 10);
		}
	}
}


async function bogosort(arr) {
	while(true) {
		let isSorted = true;
		for(let i = 0; i < arr.length - 1; i++) {
			if(arr[i].height > arr[i + 1].height) {
				isSorted = false;
				shuffleArray(data);
				break;
			}
		}
		if(isSorted) break;
		if(reset) return;
		renderData(data);
		await delay(0);
	}
}

async function cocktailshaker(arr) {
	let left = 0;
	let right = arr.length - 1;
	let swapped = true;

	while(swapped) {
		swapped = false;
		for(let i = left; i < right; i++) {
			if(arr[i].height > arr[i + 1].height) {
				const temp = arr[i];
				arr[i] = arr[i + 1];
				arr[i + 1] = temp;
				swapped = true;
			}
			if(reset) return;
			renderData(data);
			await delay((1 / data.length) * 10);
		}
		right--;
		if(!swapped) break;

		swapped = false;
		for(let i = right; i > left; i--) {
			if(arr[i].height < arr[i - 1].height) {
				const temp = arr[i];
				arr[i] = arr[i - 1];
				arr[i - 1] = temp;
				swapped = true;
			}
			if(reset) return;
			renderData(data);
			await delay((1 / data.length) * 10);
		}
		left++;
	}
}

async function shellsort(arr) {
	let h = 1;
	while(h < arr.length / 3) h = 3 * h + 1;
	while(h >= 1) {
		for(let i = h; i < arr.length; i++) {
			let temp = arr[i];
			let j = i;
			while(j >= h && arr[j - h].height > temp.height) {
				arr[j] = arr[j - h];
				j -= h;
				if(reset) return;
				renderData(data);
				await delay((1 / data.length) * 10);
			}
			arr[j] = temp;
		}
		h = (h - 1) / 3;
	}
}

async function bubblesort(arr) {
	for(let i = 0; i < arr.length - 1; i++) {
		for(let j = 0; j < arr.length - i - 1; j++) {
			if(reset === true) return;
			if(arr[j].height > arr[j + 1].height) {
				const temp = arr[j];
				arr[j] = arr[j + 1];
				arr[j + 1] = temp;
				if(reset) return;
				renderData(data);
				await delay((1 / data.length) * 10);
			}
		}
	}
}

async function quicksortentry(arr) {
	await quicksort(0, arr.length - 1);
}
async function quicksort(left, right) {
	if(reset === true) return;
	if(left < right) {
		const pivotIndex = await partition(left, right);
		await quicksort(left, pivotIndex - 1);
		await quicksort(pivotIndex + 1, right);
	}
	renderData(data);
	async function partition(left, right) {
		const pivotValue = data[right].height;
		let pivotIndex = left;
		for(let i = left; i < right; i++) {
			if(data[i].height <= pivotValue) {
				const temp = data[i];
				data[i] = data[pivotIndex];
				data[pivotIndex] = temp;
				pivotIndex++;
				if(reset) return pivotIndex;
				renderData(data);
				await delay((1 / data.length) * 10);
			}
		}
		
		const temp = data[right];
		data[right] = data[pivotIndex];
		data[pivotIndex] = temp;
		
		return pivotIndex;
	}
}

async function mergesort(arr) {
	if(arr.length <= 1) return;
	const mid = Math.floor(arr.length / 2);

	const left = arr.slice(0, mid);
	const right = arr.slice(mid);

	await mergesort(left);
	await mergesort(right);

	merge(arr, left, right);
}

async function merge(arr, left, right) {
	let leftIndex = 0;
	let rightIndex = 0;
	let currentIndex = 0;

	while(leftIndex < left.length && rightIndex < right.length) {
		if(left[leftIndex].height <= right[rightIndex].height) {
			arr[currentIndex] = left[leftIndex];
			leftIndex++;
		} else {
			arr[currentIndex] = right[rightIndex];
			rightIndex++;
		}
		if(reset) return;
		renderData(arr);
		await delay(0);
		currentIndex++;
	}

	while(leftIndex < left.length) {
		arr[currentIndex] = left[leftIndex];
		leftIndex++;
		currentIndex++;
		if(reset) return;
		renderData(arr);
		await delay(0);
	}

	while(rightIndex < right.length) {
		arr[currentIndex] = right[rightIndex];
		rightIndex++;
		currentIndex++;
		if(reset) return;
		renderData(arr);
		await delay(0);
	}
}

function delay(milliseconds){
	return new Promise(resolve => {
			setTimeout(resolve, milliseconds);
	});
}

window.addEventListener('resize', () => {
	const width = visualizer.clientWidth;
	const amountOfElements = data.length;
	const widthPerElement = width / amountOfElements;
	visualizer.style.gridTemplateColumns = `repeat(${amountOfElements}, ${widthPerElement}px)`;
	renderData(data);
});

const colors = [];

// Define the colors
const lightBlue = '#BFEFFF';
const darkBlue =  '#000C35';
const darkGreen = '#004A38';
const lightGreen ='#BFFFE9';

function lerpColor(color1, color2, amount) {
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);

  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);

  const r = Math.round(r1 + (r2 - r1) * amount);
  const g = Math.round(g1 + (g2 - g1) * amount);
  const b = Math.round(b1 + (b2 - b1) * amount);

  const hex = ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  return `#${hex}`;
}

// Define the color steps
const numSteps = 100;
const colorSteps = [
  lerpColor(lightBlue, darkBlue, 0),
  lerpColor(darkBlue, darkGreen, 0.33),
  lerpColor(darkGreen, lightGreen, 0.66),
  lerpColor(lightGreen, lightBlue, 1),
];

// Generate the gradient colors
for (let i = 0; i < numSteps; i++) {
  const t = i / (numSteps - 1);
  let color;
  if (t < 0.33) {
    color = lerpColor(colorSteps[0], colorSteps[1], t / 0.33);
  } else if (t < 0.66) {
    color = lerpColor(colorSteps[1], colorSteps[2], (t - 0.33) / 0.33);
  } else {
    color = lerpColor(colorSteps[2], colorSteps[3], (t - 0.66) / 0.34); // Adjusted division to 0.34
  }
  colors.push(color);
}

input.addEventListener('input', () => {
	reset = true;
	const value = parseInt(input.value);
	if(isNaN(value)) return;
	/*
	if(value < 10) input.value = '10';
	if(value > 5000) input.value = '5000';
	*/
	const colorsLength = colors.length;

	const newData = [];
	for(let i = 0; i < value; i++) {
		const height = (i + 1) / value * 100;
		const color = colors[i % colorsLength];

		newData.push({height, color})
	}

	data = newData;
	renderData(data);
	window.dispatchEvent(new Event('resize')); // trigger initial resize
});

resetButton.addEventListener('click', async() => {
	reset = true;
	for(let i = 0; i < 100; i++) {
		shuffleArray(data);
		window.dispatchEvent(new Event('resize')); // trigger initial resize
		renderData(data);
		await delay(10);
	}
	reset = false;
});

function renderData(data) {
	visualizer.innerHTML = '';
	
	data.forEach(({height, color}, i) => {
		const div = document.createElement('div');
		div.classList.add('node');
		div.style.height = `${height / 1.15}vh`;
		div.style.backgroundColor = color;
		div.style.gridColumn = `${i + 1}/${i + 2}`;
		div.style.width = '100%';
		if(data.length < 500) {
			div.style.removeProperty("border");
			div.style.border = "1px solid #000000";
    	div.style.boxSizing = "content-box";
		}
		visualizer.appendChild(div);
	});
	visualizer.style.gridTemplateColumns= ` repeat(${data.length}, 1fr)`;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

startBtn.addEventListener('click', async() => {
	await sort();
})

input.dispatchEvent(new Event('input')); // trigger initial input event when loading the page