import Nav from './components/Nav';
import Runway from './components/Runway';
import Process from './components/Process';
import Files from './components/Files';
import Archive from './components/Archive';
import About from './components/About';
import Experience from './components/Experience';
import Contact from './components/Contact';

export default function App() {
  return (
    <div>
      <Nav />
      <main>
        <Runway />
        <Process />
        <Files />
        <Archive />
        <About />
        <Experience />
        <Contact />
      </main>
    </div>
  );
}
