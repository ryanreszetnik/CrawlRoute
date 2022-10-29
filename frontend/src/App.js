import logo from "./logo.svg";
import "./App.css";
import ControlInputs from "./Components/ControlInputs";
import LocationInputs from "./Components/LocationInputs";
import { useState } from "react";
import GeneratePDF from "./Components/GeneratePDF";
import LocationSelection from "./Pages/LocationSelection";
import ParameterInputs from "./Pages/ParameterInputs";
import FinalRoute from "./Pages/FinalRoute";
import Header from "./Components/Header";
import PDFOutput from "./Pages/PDFOutput";

function App() {
  const [page, setPage] = useState(1);

  const nextPage = () => {
    setPage((p) => p + 1);
  };
  const prevPage = () => {
    setPage((p) => p - 1);
  };
  return (
    <div className="App">
      <Header page={page} goBack={prevPage} />
      {page === 1 && <LocationSelection onSubmit={nextPage} />}
      {page === 2 && <ParameterInputs onSubmit={nextPage} />}
      {page === 3 && <FinalRoute onSubmit={nextPage} />}
      {page === 4 && <PDFOutput />}
    </div>
  );
}

export default App;
