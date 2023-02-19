import { ScatterChart, XAxis, YAxis, Legend, Scatter } from "recharts";
import dataset from "../Uncountable Front End Dataset.json";
import Demo from "./MenuComponent";

function TestComponent() {
  var p = {
    p1: "value1",
    p2: "value2",
    p3: "value3",
  };

  // TODO Object.entries performant for large datasets?
  // TODO consider using an interface
  let arr = Object.entries(dataset)

  // for (let key in dataset) {
  // 	console.log(`${key}: ${dataset[key]}`)
  // }

  const chart = (
    <p>hello</p>
    // <ScatterChart width={600} height={300}>

    // 	<Legend />
    // 	<XAxis dataKey="Polymer 1" type="number" name="Polymer 1" unit="amt"/>
    // 	<YAxis dataKey="Cure Time" type="number" name="Cure Time" unit="s"/>
    // 	<Scatter name="Compression Set" data={dataset} fill="#8884d8" />
    // </ScatterChart>
  );

  return (
    <>
      <h1>Experiments</h1>
      <Demo/>
    </>
  );
}

export default TestComponent;
