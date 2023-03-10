import Dashboard from "./pages/Dashboard";
import './mixins.scss';
import './variables.scss';

function App(props: any) {
  return (
    <div className="App">
        <Dashboard {...props}/>
    </div>
  );
}

export default App;
