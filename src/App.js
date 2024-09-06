import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import "./App.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Helper function for Bubble Sort
const bubbleSort = (arr) => {
  let n = arr.length;
  let steps = 0;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      steps++;
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return { sortedArray: arr, steps, timeComplexity: "O(n^2)" };
};

// Helper function for Merge Sort
const mergeSort = (arr) => {
  let steps = 0;

  const merge = (left, right) => {
    let sorted = [];
    while (left.length && right.length) {
      steps++;
      if (left[0] < right[0]) {
        sorted.push(left.shift());
      } else {
        sorted.push(right.shift());
      }
    }
    return [...sorted, ...left, ...right];
  };

  const divide = (arr) => {
    if (arr.length <= 1) return arr;
    let mid = Math.floor(arr.length / 2);
    let left = divide(arr.slice(0, mid));
    let right = divide(arr.slice(mid));
    return merge(left, right);
  };

  return { sortedArray: divide(arr), steps, timeComplexity: "O(n log n)" };
};

// Helper function for Quick Sort
const quickSort = (arr) => {
  let steps = 0;

  const partition = (arr, low, high) => {
    let pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      steps++;
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
  };

  const sort = (arr, low, high) => {
    if (low < high) {
      let pi = partition(arr, low, high);
      sort(arr, low, pi - 1);
      sort(arr, pi + 1, high);
    }
  };

  const newArr = [...arr];
  sort(newArr, 0, newArr.length - 1);
  return { sortedArray: newArr, steps, timeComplexity: "O(n log n)" };
};

function App() {
  const [arraySize, setArraySize] = useState(10);
  const [array, setArray] = useState([]);
  const [sortedArray, setSortedArray] = useState([]);
  const [steps, setSteps] = useState(0);
  const [algorithm, setAlgorithm] = useState("");
  const [timeComplexity, setTimeComplexity] = useState("");
  const [stepsData, setStepsData] = useState({
    bubbleSort: [],
    mergeSort: [],
    quickSort: [],
  });

  // Generate a random array of a given size
  const generateArray = () => {
    const newArr = Array.from({ length: arraySize }, () =>
      Math.floor(Math.random() * 100)
    );
    setArray(newArr);
    setSortedArray([]);
  };

  // Run a specific algorithm and show result
  const handleSort = (type) => {
    let result;
    setAlgorithm(type);

    switch (type) {
      case "Bubble Sort":
        result = bubbleSort([...array]);
        setTimeComplexity(result.timeComplexity);
        break;
      case "Merge Sort":
        result = mergeSort([...array]);
        setTimeComplexity(result.timeComplexity);
        break;
      case "Quick Sort":
        result = quickSort([...array]);
        setTimeComplexity(result.timeComplexity);
        break;
      default:
        return;
    }

    setSortedArray(result.sortedArray);
    setSteps(result.steps);
  };

  // Run all algorithms for the graph comparison
  const runAllAlgorithms = () => {
    const arraySizes = [10, 20, 30, 40, 50, 60]; // Array sizes to test
    const bubbleSteps = [];
    const mergeSteps = [];
    const quickSteps = [];

    arraySizes.forEach((size) => {
      const randomArray = Array.from({ length: size }, () =>
        Math.floor(Math.random() * 100)
      );

      // Run Bubble Sort
      const bubbleResult = bubbleSort([...randomArray]);
      bubbleSteps.push(bubbleResult.steps);

      // Run Merge Sort
      const mergeResult = mergeSort([...randomArray]);
      mergeSteps.push(mergeResult.steps);

      // Run Quick Sort
      const quickResult = quickSort([...randomArray]);
      quickSteps.push(quickResult.steps);
    });

    setStepsData({
      bubbleSort: bubbleSteps,
      mergeSort: mergeSteps,
      quickSort: quickSteps,
    });
  };

  // Prepare data for Chart.js
  const data = {
    labels: [10, 20, 30, 40, 50, 60],
    datasets: [
      {
        label: "Bubble Sort Steps",
        data: stepsData.bubbleSort,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
      {
        label: "Merge Sort Steps",
        data: stepsData.mergeSort,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
      },
      {
        label: "Quick Sort Steps",
        data: stepsData.quickSort,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  return (
    <div className="App">
      <h1>Time Complexity Visualizer</h1>

      {/* Input for Array Size */}
      <div>
        <label>Array Size: </label>
        <input
          type="number"
          value={arraySize}
          onChange={(e) => setArraySize(Number(e.target.value))}
        />
        <button onClick={generateArray}>Generate Array</button>
      </div>

      {/* Original Array */}
      <div>
        <h2>Original Array:</h2>
        <p>{array.join(", ")}</p>
      </div>

      {/* Sorting Buttons */}
      <div>
        <button onClick={() => handleSort("Bubble Sort")}>Bubble Sort</button>
        <button onClick={() => handleSort("Merge Sort")}>Merge Sort</button>
        <button onClick={() => handleSort("Quick Sort")}>Quick Sort</button>
      </div>

      {/* Display Sorted Array and Time Complexity */}
      {sortedArray.length > 0 && (
        <div>
          <h2>Sorted Array ({algorithm}):</h2>
          <p>{sortedArray.join(", ")}</p>
          <p>Steps Taken: {steps}</p>
          <p>Time Complexity: {timeComplexity}</p>
        </div>
      )}

      {/* Button to run all algorithms and plot graph */}
      <button onClick={runAllAlgorithms}>Run All Algorithms</button>

      {/* Graph to visualize algorithm performance */}
      {stepsData.bubbleSort.length > 0 && (
        <div className="chart-container">
          <Line data={data} />
        </div>
      )}
    </div>
  );
}

export default App;
